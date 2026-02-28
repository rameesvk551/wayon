/**
 * Multi-Modal Router Service
 * Integrates OSRM, Google Directions APIs for comprehensive routing.
 * Converted from transportation-service multi-modal-router.service.ts — all logic identical.
 */

import axios from "axios";

const OSRM_BASE_URL = "http://router.project-osrm.org";

const MAX_DISTANCES = {
    walking: 5000,
    cycling: 30000,
    escooter: 20000,
    driving: 2000000,
    transit: 500000,
};

export class MultiModalRouterService {
    #googleMapsApiKey;
    #geocodeCache = new Map();

    constructor() {
        this.#googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";
    }

    getName() { return "multi-modal-router"; }

    async #reverseGeocode(lat, lng) {
        const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        if (this.#geocodeCache.has(cacheKey)) {
            return this.#geocodeCache.get(cacheKey);
        }

        try {
            const apiKey = this.#googleMapsApiKey;
            if (!apiKey) {
                return `Near ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
            }

            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&result_type=locality|sublocality|route|bus_station|train_station|transit_station`;
            const response = await axios.get(url, { timeout: 3000 });

            if (response.data.status === "OK" && response.data.results?.length > 0) {
                const result = response.data.results[0];
                const components = result.address_components || [];
                const sublocality = components.find((c) => c.types.includes("sublocality_level_1") || c.types.includes("sublocality"));
                const locality = components.find((c) => c.types.includes("locality"));
                const route = components.find((c) => c.types.includes("route"));
                const neighborhood = components.find((c) => c.types.includes("neighborhood"));

                let placeName = "";
                if (sublocality) placeName = sublocality.long_name;
                else if (neighborhood) placeName = neighborhood.long_name;
                else if (route) placeName = route.long_name;
                else if (locality) placeName = locality.long_name;
                else placeName = result.formatted_address?.split(",").slice(0, 2).join(", ") || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

                this.#geocodeCache.set(cacheKey, placeName);
                return placeName;
            }
        } catch (error) {
            console.warn("Reverse geocoding failed:", error?.message);
        }

        return `Near ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
    }

    /**
     * Get multimodal route options.
     * @param {{ origin: {name: string, lat: number, lng: number}, destination: {name: string, lat: number, lng: number}, departureTime?: string, preferences?: any }} request
     */
    async route(request) {
        const { origin, destination, preferences } = request;
        const modes = preferences?.modes || ["transit", "walking", "driving"];

        console.log(`Computing multimodal routes: ${origin.name} → ${destination.name}`);

        const promises = [];

        if (modes.includes("transit") && this.#googleMapsApiKey) {
            promises.push(this.#getGoogleDirections(origin, destination, "transit"));
        }
        if (modes.includes("walking")) {
            promises.push(this.#getWalkingRoute(origin, destination));
        }
        if (modes.includes("cycling")) {
            promises.push(this.#getCyclingRoute(origin, destination));
        }
        if (modes.includes("driving")) {
            promises.push(this.#getDrivingRoute(origin, destination));
        }
        if (modes.includes("escooter")) {
            promises.push(this.#getEScooterRoute(origin, destination));
        }

        if (!modes.includes("driving")) {
            promises.push(this.#getDrivingRoute(origin, destination));
        }

        const results = await Promise.allSettled(promises);
        const routeOptions = [];

        results.forEach((result) => {
            if (result.status === "fulfilled" && result.value) {
                routeOptions.push(result.value);
            }
        });

        if (routeOptions.length === 0) {
            console.warn("No route options found, using fallback haversine estimate");
            routeOptions.push(this.#createFallbackRoute(origin, destination));
        }

        return this.#sortRoutesByPreference(routeOptions, preferences?.budget);
    }

    async #getWalkingRoute(origin, destination) {
        try {
            const url = `${OSRM_BASE_URL}/route/v1/foot/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;
            const response = await axios.get(url, { timeout: 5000 });

            if (response.data?.code !== "Ok" || !response.data?.routes?.[0]) return null;

            const route = response.data.routes[0];
            return {
                origin, destination,
                totalDistance: route.distance,
                totalDuration: route.duration,
                estimatedCost: 0,
                steps: [{ mode: "walking", from: origin.name, to: destination.name, distance: route.distance, duration: route.duration, polyline: route.geometry }],
                provider: "osrm-foot",
            };
        } catch (error) {
            console.warn("Walking route failed:", error?.message);
            return null;
        }
    }

    async #getCyclingRoute(origin, destination) {
        try {
            const url = `${OSRM_BASE_URL}/route/v1/bike/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;
            const response = await axios.get(url, { timeout: 5000 });

            if (response.data?.code !== "Ok" || !response.data?.routes?.[0]) return null;

            const route = response.data.routes[0];
            return {
                origin, destination,
                totalDistance: route.distance,
                totalDuration: route.duration,
                estimatedCost: 0,
                steps: [{ mode: "cycling", from: origin.name, to: destination.name, distance: route.distance, duration: route.duration, polyline: route.geometry }],
                provider: "osrm-bike",
            };
        } catch (error) {
            console.warn("Cycling route failed:", error?.message);
            return null;
        }
    }

    async #getDrivingRoute(origin, destination) {
        try {
            if (this.#googleMapsApiKey) {
                return await this.#getGoogleDirections(origin, destination, "driving");
            }

            const url = `${OSRM_BASE_URL}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;
            const response = await axios.get(url, { timeout: 5000 });

            if (response.data?.code !== "Ok" || !response.data?.routes?.[0]) return null;

            const route = response.data.routes[0];
            const fuelCost = this.#estimateFuelCost(route.distance);

            return {
                origin, destination,
                totalDistance: route.distance,
                totalDuration: route.duration,
                estimatedCost: fuelCost,
                steps: [{ mode: "driving", from: origin.name, to: destination.name, distance: route.distance, duration: route.duration, polyline: route.geometry }],
                provider: "osrm-car",
            };
        } catch (error) {
            console.warn("Driving route failed:", error?.message);
            return null;
        }
    }

    async #getEScooterRoute(origin, destination) {
        try {
            const cyclingRoute = await this.#getCyclingRoute(origin, destination);
            if (!cyclingRoute) return null;

            const adjustedDuration = cyclingRoute.totalDuration * 0.8;
            const rentalCost = this.#estimateEScooterCost(cyclingRoute.totalDistance, adjustedDuration);

            return {
                ...cyclingRoute,
                totalDuration: adjustedDuration,
                estimatedCost: rentalCost,
                steps: cyclingRoute.steps.map((step) => ({ ...step, mode: "escooter", duration: step.duration * 0.8 })),
                provider: "osrm-escooter",
            };
        } catch (error) {
            console.warn("E-scooter route failed:", error?.message);
            return null;
        }
    }

    async #getGoogleDirections(origin, destination, mode) {
        try {
            const url = "https://maps.googleapis.com/maps/api/directions/json";
            const response = await axios.get(url, {
                params: {
                    origin: `${origin.lat},${origin.lng}`,
                    destination: `${destination.lat},${destination.lng}`,
                    mode,
                    key: this.#googleMapsApiKey,
                    alternatives: false,
                    departure_time: mode === "transit" ? "now" : undefined,
                },
                timeout: 10000,
            });

            if (response.data?.status !== "OK" || !response.data?.routes?.[0]) return null;

            const route = response.data.routes[0];
            const leg = route.legs[0];

            const stepsPromises = leg.steps.map(async (step) => {
                let fromName = origin.name;
                let toName = destination.name;

                try {
                    if (step.start_location) fromName = await this.#reverseGeocode(step.start_location.lat, step.start_location.lng);
                    if (step.end_location) toName = await this.#reverseGeocode(step.end_location.lat, step.end_location.lng);
                } catch (e) { /* use defaults */ }

                const baseStep = {
                    from: fromName,
                    to: toName,
                    distance: step.distance.value,
                    duration: step.duration.value,
                    instructions: step.html_instructions?.replace(/<[^>]*>/g, ""),
                    polyline: step.polyline?.points,
                };

                if (step.travel_mode === "TRANSIT" && step.transit_details) {
                    const transit = step.transit_details;
                    const vehicleType = transit.line?.vehicle?.type || "TRANSIT";
                    const departureStopName = transit.departure_stop?.name || fromName;
                    const arrivalStopName = transit.arrival_stop?.name || toName;

                    return {
                        ...baseStep,
                        from: departureStopName,
                        to: arrivalStopName,
                        mode: this.#mapGoogleVehicleType(vehicleType),
                        route: transit.line?.short_name || transit.line?.name,
                        routeColor: transit.line?.color,
                        departureTime: transit.departure_time?.text,
                        arrivalTime: transit.arrival_time?.text,
                        stops: transit.num_stops,
                        departureStop: departureStopName,
                        arrivalStop: arrivalStopName,
                        headsign: transit.headsign,
                        agency: transit.line?.agencies?.[0]?.name,
                    };
                }

                return { ...baseStep, mode: step.travel_mode?.toLowerCase() || mode };
            });

            const steps = await Promise.all(stepsPromises);

            let estimatedCost = 0;
            if (mode === "driving") {
                estimatedCost = this.#estimateFuelCost(leg.distance.value);
            } else if (mode === "transit") {
                const transitLegs = steps.filter((s) => ["bus", "metro", "rail", "subway", "train", "tram"].includes(s.mode));
                estimatedCost = this.#estimateTransitFare(leg.distance.value, transitLegs.length);
            }

            return {
                origin, destination,
                totalDistance: leg.distance.value,
                totalDuration: leg.duration.value,
                estimatedCost,
                steps,
                provider: "google-directions",
            };
        } catch (error) {
            console.warn(`Google Directions API failed (${mode}):`, error?.message);
            return null;
        }
    }

    #createFallbackRoute(origin, destination) {
        const distance = this.#haversineDistance(origin, destination);

        let mode, duration, estimatedCost, warning;
        let isRealistic = true;

        if (distance <= MAX_DISTANCES.walking) {
            mode = "walking";
            duration = distance / 1.4;
            estimatedCost = 0;
        } else if (distance <= MAX_DISTANCES.cycling) {
            mode = "cycling";
            duration = distance / 4.2;
            estimatedCost = 0;
            warning = `Distance ${(distance / 1000).toFixed(1)}km too far to walk, suggesting cycling`;
        } else if (distance <= MAX_DISTANCES.driving) {
            mode = "driving";
            duration = distance / 11.1;
            estimatedCost = this.#estimateFuelCost(distance);
            warning = `Distance ${(distance / 1000).toFixed(1)}km requires motorized transport`;
        } else {
            mode = "driving";
            duration = distance / 11.1;
            estimatedCost = this.#estimateFuelCost(distance);
            isRealistic = false;
            warning = `⚠️ UNREALISTIC: ${(distance / 1000).toFixed(1)}km cannot be traveled in a day`;
        }

        return {
            origin, destination,
            totalDistance: distance,
            totalDuration: duration,
            estimatedCost,
            steps: [{ mode, from: origin.name, to: destination.name, distance, duration, warning, isRealistic }],
            provider: isRealistic ? "haversine-fallback" : "haversine-fallback-UNREALISTIC",
        };
    }

    #haversineDistance(point1, point2) {
        const R = 6371000;
        const φ1 = (point1.lat * Math.PI) / 180;
        const φ2 = (point2.lat * Math.PI) / 180;
        const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
        const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    #estimateTransitFare(distanceMeters, transitLegs) {
        const distanceKm = distanceMeters / 1000;
        const baseFare = 0.25;
        const perKmRate = 0.02;
        const transferPenalty = 0.15;
        const fare = baseFare + (distanceKm * perKmRate) + (Math.max(0, transitLegs - 1) * transferPenalty);
        return Math.round(fare * 100) / 100;
    }

    #mapGoogleVehicleType(vehicleType) {
        const mapping = {
            BUS: "bus", INTERCITY_BUS: "bus", TROLLEYBUS: "bus",
            METRO_RAIL: "metro", SUBWAY: "metro",
            RAIL: "train", HEAVY_RAIL: "train", COMMUTER_TRAIN: "train", HIGH_SPEED_TRAIN: "train", LONG_DISTANCE_TRAIN: "train",
            TRAM: "tram", MONORAIL: "metro",
            CABLE_CAR: "cable_car", GONDOLA_LIFT: "gondola", FUNICULAR: "funicular",
            FERRY: "ferry", SHARE_TAXI: "shared_taxi", OTHER: "transit",
        };
        return mapping[vehicleType] || "transit";
    }

    #estimateFuelCost(distanceMeters) {
        const distanceKm = distanceMeters / 1000;
        const fuelConsumptionPer100km = 8;
        const fuelPricePerLiter = 1.5;
        return (distanceKm / 100) * fuelConsumptionPer100km * fuelPricePerLiter;
    }

    #estimateEScooterCost(distanceMeters, durationSeconds) {
        const unlockFee = 1.0;
        const perMinuteCost = 0.15;
        const minutes = durationSeconds / 60;
        return unlockFee + minutes * perMinuteCost;
    }

    #sortRoutesByPreference(routes, budget) {
        if (budget === "budget") {
            return routes.sort((a, b) => {
                if (Math.abs(a.estimatedCost - b.estimatedCost) > 1) return a.estimatedCost - b.estimatedCost;
                return a.totalDuration - b.totalDuration;
            });
        } else if (budget === "premium") {
            return routes.sort((a, b) => a.totalDuration - b.totalDuration);
        } else {
            return routes.sort((a, b) => {
                const scoreA = a.totalDuration / 60 + a.estimatedCost * 10;
                const scoreB = b.totalDuration / 60 + b.estimatedCost * 10;
                return scoreA - scoreB;
            });
        }
    }
}
