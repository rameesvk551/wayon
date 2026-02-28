/**
 * TOPTW Solver — Team Orienteering Problem with Time Windows
 * Converted from route-optimizer domain/services/strategies/TOPTWStrategy.ts
 */

import { haversineDistance } from "../../utils/distance.js";

export class TOPTWStrategy {

    static solve(input) {
        const attractionsInternal = input.attractions.map(a => ({
            id: a.id,
            lat: a.location.lat,
            lng: a.location.lng,
            priority: a.priority,
            visitDuration: a.visitDuration,
            timeWindow: a.timeWindow ? { open: a.timeWindow.open, close: a.timeWindow.close } : undefined,
        }));

        const {
            numDays,
            maxDailyMinutes = 600,
            dayStartTime = "09:00",
            startLocation,
            avgSpeedKmh = 30,
            durationMatrixSeconds,
        } = input;

        const centre = startLocation ?? {
            lat: attractionsInternal.reduce((s, a) => s + a.lat, 0) / attractionsInternal.length,
            lng: attractionsInternal.reduce((s, a) => s + a.lng, 0) / attractionsInternal.length,
        };

        let attractionIndexMap;
        if (durationMatrixSeconds) {
            attractionIndexMap = new Map();
            attractionsInternal.forEach((a, i) => attractionIndexMap.set(a.id, i + 1));
        }

        const ctx = {
            dayStartMin: this.hmToMinutes(dayStartTime),
            maxDailyMin: maxDailyMinutes,
            speedKmh: avgSpeedKmh,
            startLoc: centre,
            durationMatrix: durationMatrixSeconds,
            attractionIndexMap,
        };

        // 1 — Greedy insertion
        let { days, unassigned } = this.greedyInsertion(attractionsInternal, numDays, ctx);

        // 2 — Intra-day 2-opt
        days = days.map((d) => this.intraDayTwoOpt(d, ctx));

        // 3 — Inter-day relocate
        days = this.interDayRelocate(days, ctx);

        // 4 — Inter-day swap
        days = this.interDaySwap(days, ctx);

        // 5 — Re-insert dropped
        const reinsertion = this.reinsertDropped(days, unassigned, ctx);
        days = reinsertion.days;
        unassigned = reinsertion.stillUnassigned;

        // Final 2-opt pass
        days = days.map((d) => this.intraDayTwoOpt(d, ctx));

        return this.buildResult(days, unassigned, input.attractions, ctx);
    }

    static hmToMinutes(hm) {
        const [h, m] = hm.split(":").map(Number);
        return h * 60 + m;
    }

    static minutesToHm(mins) {
        const h = Math.floor(mins / 60) % 24;
        const m = Math.round(mins % 60);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }

    static openMin(a) {
        return this.hmToMinutes(a.timeWindow?.open || "09:00");
    }

    static closeMin(a, ctx) {
        if (a.timeWindow?.close) return this.hmToMinutes(a.timeWindow.close);
        let close = this.hmToMinutes("21:00");
        if (ctx) {
            const dayEnd = ctx.dayStartMin + ctx.maxDailyMin;
            if (dayEnd > close) close = dayEnd;
        }
        return close;
    }

    static travelMinutes(a, b, speedKmh) {
        const distKm = haversineDistance(
            { latitude: a.lat, longitude: a.lng },
            { latitude: b.lat, longitude: b.lng }
        );
        return (distKm / speedKmh) * 60;
    }

    static matrixTravelMinutes(prevIdx, curIdx, ctx) {
        const secs = ctx.durationMatrix[prevIdx][curIdx];
        return secs / 60;
    }

