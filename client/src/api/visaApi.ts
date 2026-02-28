// ═══════════════════════════════════════════════════════════════════════════
// VISA SERVICE — API Client
// Connects to visa module on ai-trip-planning server
// ═══════════════════════════════════════════════════════════════════════════

import type { VisaInfo, VisaStatus } from '../data/visaData';

const BASE_URL = import.meta.env.VITE_VISA_SERVICE_URL || 'http://localhost:4333/api/visa';

// ── Backend response shapes ───────────────────────────────────────────────

interface BackendVisaRequirement {
    country: string;
    countryCode: string;
    passportCode?: string;
    visaRequired: boolean;
    visaType?: string;
    status: string;
    maxStay?: string;
    description: string;
    processingTime?: string;
    cost?: string;
    requirements?: string[];
    documents?: string[];
    nextSteps?: string[];
    notes?: string;
}

interface VisaCheckResponse {
    fromCountry: string;
    toCountry: string;
    visaRequirement: BackendVisaRequirement;
    lastUpdated: string;
}

interface VisaMapResponse {
    passport: string;
    results: BackendVisaRequirement[];
    total: number;
    stats: {
        visaFree: number;
        evisa: number;
        visaOnArrival: number;
        visaRequired: number;
    };
}

export interface PassportEntry {
    code: string;
    name: string;
}

export interface DestinationEntry {
    code: string;
    name: string;
}

interface PassportListResponse {
    passports: PassportEntry[];
    total: number;
}

interface DestinationListResponse {
    destinations: DestinationEntry[];
    total: number;
}

// ── Map API status string to frontend VisaStatus ──────────────────────────

function mapStatus(status: string): VisaStatus {
    const s = (status || '').toLowerCase().trim();
    if (s === 'visa-free' || s === 'free') return 'visa-free';
    if (s === 'evisa' || s === 'e-visa' || s === 'eta') return 'evisa';
    if (s === 'visa-on-arrival' || s === 'on-arrival') return 'visa-on-arrival';
    return 'visa-required';
}

// ── Map backend requirement to frontend VisaInfo ──────────────────────────

function mapToVisaInfo(from: string, req: BackendVisaRequirement): VisaInfo {
    return {
        from: from.toUpperCase(),
        to: (req.countryCode || '').toUpperCase(),
        status: mapStatus(req.status || req.visaType || ''),
        maxStay: req.maxStay || 'Check with embassy',
        processingTime: req.processingTime || 'Varies',
        cost: req.cost || 'Varies',
        documents: req.documents || req.requirements || ['Valid passport'],
        nextSteps: req.nextSteps || ['Check embassy website for details'],
    };
}

// ── Request cache ─────────────────────────────────────────────────────────

const CACHE_TTL_MS = 120_000; // 2 minutes
const requestCache = new Map<string, { promise: Promise<any>; timestamp: number }>();

function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.promise as Promise<T>;
    }
    const promise = fetcher().catch((err) => {
        requestCache.delete(key);
        throw err;
    });
    requestCache.set(key, { promise, timestamp: Date.now() });
    return promise;
}

// ── API Functions ─────────────────────────────────────────────────────────

/**
 * Check visa requirement for a single passport→destination pair.
 */
export function checkVisa(from: string, to: string): Promise<VisaInfo> {
    const cacheKey = `check:${from}:${to}`;

    return cachedFetch(cacheKey, async () => {
        const res = await fetch(
            `${BASE_URL}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
        );
        if (!res.ok) throw new Error(`Visa check failed: ${res.status}`);

        const data: VisaCheckResponse = await res.json();
        return mapToVisaInfo(data.fromCountry, data.visaRequirement);
    });
}

/**
 * Get all destination visa data for a passport (visa map).
 * Returns the full VisaInfo array + stats.
 */
export function getVisaMap(passportCode: string): Promise<{
    results: VisaInfo[];
    stats: VisaMapResponse['stats'];
    total: number;
}> {
    const cacheKey = `map:${passportCode}`;

    return cachedFetch(cacheKey, async () => {
        const res = await fetch(`${BASE_URL}/map`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passport: passportCode }),
        });
        if (!res.ok) throw new Error(`Visa map failed: ${res.status}`);

        const data: VisaMapResponse = await res.json();
        return {
            results: data.results.map(r => mapToVisaInfo(data.passport, r)),
            stats: data.stats,
            total: data.total,
        };
    });
}

/**
 * Get list of all passport countries from the API.
 */
export function getPassports(): Promise<PassportEntry[]> {
    return cachedFetch('passports', async () => {
        const res = await fetch(`${BASE_URL}/passports`);
        if (!res.ok) throw new Error(`Passport list failed: ${res.status}`);

        const data: PassportListResponse = await res.json();
        return data.passports;
    });
}

/**
 * Get list of all destination countries from the API.
 */
export function getDestinations(): Promise<DestinationEntry[]> {
    return cachedFetch('destinations', async () => {
        const res = await fetch(`${BASE_URL}/destinations`);
        if (!res.ok) throw new Error(`Destination list failed: ${res.status}`);

        const data: DestinationListResponse = await res.json();
        return data.destinations;
    });
}
