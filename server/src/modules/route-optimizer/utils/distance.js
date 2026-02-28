/**
 * Haversine Distance Calculator
 * Fast geodesic distance calculation between two coordinates
 *
 * @param {{ latitude: number, longitude: number }} coord1
 * @param {{ latitude: number, longitude: number }} coord2
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(coord1, coord2) {
    const R = 6371;
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);

    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function toRad(degrees) {
    return (degrees * Math.PI) / 180;
}

/**
 * Calculate total distance for a route
 * @param {{ latitude: number, longitude: number }[]} coordinates
 * @returns {number}
 */
export function calculateRouteDistance(coordinates) {
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        totalDistance += haversineDistance(coordinates[i], coordinates[i + 1]);
    }
    return totalDistance;
}