    static evaluateSequence(seq, ctx) {
        if (seq.length === 0) return { feasible: true, totalMinutes: 0, stops: [] };

        const useMatrix = !!ctx.durationMatrix && !!ctx.attractionIndexMap;
        let clock = ctx.dayStartMin;
        let prevLoc = ctx.startLoc;
        let prevIdx = 0;
        let totalTravel = 0;
        let totalVisit = 0;
        let totalWait = 0;
        const stops = [];

        for (const attr of seq) {
            const curIdx = useMatrix ? (ctx.attractionIndexMap.get(attr.id) ?? -1) : -1;
            const travel = (useMatrix && curIdx >= 0)
                ? this.matrixTravelMinutes(prevIdx, curIdx, ctx)
                : this.travelMinutes(prevLoc, attr, ctx.speedKmh);

            totalTravel += travel;
            clock += travel;

            const open = this.openMin(attr);
            const close = this.closeMin(attr, ctx);
            let wait = 0;
            if (clock < open) {
                wait = open - clock;
                clock = open;
            }
            totalWait += wait;

            if (clock > close) return { feasible: false, totalMinutes: -1, stops: [] };
            if (clock + attr.visitDuration > close) return { feasible: false, totalMinutes: -1, stops: [] };

            const arrival = clock;
            clock += attr.visitDuration;
            totalVisit += attr.visitDuration;

            stops.push({
                attractionId: attr.id,
                arrivalTime: this.minutesToHm(arrival),
                departureTime: this.minutesToHm(clock),
                travelFromPrevMinutes: Math.round(travel),
                waitMinutes: Math.round(wait),
            });

            prevLoc = { lat: attr.lat, lng: attr.lng };
            if (useMatrix && curIdx >= 0) prevIdx = curIdx;
        }

        const lastIdx = prevIdx;
        const returnTravel = (useMatrix && lastIdx >= 0)
            ? this.matrixTravelMinutes(lastIdx, 0, ctx)
            : this.travelMinutes(prevLoc, ctx.startLoc, ctx.speedKmh);
        totalTravel += returnTravel;
        clock += returnTravel;

        const totalMinutes = totalTravel + totalVisit + totalWait;
        if (totalMinutes > ctx.maxDailyMin) {
            return { feasible: false, totalMinutes, stops: [] };
        }

        return { feasible: true, totalMinutes, stops };
    }

    static greedyInsertion(attractions, numDays, ctx) {
        const sorted = [...attractions].sort((a, b) => {
            const pDiff = (b.priority || 5) - (a.priority || 5);
            if (pDiff !== 0) return pDiff;
            return this.closeMin(a, ctx) - this.closeMin(b, ctx);
        });

        const days = Array.from({ length: numDays }, () => []);
        const assigned = new Set();

        for (const attr of sorted) {
            let bestDay = -1;
            let bestPos = -1;
            let bestCost = Infinity;

            for (let d = 0; d < numDays; d++) {
                const seq = days[d];
                for (let pos = 0; pos <= seq.length; pos++) {
                    const candidate = [...seq.slice(0, pos), attr, ...seq.slice(pos)];
                    const result = this.evaluateSequence(candidate, ctx);
                    if (result.feasible && result.totalMinutes < bestCost) {
                        bestCost = result.totalMinutes;
                        bestDay = d;
                        bestPos = pos;
                    }
                }
            }

            if (bestDay >= 0) {
                days[bestDay].splice(bestPos, 0, attr);
                assigned.add(attr.id);
            }
        }

        const unassigned = attractions.filter((a) => !assigned.has(a.id));
        return { days, unassigned };
    }

    static intraDayTwoOpt(day, ctx) {
        if (day.length < 3) return day;
        let improved = true;
        let best = [...day];
        while (improved) {
            improved = false;
            for (let i = 0; i < best.length - 1; i++) {
                for (let j = i + 1; j < best.length; j++) {
                    const candidate = [...best.slice(0, i), ...best.slice(i, j + 1).reverse(), ...best.slice(j + 1)];
                    const result = this.evaluateSequence(candidate, ctx);
                    if (result.feasible && result.totalMinutes < this.evaluateSequence(best, ctx).totalMinutes) {
                        best = candidate;
                        improved = true;
                    }
                }
            }
        }
        return best;
    }

