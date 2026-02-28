/**
 * Map Generator Service — Mapbox/Google/SVG static map generation.
 * Converted from pdf-service map-generator.service.ts — all logic identical.
 */

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let polylineModule;
try { polylineModule = require("@mapbox/polyline"); } catch { polylineModule = null; }

const DEFAULT_PROVIDER_ORDER = ["mapbox", "google", "svg"];

const parseProviders = () => {
    const raw = process.env.STATIC_MAP_PROVIDERS;
    if (!raw) return DEFAULT_PROVIDER_ORDER;
    const unique = new Set();
    for (const part of raw.split(",")) {
        const n = part.trim().toLowerCase();
        if (["mapbox", "google", "svg"].includes(n)) unique.add(n);
    }
    return unique.size ? Array.from(unique) : DEFAULT_PROVIDER_ORDER;
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const markerLabel = (label) => { const t = label?.trim(); if (!t) return "A"; return t.length === 1 ? t.toUpperCase() : t[0].toUpperCase(); };
const removeHash = (hex) => hex.replace("#", "");

const computeBounds = (points) => ({
    minLat: Math.min(...points.map(p => p.lat)), maxLat: Math.max(...points.map(p => p.lat)),
    minLng: Math.min(...points.map(p => p.lng)), maxLng: Math.max(...points.map(p => p.lng)),
});

const computeZoom = (markers) => {
    if (!markers.length) return 11;
    if (markers.length === 1) return 13;
    const bounds = computeBounds(markers);
    const spread = Math.max(Math.max(0.0001, bounds.maxLat - bounds.minLat), Math.max(0.0001, bounds.maxLng - bounds.minLng));
    if (spread > 20) return 4; if (spread > 8) return 5; if (spread > 4) return 6; if (spread > 2) return 7;
    if (spread > 1) return 8; if (spread > 0.5) return 9; if (spread > 0.2) return 10;
    if (spread > 0.1) return 11; if (spread > 0.05) return 12; return 13;
};

const computeCenter = (markers) => {
    if (!markers.length) return { lat: 0, lng: 0 };
    return {
        lat: markers.reduce((s, m) => s + m.lat, 0) / markers.length,
        lng: markers.reduce((s, m) => s + m.lng, 0) / markers.length,
    };
};

const fetchAsDataUri = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Static map request failed: ${response.status}`);
    const contentType = response.headers.get("content-type") || "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
};

const buildMapboxPathOverlay = (path) => {
    if (!path.coordinates.length || !polylineModule) return "";
    const width = clamp(Math.round(path.width || 4), 1, 12);
    const opacity = clamp(path.opacity ?? 0.8, 0.1, 1).toFixed(1);
    const encoded = polylineModule.encode(path.coordinates.map(([lng, lat]) => [lat, lng]));
    return `path-${width}+${removeHash(path.color)}-${opacity}(polyline(${encoded}))`;
};

const buildMapboxMarkerOverlay = (marker) => `pin-s-${markerLabel(marker.label)}+${removeHash(marker.color)}(${marker.lng},${marker.lat})`;

const buildMapboxUrl = (request) => {
    const token = process.env.MAPBOX_TOKEN;
    if (!token) return null;
    const style = process.env.MAPBOX_STYLE || "mapbox/light-v11";
    const width = Math.max(200, Math.round(request.width || 1200));
    const height = Math.max(200, Math.round(request.height || 760));
    const overlays = [...(request.paths || []).map(buildMapboxPathOverlay).filter(Boolean), ...request.markers.map(buildMapboxMarkerOverlay)];
    const overlayPart = overlays.length ? `${overlays.map(o => encodeURIComponent(o)).join(",")}/` : "";
    const useAutoFit = request.fitBounds ?? true;
    let locationPart = "0,0,2";
    if (useAutoFit && overlays.length > 0) locationPart = "auto";
    else { const center = request.center || computeCenter(request.markers); const zoom = request.zoom ?? computeZoom(request.markers); locationPart = `${center.lng},${center.lat},${zoom}`; }
    const padding = Math.max(24, Number(process.env.STATIC_MAP_PADDING || 44));
    return `https://api.mapbox.com/styles/v1/${style}/static/${overlayPart}${locationPart}/${width}x${height}@2x?padding=${padding}&access_token=${token}`;
};

