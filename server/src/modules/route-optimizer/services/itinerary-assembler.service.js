/**
 * Itinerary Assembler — constructs the rich itinerary response from optimization results.
 * Converted from route-optimizer application/services/ItineraryAssembler.ts
 */

import { haversineDistance } from "../utils/distance.js";

export class ItineraryAssembler {

    static assemble(result, originalRequest, jobId) {
        const dailyPlan = result.days.map((day) => {
            const stops = day.stops.map((stop, idx) => {
                const attraction = originalRequest.attractions.find((a) => a.id === stop.attractionId);

                let distKm = 0;
                if (idx > 0) {
                    const prevStop = day.stops[idx - 1];
                    const prevAttr = originalRequest.attractions.find((a) => a.id === prevStop.attractionId);
                    if (attraction && prevAttr) {
                        distKm = haversineDistance(
                            { latitude: prevAttr.lat, longitude: prevAttr.lng },
                            { latitude: attraction.lat, longitude: attraction.lng }
                        );
                    }
                }

                const transportMode = this.pickTransportMode(distKm, originalRequest.preferences?.travelType);

                return {
                    seq: idx + 1,
                    attractionId: stop.attractionId,
                    name: attraction?.name || "Unknown",
                    category: attraction?.category || "general",
                    description: attraction?.description || "",
                    image: attraction?.image || "",
                    lat: attraction?.lat,
                    lng: attraction?.lng,
                    arrivalTime: stop.arrivalTime,
                    departureTime: stop.departureTime,
                    visitDurationMinutes: attraction?.visitDuration || 60,
                    travelFromPrevMinutes: stop.travelFromPrevMinutes,
                    transportMode,
                    distanceFromPrevKm: Math.round(distKm * 10) / 10,
                };
            });

            return {
                day: day.day,
                title: `Day ${day.day}`,
                stops,
                summary: {
                    ...result.days.find((d) => d.day === day.day),
                },
            };
        });

        return {
            jobId,
            destination: originalRequest.destination,
            numDays: originalRequest.numDays,
            dailyPlan,
            unassigned: result.unassigned,
            summary: {
                totalAttractions: originalRequest.attractions.length,
                assignedAttractions: originalRequest.attractions.length - result.unassigned.length,
                totalScore: result.totalScore,
            },
        };
    }

    static pickTransportMode(distKm, preferredType) {
        if (preferredType) {
            if (preferredType === "WALKING" && distKm > 3) return "PUBLIC_TRANSPORT";
            if (preferredType === "CYCLING" && distKm > 15) return "PUBLIC_TRANSPORT";
            return preferredType;
        }
        if (distKm < 1) return "WALKING";
        if (distKm < 5) return "PUBLIC_TRANSPORT";
        if (distKm < 15) return "PUBLIC_TRANSPORT";
        return "DRIVING";
    }
}
