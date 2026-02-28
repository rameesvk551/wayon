/**
 * Route Calculation Service — OSRM/Mapbox/Google/Haversine routing.
 * Converted from pdf-service route-calculation.service.ts — all logic identical.
 */

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let polylineModule;
try { polylineModule = require("@mapbox/polyline"); } catch { polylineModule = null; }

const DEFAULT_PROVIDERS = ["osrm", "mapbox", "google"];
const FALLBACK_SPEED_KMH = { driving: 35, walking: 5, cycling: 15 };

const toKm = (meters) => Math.round((meters / 1000) * 100) / 100;
const toMinutes = (seconds) => Math.round(seconds / 60);

const parseProviders = () => {
    const raw = process.env.ROUTING_PROVIDERS;
    if (!raw) return DEFAULT_PROVIDERS;
    const unique = new Set();
    for (const part of raw.split(",")) { const n = part.trim().toLowerCase(); if (["osrm", "mapbox", "google"].includes(n)) unique.add(n); }
    return unique.size ? Array.from(unique) : DEFAULT_PROVIDERS;
};

const parseProfile = () => {
    const raw = (process.env.ROUTING_PROFILE || "driving").toLowerCase();
    if (raw === "walking" || raw === "cycling") return raw;
    return "driving";
};

const haversineKm = (a, b) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const value = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
    return R * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const mapProfileForMapbox = (p) => p === "walking" ? "walking" : p === "cycling" ? "cycling" : "driving";
const mapProfileForGoogle = (p) => p === "walking" ? "walking" : p === "cycling" ? "bicycling" : "driving";
const mapProfileForOsrm = (p) => p === "walking" ? "foot" : p === "cycling" ? "bike" : "driving";

const accumulateLegTotals = (legs) => ({
    totalDistanceKm: Math.round(legs.reduce((s, l) => s + l.distanceKm, 0) * 100) / 100,
    totalDurationMinutes: Math.round(legs.reduce((s, l) => s + l.durationMinutes, 0)),
});

export class RouteCalculationService {
    #providerOrder;
    #profile;

    constructor(providerOrder = parseProviders(), profile = parseProfile()) {
        this.#providerOrder = providerOrder;
        this.#profile = profile;
    }

    async calculateRoute(waypoints) {
        if (waypoints.length < 2) return { provider: "haversine", profile: this.#profile, coordinates: waypoints.map(w => [w.lng, w.lat]), legs: [], totalDistanceKm: 0, totalDurationMinutes: 0 };
        for (const provider of this.#providerOrder) {
            try { const route = await this.#calculateWithProvider(provider, waypoints); if (route) return route; } catch { continue; }
        }
        return this.#calculateFallback(waypoints);
    }

    async #calculateWithProvider(provider, waypoints) {
        if (provider === "osrm") return this.#calculateWithOsrm(waypoints);
        if (provider === "mapbox") return this.#calculateWithMapbox(waypoints);
        return this.#calculateWithGoogle(waypoints);
    }

    async #calculateWithOsrm(waypoints) {
        const profile = mapProfileForOsrm(this.#profile);
        const coords = waypoints.map(w => `${w.lng},${w.lat}`).join(";");
        const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=false`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const payload = await response.json();
        const route = payload.routes?.[0];
        if (!route?.geometry?.coordinates?.length) return null;
        const legs = this.#buildLegsFromProvider(waypoints, route.legs?.map(l => ({ distanceKm: toKm(l.distance || 0), durationMinutes: toMinutes(l.duration || 0) })));
        const totals = accumulateLegTotals(legs);
        return { provider: "osrm", profile: this.#profile, coordinates: route.geometry.coordinates, legs, ...totals };
    }

    async #calculateWithMapbox(waypoints) {
        const token = process.env.MAPBOX_TOKEN;
        if (!token) return null;
        const profile = mapProfileForMapbox(this.#profile);
        const coords = waypoints.map(w => `${w.lng},${w.lat}`).join(";");
        const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}?geometries=geojson&overview=full&steps=false&access_token=${token}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const payload = await response.json();
        const route = payload.routes?.[0];
        if (!route?.geometry?.coordinates?.length) return null;
        const legs = this.#buildLegsFromProvider(waypoints, route.legs?.map(l => ({ distanceKm: toKm(l.distance || 0), durationMinutes: toMinutes(l.duration || 0) })));
        const totals = accumulateLegTotals(legs);
        return { provider: "mapbox", profile: this.#profile, coordinates: route.geometry.coordinates, legs, ...totals };
    }

    async #calculateWithGoogle(waypoints) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) return null;
        const mode = mapProfileForGoogle(this.#profile);
        const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
        const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;
        const middle = waypoints.slice(1, -1).map(w => `${w.lat},${w.lng}`).join("|");
        const params = new URLSearchParams({ origin, destination, mode, key: apiKey });
        if (middle) params.set("waypoints", middle);
        const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const payload = await response.json();
        if (payload.status !== "OK") return null;
        const route = payload.routes?.[0];
        const encoded = route?.overview_polyline?.points;
        if (!route || !encoded || !polylineModule) return null;
        const decoded = polylineModule.decode(encoded).map(([lat, lng]) => [lng, lat]);
        const legs = this.#buildLegsFromProvider(waypoints, route.legs?.map(l => ({ distanceKm: toKm(l.distance?.value || 0), durationMinutes: toMinutes(l.duration?.value || 0) })));
        const totals = accumulateLegTotals(legs);
        return { provider: "google", profile: this.#profile, coordinates: decoded, legs, ...totals };
    }

    #buildLegsFromProvider(waypoints, rawLegs) {
        const legs = [];
        for (let i = 0; i < waypoints.length - 1; i++) {
            const fallback = this.#estimateLeg(waypoints[i], waypoints[i + 1]);
            const raw = rawLegs?.[i];
            legs.push({ from: waypoints[i].name, to: waypoints[i + 1].name, distanceKm: raw?.distanceKm ?? fallback.distanceKm, durationMinutes: raw?.durationMinutes ?? fallback.durationMinutes });
        }
        return legs;
    }

    #estimateLeg(from, to) {
        const distanceKm = Math.round(haversineKm(from, to) * 100) / 100;
        const speed = FALLBACK_SPEED_KMH[this.#profile];
        return { distanceKm, durationMinutes: speed > 0 ? Math.round((distanceKm / speed) * 60) : 0 };
    }

    #calculateFallback(waypoints) {
        const legs = [];
        for (let i = 0; i < waypoints.length - 1; i++) {
            const est = this.#estimateLeg(waypoints[i], waypoints[i + 1]);
            legs.push({ from: waypoints[i].name, to: waypoints[i + 1].name, ...est });
        }
        const totals = accumulateLegTotals(legs);
        return { provider: "haversine", profile: this.#profile, coordinates: waypoints.map(p => [p.lng, p.lat]), legs, ...totals };
    }
}