    static interDayRelocate(days, ctx) {
        let improved = true;
        while (improved) {
            improved = false;
            for (let d1 = 0; d1 < days.length; d1++) {
                for (let i = 0; i < days[d1].length; i++) {
                    const attr = days[d1][i];
                    const d1Without = [...days[d1].slice(0, i), ...days[d1].slice(i + 1)];
                    const d1Score = this.evaluateSequence(d1Without, ctx);
                    if (!d1Score.feasible && d1Without.length > 0) continue;

                    for (let d2 = 0; d2 < days.length; d2++) {
                        if (d2 === d1) continue;
                        for (let pos = 0; pos <= days[d2].length; pos++) {
                            const d2With = [...days[d2].slice(0, pos), attr, ...days[d2].slice(pos)];
                            const d2Score = this.evaluateSequence(d2With, ctx);
                            if (!d2Score.feasible) continue;

                            const oldTotal = this.evaluateSequence(days[d1], ctx).totalMinutes + this.evaluateSequence(days[d2], ctx).totalMinutes;
                            const newTotal = (d1Score.totalMinutes || 0) + d2Score.totalMinutes;

                            if (newTotal < oldTotal) {
                                days[d1] = d1Without;
                                days[d2] = d2With;
                                improved = true;
                                break;
                            }
                        }
                        if (improved) break;
                    }
                    if (improved) break;
                }
                if (improved) break;
            }
        }
        return days;
    }

    static interDaySwap(days, ctx) {
        let improved = true;
        while (improved) {
            improved = false;
            for (let d1 = 0; d1 < days.length - 1; d1++) {
                for (let d2 = d1 + 1; d2 < days.length; d2++) {
                    for (let i = 0; i < days[d1].length; i++) {
                        for (let j = 0; j < days[d2].length; j++) {
                            const newD1 = [...days[d1]];
                            const newD2 = [...days[d2]];
                            const tmp = newD1[i];
                            newD1[i] = newD2[j];
                            newD2[j] = tmp;

                            const r1 = this.evaluateSequence(newD1, ctx);
                            const r2 = this.evaluateSequence(newD2, ctx);
                            if (!r1.feasible || !r2.feasible) continue;

                            const oldTotal = this.evaluateSequence(days[d1], ctx).totalMinutes + this.evaluateSequence(days[d2], ctx).totalMinutes;
                            const newTotal = r1.totalMinutes + r2.totalMinutes;

                            if (newTotal < oldTotal) {
                                days[d1] = newD1;
                                days[d2] = newD2;
                                improved = true;
                            }
                        }
                    }
                }
            }
        }
        return days;
    }

    static reinsertDropped(days, unassigned, ctx) {
        const remaining = [];
        for (const attr of unassigned) {
            let placed = false;
            for (let d = 0; d < days.length; d++) {
                for (let pos = 0; pos <= days[d].length; pos++) {
                    const candidate = [...days[d].slice(0, pos), attr, ...days[d].slice(pos)];
                    const result = this.evaluateSequence(candidate, ctx);
                    if (result.feasible) {
                        days[d] = candidate;
                        placed = true;
                        break;
                    }
                }
                if (placed) break;
            }
            if (!placed) remaining.push(attr);
        }
        return { days, stillUnassigned: remaining };
    }

    static buildResult(days, unassigned, originalAttractions, ctx) {
        let totalScore = 0;

        const resultDays = days.map((seq, idx) => {
            const evaluation = this.evaluateSequence(seq, ctx);
            const dayScore = seq.reduce((s, a) => s + (a.priority || 5), 0);
            totalScore += dayScore;

            return {
                day: idx + 1,
                stops: evaluation.stops,
                totalMinutes: evaluation.totalMinutes,
            };
        });

        const unassignedEntities = unassigned.map(u => originalAttractions.find(a => a.id === u.id)).filter(Boolean);

        return {
            days: resultDays,
            unassigned: unassignedEntities,
            totalScore,
        };
    }
}
