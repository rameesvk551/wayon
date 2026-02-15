// ═══════════════════════════════════════════════════════════════════════════
// PDF SERVICE — API Client
// Connects to pdf-service microservice (port 4055)
// ═══════════════════════════════════════════════════════════════════════════

import type { Attraction } from '../types/attraction';
import type { OptimizedStop } from './routeOptimizerApi';

const BASE_URL = import.meta.env.VITE_PDF_SERVICE_URL || 'http://localhost:4055';

// ── Build PDF request payload from optimized route ────────────────────────
export function buildPdfPayload(
    attractions: Attraction[],
    optimizedOrder: OptimizedStop[],
    destination: string,
) {
    // Reorder attractions by optimized order
    const orderedAttractions = optimizedOrder.map(stop => {
        const attraction = attractions.find(a => a.id === stop.placeId);
        return { ...stop, attraction };
    });

    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + 86400000).toISOString().split('T')[0];

    return {
        trip: {
            title: `${destination} Itinerary`,
            destination,
            dateRange: { start: startDate, end: endDate },
            totalDays: 1,
        },
        map: {
            style: 'goa-infographic' as const,
            center: {
                lat: orderedAttractions[0]?.lat || 0,
                lng: orderedAttractions[0]?.lng || 0,
            },
            zoom: 12,
            markers: orderedAttractions.map((stop, i) => ({
                id: stop.placeId,
                label: `${i + 1}`,
                lat: stop.lat,
                lng: stop.lng,
                category: stop.attraction?.category || 'general',
                title: stop.attraction?.name || `Stop ${i + 1}`,
                subtitle: stop.attraction?.description?.slice(0, 60),
            })),
            clusters: [{
                id: 'day-1',
                name: 'Day 1',
                dayNumber: 1,
                color: '#6366f1',
                markerIds: orderedAttractions.map(s => s.placeId),
                center: {
                    lat: orderedAttractions[0]?.lat || 0,
                    lng: orderedAttractions[0]?.lng || 0,
                },
                stopCount: orderedAttractions.length,
            }],
            route: {
                coordinates: orderedAttractions.map(s => [s.lng, s.lat] as [number, number]),
            },
        },
        days: [{
            dayNumber: 1,
            date: startDate,
            city: destination,
            activities: orderedAttractions.map((stop, i) => ({
                name: stop.attraction?.name || `Stop ${i + 1}`,
                description: stop.attraction?.description || '',
                duration: stop.attraction?.duration || '1-2 hours',
                startTime: stop.arrivalTime || `${9 + i}:00`,
                location: stop.attraction?.address || destination,
                category: stop.attraction?.category || 'general',
                imageUrl: stop.attraction?.image,
                price: stop.attraction?.price || 0,
            })),
        }],
        output: {
            format: 'A4' as const,
            includeInfographicCover: true,
            enableMapVisualizations: true,
        },
    };
}

// ── Response types ────────────────────────────────────────────────────────
export interface PdfResult {
    pdfBytesBase64?: string;
    pdfUrl?: string;
    pageCount: number;
}

// ── Generate itinerary PDF ────────────────────────────────────────────────
export async function generateItineraryPdf(
    attractions: Attraction[],
    optimizedOrder: OptimizedStop[],
    destination: string,
): Promise<PdfResult> {
    const payload = buildPdfPayload(attractions, optimizedOrder, destination);

    const res = await fetch(`${BASE_URL}/api/v1/generate-itinerary-pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `PDF generation failed: ${res.status}`);
    }

    return await res.json();
}

// ── Download PDF from base64 ──────────────────────────────────────────────
export function downloadPdfFromBase64(base64: string, filename = 'trip-itinerary.pdf') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
