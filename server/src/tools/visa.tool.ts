import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * Fallback visa data when service is unavailable
 */
const FALLBACK_VISA_DATA: Record<string, {
    visaRequired: boolean;
    visaType: string;
    validity: string;
    processingTime: string;
    requirements: string[];
    warnings?: string[];
}> = {
    'india-thailand': {
        visaRequired: false,
        visaType: 'Visa on Arrival',
        validity: '15 days',
        processingTime: 'On arrival',
        requirements: [
            'Passport valid for 6+ months',
            'Return ticket within 15 days',
            'Proof of accommodation',
            '10,000 THB or equivalent in cash',
        ],
        warnings: ['Visa on arrival may have long queues during peak season'],
    },
    'india-usa': {
        visaRequired: true,
        visaType: 'B1/B2 Tourist Visa',
        validity: '10 years (multiple entry)',
        processingTime: '3-5 weeks',
        requirements: [
            'Valid passport',
            'DS-160 application form',
            'Visa interview at embassy',
            'Proof of ties to home country',
            'Bank statements',
            'Travel itinerary',
        ],
    },
    'india-uk': {
        visaRequired: true,
        visaType: 'Standard Visitor Visa',
        validity: '6 months',
        processingTime: '3 weeks',
        requirements: [
            'Valid passport',
            'Online application',
            'Proof of accommodation',
            'Bank statements (6 months)',
            'Employment letter',
        ],
    },
    'india-uae': {
        visaRequired: true,
        visaType: 'Tourist Visa',
        validity: '30 days',
        processingTime: '3-4 business days',
        requirements: [
            'Valid passport',
            'Passport-size photo',
            'Return ticket',
            'Hotel booking',
        ],
    },
    default: {
        visaRequired: true,
        visaType: 'Tourist Visa',
        validity: 'Varies',
        processingTime: '1-4 weeks',
        requirements: [
            'Valid passport (6+ months validity)',
            'Completed visa application',
            'Passport photos',
            'Proof of accommodation',
            'Return ticket',
            'Travel insurance (recommended)',
        ],
        warnings: ['Please verify requirements with the official embassy website'],
    },
};

/**
 * Visa check tool
 */
export const visaTool: Tool = {
    name: 'check_visa_requirements',
    description: 'Check visa requirements for traveling from one country to another',
    parameters: {
        passport_country: {
            type: 'string',
            description: 'Country of passport holder (e.g., "India", "USA")',
        },
        destination_country: {
            type: 'string',
            description: 'Destination country (e.g., "Thailand", "Japan")',
        },
        travel_dates: {
            type: 'string',
            description: 'Planned travel dates (optional)',
        },
    },
    required: ['passport_country', 'destination_country'],

    async execute(params): Promise<ToolResult> {
        const { passport_country, destination_country } = params as {
            passport_country: string;
            destination_country: string;
        };

        const cacheKey = generateCacheKey('visa', {
            from: passport_country.toLowerCase(),
            to: destination_country.toLowerCase(),
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Try to fetch from visa service
                    const result = await fetchFromService(
                        SERVICE_URLS.visa,
                        `/visa?from=${encodeURIComponent(passport_country)}&to=${encodeURIComponent(destination_country)}`
                    );

                    if (result.success && result.data) {
                        return { ...result, source: 'api' as const };
                    }

                    // Use fallback data
                    const key = `${passport_country.toLowerCase()}-${destination_country.toLowerCase()}`;
                    const fallbackData = FALLBACK_VISA_DATA[key] || FALLBACK_VISA_DATA.default;

                    return {
                        success: true,
                        data: {
                            ...fallbackData,
                            passportCountry: passport_country,
                            destinationCountry: destination_country,
                        },
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.visa
            );

            return data as ToolResult;
        } catch (error) {
            // Return fallback on any error
            const key = `${passport_country.toLowerCase()}-${destination_country.toLowerCase()}`;
            const fallbackData = FALLBACK_VISA_DATA[key] || FALLBACK_VISA_DATA.default;

            return {
                success: true,
                data: {
                    ...fallbackData,
                    passportCountry: passport_country,
                    destinationCountry: destination_country,
                },
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(visaTool);
