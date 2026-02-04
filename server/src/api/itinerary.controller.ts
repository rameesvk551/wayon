import { Request, Response } from 'express';
import { z } from 'zod';
import {
    generateItinerary,
    type ItineraryInput,
    type Attraction,
    MOCK_ATTRACTIONS_DB,
} from '../itinerary/itinerary-generator.js';
import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';

// ============================================
// Request Validation Schema
// ============================================
const itineraryRequestSchema = z.object({
    startLocation: z.string().min(1, 'Start location is required'),
    destination: z.string().min(1, 'Destination is required'),
    dates: z.string().min(1, 'Travel dates are required'),
    transportMode: z.string().optional().default('public'),
    selectedAttractions: z.array(z.object({
        id: z.string(),
        name: z.string(),
        category: z.string().optional(),
        duration: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
    })).optional().default([]),
    preferences: z.object({
        companions: z.string().optional(),
        budget: z.string().optional(),
        interests: z.array(z.string()).optional(),
    }).optional(),
});

type ItineraryRequest = z.infer<typeof itineraryRequestSchema>;

// ============================================
// Date Parsing Utilities
// ============================================

/**
 * Parse user-friendly date strings like "1 week in March" into actual dates
 */
function parseDatesFromString(dateString: string): { start: string; end: string } {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Extract duration and month
    const durationMatch = dateString.match(/(\d+)\s*(day|week|month)s?/i);
    const monthMatch = dateString.match(/(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    
    let days = 7; // Default to 1 week
    if (durationMatch) {
        const num = parseInt(durationMatch[1], 10);
        const unit = durationMatch[2].toLowerCase();
        if (unit === 'day') days = num;
        else if (unit === 'week') days = num * 7;
        else if (unit === 'month') days = num * 30;
    }
    
    // Parse month
    const months: Record<string, number> = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };
    
    let startMonth = now.getMonth();
    let startYear = currentYear;
    
    if (monthMatch) {
        startMonth = months[monthMatch[1].toLowerCase()];
        // If the month is in the past, assume next year
        if (startMonth < now.getMonth()) {
            startYear = currentYear + 1;
        }
    }
    
    // Start on the 10th of the month (reasonable default)
    const startDate = new Date(startYear, startMonth, 10);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days - 1);
    
    return {
        start: formatDate(startDate),
        end: formatDate(endDate),
    };
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ============================================
// Attraction Data Conversion
// ============================================

/**
 * Convert client attraction data to the format expected by the itinerary generator
 */
function convertToItineraryAttractions(
    clientAttractions: ItineraryRequest['selectedAttractions'],
    destination: string
): Attraction[] {
    if (!clientAttractions || clientAttractions.length === 0) {
        return [];
    }

    return clientAttractions.map(attr => {
        // Parse duration string like "2-3 hours" -> 2.5
        let durationHours = 2; // Default
        if (attr.duration) {
            const durationMatch = attr.duration.match(/(\d+)(?:\s*-\s*(\d+))?\s*hour/i);
            if (durationMatch) {
                const min = parseInt(durationMatch[1], 10);
                const max = durationMatch[2] ? parseInt(durationMatch[2], 10) : min;
                durationHours = (min + max) / 2;
            }
        }

        // Default region based on destination if not provided
        const region = destination.split(',')[0].trim();

        return {
            name: attr.name,
            latitude: attr.lat || 0,
            longitude: attr.lng || 0,
            region: region,
            estimatedDurationHours: durationHours,
            category: attr.category || 'attraction',
        };
    });
}

// ============================================
// Main Itinerary Handler
// ============================================

export async function itineraryHandler(req: Request, res: Response): Promise<void> {
    console.log('📅 Itinerary generation request received');
    
    try {
        // Validate request body
        const validationResult = itineraryRequestSchema.safeParse(req.body);
        
        if (!validationResult.success) {
            console.error('❌ Validation error:', validationResult.error.format());
            res.status(400).json({
                success: false,
                error: 'Invalid request',
                details: validationResult.error.format(),
            });
            return;
        }

        const request = validationResult.data;
        console.log('📍 Generating itinerary for:', {
            from: request.startLocation,
            to: request.destination,
            dates: request.dates,
            attractions: request.selectedAttractions.length,
        });

        // Parse dates from user-friendly string
        const travelDates = parseDatesFromString(request.dates);
        console.log('📆 Parsed dates:', travelDates);

        // Convert attractions to the generator format
        const customAttractions = convertToItineraryAttractions(
            request.selectedAttractions,
            request.destination
        );

        // Build the itinerary input
        const itineraryInput: ItineraryInput = {
            startLocation: request.startLocation,
            destination: request.destination,
            travelDates,
            transportMode: request.transportMode,
            selectedAttractions: request.selectedAttractions.map(a => a.name),
        };

        // Build combined attractions database (custom + mock)
        const combinedDb: Attraction[] = [
            ...customAttractions,
            ...MOCK_ATTRACTIONS_DB,
        ];

        // Generate the itinerary
        const itinerary = generateItinerary(itineraryInput, {
            maxHoursPerDay: 8,
            reserveTravelDays: true,
            includeReturnTravelDay: true,
        }, combinedDb);

        console.log('✅ Itinerary generated:', {
            destination: itinerary.destination,
            totalDays: itinerary.totalDays,
            daysPlanned: itinerary.dailyPlan.length,
        });

        // Return successful response
        res.json({
            success: true,
            itinerary,
            meta: {
                generatedAt: new Date().toISOString(),
                preferences: request.preferences,
                transportMode: request.transportMode,
            },
        });

    } catch (error) {
        console.error('❌ Itinerary generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate itinerary',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

// ============================================
// Fetch Real Attractions from Service
// ============================================

export async function fetchAttractionsHandler(req: Request, res: Response): Promise<void> {
    const { destination, country } = req.query;
    
    if (!destination || typeof destination !== 'string') {
        res.status(400).json({
            success: false,
            error: 'Destination is required',
        });
        return;
    }

    console.log('🏛️ Fetching attractions for:', destination);

    try {
        // Try to fetch from attraction service
        const serviceUrl = `${SERVICE_URLS.attractions}/api/attractions/search`;
        const cacheKey = generateCacheKey('attractions', { destination: destination.toLowerCase(), country: country as string || '' });
        
        const response = await cachedFetch<{ success: boolean; attractions: unknown[] } | null>(
            cacheKey,
            async () => {
                try {
                    const res = await fetch(serviceUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            city: destination.split(',')[0].trim(),
                            country: country || destination.split(',')[1]?.trim() || '',
                            limit: 10,
                        }),
                    });
                    if (!res.ok) throw new Error('Service unavailable');
                    return res.json() as Promise<{ success: boolean; attractions: unknown[] }>;
                } catch {
                    // Return null to trigger fallback
                    return null;
                }
            },
            CACHE_TTL.attractions
        );

        if (response?.success && response.attractions?.length > 0) {
            res.json({
                success: true,
                attractions: response.attractions,
                source: 'attraction-service',
            });
            return;
        }

        // Fallback to mock data
        res.json({
            success: true,
            attractions: [],
            source: 'fallback',
            message: 'Using client-side attractions',
        });

    } catch (error) {
        console.error('❌ Attraction fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch attractions',
        });
    }
}
