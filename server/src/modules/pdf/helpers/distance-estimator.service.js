/**
 * Distance Estimator Service — formats distance/time summaries for day plans.
 * Converted from pdf-service distance-estimator.service.ts — all logic identical.
 */

const formatDistance = (distanceKm) => `${distanceKm.toFixed(1)} km`;

const formatDuration = (totalMinutes) => {
    const minutes = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!hours) return `${rest} mins`;
    if (!rest) return `${hours}h`;
    return `${hours}h ${rest}m`;
};

export class DistanceEstimatorService {
    summarizeDay(dayNumber, route) {
        const segments = route.legs.map((leg) => this.#toSegment(leg));
        const totalDistanceKm = Math.round(segments.reduce((s, seg) => s + seg.distanceKm, 0) * 100) / 100;
        const totalEstimatedMinutes = Math.round(segments.reduce((s, seg) => s + seg.estimatedMinutes, 0));

        return {
            dayNumber,
            totalDistanceKm,
            totalEstimatedMinutes,
            totalDistanceLabel: formatDistance(totalDistanceKm),
            totalTimeLabel: formatDuration(totalEstimatedMinutes),
            segments,
        };
    }

    #toSegment(leg) {
        const distanceKm = Math.max(0, leg.distanceKm);
        const estimatedMinutes = Math.max(0, Math.round(leg.durationMinutes));
        return {
            from: leg.from,
            to: leg.to,
            distanceKm,
            estimatedMinutes,
            distanceLabel: formatDistance(distanceKm),
            timeLabel: formatDuration(estimatedMinutes),
        };
    }
}
