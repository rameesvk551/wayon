/**
 * PDF Map Embedder — resolves stops, builds day maps, cover maps, cluster summaries.
 * Converted from pdf-service pdf-map-embedder.ts — all logic identical.
 */

import { GeocodingService, buildGeocodeCacheKey } from "./geocoding.service.js";
import { MapGeneratorService } from "./map-generator.service.js";
import { RouteCalculationService } from "./route-calculation.service.js";
import { DistanceEstimatorService } from "./distance-estimator.service.js";

const DAY_COLOR_PALETTE = [
    { name: "Blue", hex: "1d4ed8" }, { name: "Orange", hex: "f97316" },
    { name: "Green", hex: "16a34a" }, { name: "Red", hex: "dc2626" },
    { name: "Teal", hex: "0f766e" }, { name: "Indigo", hex: "4338ca" },
    { name: "Amber", hex: "ca8a04" }, { name: "Rose", hex: "be123c" },
];

const mapVisualizationEnabled = (payload) =>
    process.env.MAP_VISUALIZATION_ENABLED !== "false" && payload.output.enableMapVisualizations !== false;

const normalizeText = (value) =>
    value.toLowerCase().replace(/[()[\]{}]/g, " ").replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();

const parseDayHint = (subtitle) => {
    if (!subtitle) return null;
    const match = subtitle.match(/day\s*(\d+)/i);
    if (!match) return null;
    const day = Number(match[1]);
    return Number.isFinite(day) ? day : null;
};

const getDayColor = (dayNumber) => {
    const item = DAY_COLOR_PALETTE[(Math.max(1, dayNumber) - 1) % DAY_COLOR_PALETTE.length];
    return { name: item.name, hex: `#${item.hex}`, rawHex: item.hex };
};

const normalizeHexColor = (value, fallback) => {
    if (!value) return fallback;
    const trimmed = value.trim();
    return trimmed ? (trimmed.startsWith("#") ? trimmed : `#${trimmed}`) : fallback;
};

const indexToLetter = (index) => String.fromCharCode(65 + (index % 26));
const hasCoordinates = (marker) => Number.isFinite(marker.lat) && Number.isFinite(marker.lng);