const buildGoogleUrl = (request) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;
    const width = Math.max(200, Math.round(request.width || 1200));
    const height = Math.max(200, Math.round(request.height || 760));
    const params = new URLSearchParams({ size: `${width}x${height}`, scale: "2", maptype: "roadmap", key: apiKey });
    const fitBounds = request.fitBounds ?? true;
    if (fitBounds && request.markers.length > 0) { params.set("visible", request.markers.map(m => `${m.lat},${m.lng}`).join("|")); }
    else { const center = request.center || computeCenter(request.markers); params.set("center", `${center.lat},${center.lng}`); params.set("zoom", `${request.zoom ?? computeZoom(request.markers)}`); }
    for (const marker of request.markers) params.append("markers", `color:0x${removeHash(marker.color)}|label:${markerLabel(marker.label)}|${marker.lat},${marker.lng}`);
    for (const path of request.paths || []) { if (!path.coordinates.length) continue; const points = path.coordinates.map(([lng, lat]) => `${lat},${lng}`).join("|"); params.append("path", `color:0x${removeHash(path.color)}cc|weight:${Math.max(2, Math.round(path.width || 4))}|${points}`); }
    return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};

const escapeXml = (v) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const buildFallbackSvgDataUri = (request) => {
    const width = Math.max(200, Math.round(request.width || 1200));
    const height = Math.max(200, Math.round(request.height || 760));
    const margin = 70;
    const drawableW = width - margin * 2;
    const drawableH = height - margin * 2;
    const points = [...request.markers.map(m => ({ lat: m.lat, lng: m.lng })), ...(request.paths || []).flatMap(p => p.coordinates.map(([lng, lat]) => ({ lat, lng })))];
    const bounds = points.length ? computeBounds(points) : { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
    const latSpread = Math.max(0.0001, bounds.maxLat - bounds.minLat);
    const lngSpread = Math.max(0.0001, bounds.maxLng - bounds.minLng);
    const project = (lat, lng) => ({ x: Math.round((margin + ((lng - bounds.minLng) / lngSpread) * drawableW) * 100) / 100, y: Math.round((margin + (1 - (lat - bounds.minLat) / latSpread) * drawableH) * 100) / 100 });
    const pathSvg = (request.paths || []).filter(p => p.coordinates.length > 1).map(p => { const pts = p.coordinates.map(([lng, lat]) => { const pr = project(lat, lng); return `${pr.x},${pr.y}`; }).join(" "); return `<polyline points="${pts}" fill="none" stroke="${p.color}" stroke-width="${Math.max(2, p.width || 4)}" stroke-opacity="${clamp(p.opacity ?? 0.85, 0.1, 1)}" stroke-linecap="round" stroke-linejoin="round"/>`; }).join("");
    const markerSvg = request.markers.map(m => { const p = project(m.lat, m.lng); const l = escapeXml(markerLabel(m.label)); return `<g><circle cx="${p.x}" cy="${p.y}" r="16" fill="${m.color}" stroke="#ffffff" stroke-width="3"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="13" font-family="Arial, sans-serif" fill="#ffffff" font-weight="700">${l}</text></g>`; }).join("");
    const title = request.title ? escapeXml(request.title) : "Map Preview";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#f8fafc"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#bg)"/><rect x="${margin}" y="${margin}" width="${drawableW}" height="${drawableH}" rx="22" fill="#ffffffcc" stroke="#cbd5e1" stroke-width="2"/>${pathSvg}${markerSvg}<text x="${margin}" y="${margin - 20}" font-size="24" fill="#0f172a" font-family="Arial, sans-serif" font-weight="700">${title}</text></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg, "utf-8").toString("base64")}`;
};

export class MapGeneratorService {
    #providers;

    constructor(providers = parseProviders()) { this.#providers = providers; }

    async generateMapDataUri(request) {
        for (const provider of this.#providers) {
            try {
                if (provider === "mapbox") { const url = buildMapboxUrl(request); if (!url) continue; return await fetchAsDataUri(url); }
                if (provider === "google") { const url = buildGoogleUrl(request); if (!url) continue; return await fetchAsDataUri(url); }
                return buildFallbackSvgDataUri(request);
            } catch { continue; }
        }
        return buildFallbackSvgDataUri(request);
    }
}