const buildHull = (points) => {
    if (points.length < 3) return [];
    const unique = new Map();
    for (const p of points) { const k = `${p.lat.toFixed(6)}:${p.lng.toFixed(6)}`; if (!unique.has(k)) unique.set(k, p); }
    const sorted = Array.from(unique.values()).sort((a, b) => a.lng === b.lng ? a.lat - b.lat : a.lng - b.lng);
    if (sorted.length < 3) return [];
    const cross = (o, a, b) => (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);
    const lower = [];
    for (const p of sorted) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) { const p = sorted[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
    upper.pop(); lower.pop();
    return [...lower, ...upper];
};

const buildOutlinePath = (points, color = "#0ea5e9") => {
    const hull = buildHull(points);
    if (hull.length < 3) return null;
    const coordinates = hull.map(p => [p.lng, p.lat]);
    coordinates.push([hull[0].lng, hull[0].lat]);
    return { coordinates, color, width: 5, opacity: 0.45 };
};

export class PdfMapEmbedder {
    #geocoder;
    #mapGenerator;
    #routeCalculator;
    #distanceEstimator;

    constructor() {
        this.#geocoder = new GeocodingService();
        this.#mapGenerator = new MapGeneratorService();
        this.#routeCalculator = new RouteCalculationService();
        this.#distanceEstimator = new DistanceEstimatorService();
    }

    async build(payload) {
        const enabled = mapVisualizationEnabled(payload);
        const resolvedStops = await this.#resolveStops(payload);
        const markers = this.#buildCoverMarkers(resolvedStops);
        const fallbackCenter = payload.map.center;
        const clusterSummaryRows = this.#buildClusterSummaryRows(payload, resolvedStops);
        const overviewMapImage = await this.#buildOverviewMap(payload, resolvedStops, fallbackCenter);

        if (!enabled) {
            return {
                enabled: false, mapImage: overviewMapImage, overviewMapImage,
                dayLegend: [], distanceSummaryRows: [], clusterSummaryRows,
                days: payload.days,
                markers: markers.length ? markers : this.#markersFromPayload(payload.map.markers),
            };
        }

        const daySections = await this.#buildDaySections(payload, resolvedStops);
        const dayMapByNumber = new Map(daySections.map(s => [s.dayNumber, s]));

        const days = payload.days.map(day => {
            const section = dayMapByNumber.get(day.dayNumber);
            return {
                ...day,
                dayColorHex: section?.dayColorHex,
                dayColorName: section?.dayColorName,
                dayMapImage: section?.mapImage,
                dayRouteProvider: section?.routeProvider,
                distanceSummary: section ? { totalDistanceLabel: section.totalDistanceLabel, totalTimeLabel: section.totalTimeLabel, totalDistanceKm: section.totalDistanceKm, totalEstimatedMinutes: section.totalEstimatedMinutes } : undefined,
                distanceSegments: section?.segments || [],
            };
        });

        const dayLegend = payload.days.map(day => {
            const color = getDayColor(day.dayNumber);
            return { dayNumber: day.dayNumber, colorHex: color.hex, colorName: color.name };
        });

        const distanceSummaryRows = daySections.map(s => ({
            dayNumber: s.dayNumber, dayColorHex: s.dayColorHex, dayColorName: s.dayColorName,
            stopCount: s.stopCount, segmentCount: s.segments.length,
            totalDistanceKm: s.totalDistanceKm, totalEstimatedMinutes: s.totalEstimatedMinutes,
            totalDistanceLabel: s.totalDistanceLabel, totalTimeLabel: s.totalTimeLabel,
        }));

        return {
            enabled: true, mapImage: overviewMapImage, overviewMapImage,
            dayLegend, distanceSummaryRows, clusterSummaryRows, days,
            markers: markers.length ? markers : this.#markersFromPayload(payload.map.markers),
        };
    }

    async #resolveStops(payload) {
        const markerPool = payload.map.markers
            .map((marker, index) => ({ index, marker, normalizedTitle: normalizeText(marker.title || marker.label || ""), dayHint: parseDayHint(marker.subtitle) }))
            .filter(item => hasCoordinates(item.marker));

        const usedMarkerIndexes = new Set();
        const unresolved = [];
        const resolved = [];

        for (const day of payload.days) {
            for (let i = 0; i < day.activities.length; i++) {
                const activity = day.activities[i];
                const normalizedName = normalizeText(activity.name || "");
                const picked = this.#pickMarker(markerPool, usedMarkerIndexes, normalizedName, day.dayNumber);

                if (picked) {
                    resolved.push({ dayNumber: day.dayNumber, sequence: i + 1, name: activity.name, category: activity.category, lat: picked.marker.lat, lng: picked.marker.lng });
                    continue;
                }

                const geocodeInput = { name: activity.location || activity.name, city: day.city || payload.trip.destination };
                unresolved.push({ dayNumber: day.dayNumber, sequence: i + 1, name: activity.name, queryName: geocodeInput.name, category: activity.category, city: geocodeInput.city, key: buildGeocodeCacheKey(geocodeInput) });
            }
        }

        if (!unresolved.length) return resolved;

        const geocoded = await this.#geocoder.geocodeMany(unresolved.map(item => ({ name: item.queryName, city: item.city })));
        for (const item of unresolved) {
            const location = geocoded.get(item.key);
            if (!location) continue;
            resolved.push({ dayNumber: item.dayNumber, sequence: item.sequence, name: item.name, category: item.category, lat: location.lat, lng: location.lng });
        }
        return resolved;
    }

    #pickMarker(markerPool, usedMarkerIndexes, normalizedName, dayNumber) {
        if (!normalizedName) return null;
        const choose = (pred) => markerPool.find(c => !usedMarkerIndexes.has(c.index) && pred(c));

        const exactSameDay = choose(c => c.dayHint === dayNumber && c.normalizedTitle === normalizedName);
        if (exactSameDay) { usedMarkerIndexes.add(exactSameDay.index); return exactSameDay; }

        const exactAnyDay = choose(c => c.normalizedTitle === normalizedName);
        if (exactAnyDay) { usedMarkerIndexes.add(exactAnyDay.index); return exactAnyDay; }

        const partialSameDay = choose(c => c.dayHint === dayNumber && (c.normalizedTitle.includes(normalizedName) || normalizedName.includes(c.normalizedTitle)));
        if (partialSameDay) { usedMarkerIndexes.add(partialSameDay.index); return partialSameDay; }

        const partialAnyDay = choose(c => c.normalizedTitle.includes(normalizedName) || normalizedName.includes(c.normalizedTitle));
        if (partialAnyDay) { usedMarkerIndexes.add(partialAnyDay.index); return partialAnyDay; }

        const sequential = markerPool.find(c => !usedMarkerIndexes.has(c.index));
        if (sequential) { usedMarkerIndexes.add(sequential.index); return sequential; }
        return null;
    }

    async #buildDaySections(payload, resolvedStops) {
        const sections = [];
        const markerById = new Map(payload.map.markers.map(m => [m.id, m]));

        for (const day of payload.days) {
            const color = getDayColor(day.dayNumber);
            const stops = resolvedStops.filter(s => s.dayNumber === day.dayNumber).sort((a, b) => a.sequence - b.sequence);
            const clustersForDay = payload.map.clusters.filter(c => c.dayNumber === day.dayNumber);
            const clusterStops = clustersForDay.map((cluster, idx) => {
                const center = this.#resolveClusterCenter(cluster, markerById, resolvedStops);
                if (!center) return null;
                return { dayNumber: day.dayNumber, sequence: idx + 1, name: cluster.name || `Cluster ${idx + 1}`, lat: center.lat, lng: center.lng, color: normalizeHexColor(cluster.color, color.hex) };
            }).filter(Boolean);

            const useClusters = clusterStops.length > 0;
            const stopsForMap = useClusters ? clusterStops : stops;
            const waypoints = stopsForMap.map(s => ({ name: s.name, lat: s.lat, lng: s.lng }));
            const route = await this.#routeCalculator.calculateRoute(waypoints);
            const distanceSummary = this.#distanceEstimator.summarizeDay(day.dayNumber, route);

            const markers = stopsForMap.map((s, idx) => ({ lat: s.lat, lng: s.lng, label: useClusters ? indexToLetter(idx) : `${s.sequence}`, color: s.color || color.hex, title: s.name }));
            const paths = route.coordinates.length >= 2 ? [{ coordinates: route.coordinates, color: color.hex, width: 4, opacity: 0.82 }] : [];

            const mapImage = await this.#mapGenerator.generateMapDataUri({
                markers, paths, fitBounds: true, width: 1200, height: 680,
                title: `Day ${day.dayNumber} - ${day.city || payload.trip.destination}`,
            });

            sections.push({
                dayNumber: day.dayNumber, dayColorHex: color.hex, dayColorName: color.name,
                mapImage, routeProvider: route.provider, stopCount: stops.length,
                totalDistanceKm: distanceSummary.totalDistanceKm, totalEstimatedMinutes: distanceSummary.totalEstimatedMinutes,
                totalDistanceLabel: distanceSummary.totalDistanceLabel, totalTimeLabel: distanceSummary.totalTimeLabel,
                segments: distanceSummary.segments,
            });
        }
        return sections;
    }

    async #buildOverviewMap(payload, resolvedStops, fallbackCenter) {
        const markerById = new Map(payload.map.markers.map(m => [m.id, m]));
        const clusterPoints = payload.map.clusters.map((cluster, idx) => {
            const center = this.#resolveClusterCenter(cluster, markerById, resolvedStops);
            if (!center) return null;
            const fallbackDay = cluster.dayNumber || idx + 1;
            return { lat: center.lat, lng: center.lng, name: cluster.name || `Cluster ${idx + 1}`, dayNumber: cluster.dayNumber || fallbackDay, color: normalizeHexColor(cluster.color, getDayColor(fallbackDay).hex), sequence: idx + 1 };
        }).filter(Boolean);

        if (clusterPoints.length) {
            const markers = clusterPoints.map((c, idx) => ({ lat: c.lat, lng: c.lng, label: indexToLetter(idx), color: c.color, title: c.name }));
            const byDay = new Map();
            for (const c of clusterPoints) { const list = byDay.get(c.dayNumber) || []; list.push(c); byDay.set(c.dayNumber, list); }
            const paths = [];
            for (const [dayNumber, clusters] of byDay.entries()) {
                if (clusters.length < 2) continue;
                const route = await this.#routeCalculator.calculateRoute(clusters.sort((a, b) => a.sequence - b.sequence).map(c => ({ name: c.name, lat: c.lat, lng: c.lng })));
                if (route.coordinates.length < 2) continue;
                paths.push({ coordinates: route.coordinates, color: getDayColor(dayNumber).hex, width: 4, opacity: 0.8 });
            }
            const outline = buildOutlinePath(clusterPoints, "#0ea5e9");
            if (outline) paths.push(outline);
            return this.#mapGenerator.generateMapDataUri({ markers, paths, fitBounds: true, center: fallbackCenter, zoom: payload.map.zoom, width: 1280, height: 780, title: `${payload.trip.destination} overview` });
        }

        const sortedStops = [...resolvedStops].sort((a, b) => a.dayNumber === b.dayNumber ? a.sequence - b.sequence : a.dayNumber - b.dayNumber);
        const markers = sortedStops.map((s, idx) => ({ lat: s.lat, lng: s.lng, label: `${idx + 1}`, color: getDayColor(s.dayNumber).hex, title: s.name }));
        const dayGrouped = new Map();
        for (const s of sortedStops) { const list = dayGrouped.get(s.dayNumber) || []; list.push(s); dayGrouped.set(s.dayNumber, list); }
        const paths = [];
        for (const [dayNumber, stops] of dayGrouped.entries()) {
            if (stops.length < 2) continue;
            const route = await this.#routeCalculator.calculateRoute(stops.map(s => ({ name: s.name, lat: s.lat, lng: s.lng })));
            if (route.coordinates.length < 2) continue;
            paths.push({ coordinates: route.coordinates, color: getDayColor(dayNumber).hex, width: 4, opacity: 0.8 });
        }
        const outline = buildOutlinePath(sortedStops, "#0ea5e9");
        if (outline) paths.push(outline);

        const routeCoordinates = payload.map.route?.coordinates;
        if (!paths.length && routeCoordinates?.length >= 2) {
            paths.push({ coordinates: routeCoordinates, color: normalizeHexColor(payload.map.clusters[0]?.color, "#1d4ed8"), width: 4, opacity: 0.8 });
        }
        if (!markers.length && routeCoordinates?.length >= 2) {
            const first = routeCoordinates[0]; const last = routeCoordinates[routeCoordinates.length - 1];
            const mc = normalizeHexColor(payload.map.clusters[0]?.color, "#1d4ed8");
            markers.push({ lat: first[1], lng: first[0], label: "S", color: mc, title: "Route Start" }, { lat: last[1], lng: last[0], label: "E", color: mc, title: "Route End" });
        }
        if (!markers.length && payload.map.markers.length) {
            for (let i = 0; i < payload.map.markers.length; i++) { const m = payload.map.markers[i]; markers.push({ lat: m.lat, lng: m.lng, label: `${i + 1}`, color: "#1d4ed8", title: m.title }); }
        }

        return this.#mapGenerator.generateMapDataUri({ markers, paths, fitBounds: true, center: fallbackCenter, zoom: payload.map.zoom, width: 1280, height: 780, title: `${payload.trip.destination} overview` });
    }

    #buildClusterSummaryRows(payload, resolvedStops) {
        const markerById = new Map(payload.map.markers.map(m => [m.id, m]));
        const markerCountByDay = new Map();
        for (const m of payload.map.markers) { const dh = parseDayHint(m.subtitle); if (!dh) continue; markerCountByDay.set(dh, (markerCountByDay.get(dh) || 0) + 1); }
        const stopCountByDay = new Map();
        for (const s of resolvedStops) { stopCountByDay.set(s.dayNumber, (stopCountByDay.get(s.dayNumber) || 0) + 1); }

        if (payload.map.clusters.length) {
            const rows = payload.map.clusters.map((cluster, idx) => {
                const cd = cluster.dayNumber;
                const markerCount = cluster.markerIds?.length ?? (cd ? markerCountByDay.get(cd) || 0 : 0);
                const stopCount = cluster.stopCount ?? (cd ? stopCountByDay.get(cd) || 0 : 0);
                const center = this.#resolveClusterCenter(cluster, markerById, resolvedStops);
                const fallbackDay = cd || idx + 1;
                return { id: cluster.id || `cluster-${idx + 1}`, name: cluster.name || `Cluster ${idx + 1}`, dayNumber: cd, colorHex: normalizeHexColor(cluster.color, getDayColor(fallbackDay).hex), markerCount, stopCount, centerLabel: center ? `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}` : undefined };
            });
            return rows.sort((a, b) => { const aD = a.dayNumber || Number.MAX_SAFE_INTEGER; const bD = b.dayNumber || Number.MAX_SAFE_INTEGER; return aD !== bD ? aD - bD : a.name.localeCompare(b.name); });
        }

        return payload.days.map(day => {
            const color = getDayColor(day.dayNumber);
            return { id: `cluster-day-${day.dayNumber}`, name: `Day ${day.dayNumber} Cluster`, dayNumber: day.dayNumber, colorHex: color.hex, markerCount: markerCountByDay.get(day.dayNumber) || 0, stopCount: stopCountByDay.get(day.dayNumber) || 0 };
        });
    }

    #resolveClusterCenter(cluster, markerById, resolvedStops) {
        if (cluster.center) return cluster.center;
        if (cluster.markerIds?.length) {
            const pts = cluster.markerIds.map(id => markerById.get(id)).filter(Boolean);
            if (pts.length) return { lat: pts.reduce((s, m) => s + m.lat, 0) / pts.length, lng: pts.reduce((s, m) => s + m.lng, 0) / pts.length };
        }
        if (cluster.dayNumber) {
            const dayStops = resolvedStops.filter(s => s.dayNumber === cluster.dayNumber);
            if (dayStops.length) return { lat: dayStops.reduce((s, st) => s + st.lat, 0) / dayStops.length, lng: dayStops.reduce((s, st) => s + st.lng, 0) / dayStops.length };
        }
        return null;
    }

    #buildCoverMarkers(stops) {
        const sorted = [...stops].sort((a, b) => a.dayNumber === b.dayNumber ? a.sequence - b.sequence : a.dayNumber - b.dayNumber);
        return sorted.map((s, idx) => ({ id: `cover-marker-${s.dayNumber}-${s.sequence}`, label: `${idx + 1}`, lat: s.lat, lng: s.lng, category: s.category, title: s.name, subtitle: `Day ${s.dayNumber}` }));
    }

    #markersFromPayload(markers) {
        return markers.map((m, idx) => ({ id: m.id || `marker-${idx}`, label: m.label || `${idx + 1}`, lat: m.lat, lng: m.lng, category: m.category, title: m.title || m.label, subtitle: m.subtitle }));
    }
}
