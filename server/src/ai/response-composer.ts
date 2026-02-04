import type { UIResponse, UIBlock, CardBlock, AlertBlock, ListBlock, AttractionCarouselBlock, MapInstruction } from '../schema/ui-schema.zod.js';
import type { ToolResult } from '../tools/types.js';
import { getCityCoordinates, type AttractionData } from '../tools/attraction.tool.js';

/**
 * Compose UI response from tool results
 * Transforms structured data into UI blocks
 */
export function composeResponse(
    intent: string,
    toolResults: Map<string, ToolResult>,
    destination?: string
): UIResponse {
    const blocks: UIBlock[] = [];

    switch (intent) {
        case 'flight_search':
            return composeFlightResponse(toolResults);

        case 'hotel_search':
            return composeHotelResponse(toolResults);

        case 'visa_check':
            return composeVisaResponse(toolResults);

        case 'weather_check':
            return composeWeatherResponse(toolResults);

        case 'attraction_discovery':
            return composeAttractionResponse(toolResults, destination);

        case 'tour_search':
            return composeTourResponse(toolResults);

        case 'itinerary_generation':
            return composeItineraryResponse(toolResults);

        default:
            // For general questions, return empty blocks (LLM will generate)
            return { blocks };
    }
}

interface FlightData {
    airline: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    duration: string;
    price: string;
    stops: number;
    aircraft?: string;
    route?: string;
}

interface FlightDataExtended extends FlightData {
    departureAirport?: string;
    arrivalAirport?: string;
    departureCity?: string;
    arrivalCity?: string;
}

interface HotelData {
    name: string;
    location: string;
    rating: number;
    price: string;
    image?: string;
    amenities?: string[];
}

interface VisaData {
    visaRequired: boolean;
    visaType: string;
    validity: string;
    processingTime: string;
    requirements: string[];
    warnings?: string[];
}

interface WeatherData {
    location: string;
    current: { temp: string; condition: string };
    forecast: Array<{ date: string; high: string; low: string; condition: string }>;
}

interface TourData {
    id: string;
    name: string;
    category: string;
    duration: string;
    price: string;
    rating: number;
    groupSize?: string;
    includes?: string[];
    highlights?: string[];
    image?: string;
    location?: string;
}

// AttractionData is imported from attraction.tool.ts

/**
 * Compose flight search response
 */
function composeFlightResponse(toolResults: Map<string, ToolResult>): UIResponse {
    const blocks: UIBlock[] = [];
    const flightData = toolResults.get('search_flights');

    if (!flightData?.success || !flightData.data) {
        return {
            blocks: [
                {
                    type: 'alert',
                    level: 'error',
                    text: 'Unable to fetch flight information. Please try again.',
                },
            ],
        };
    }

    const flights = flightData.data as FlightData[];

    // Extract route info from first flight
    const route = flights[0]?.route || 'Available Flights';

    blocks.push({
        type: 'text',
        content: `✈️ Found **${flights.length} flights** matching your search. Here are the best options:`,
        format: 'markdown',
    });

    // Transform flights to flight_carousel format
    const flightItems = flights.slice(0, 5).map((flight, idx) => ({
        id: `flight-${idx + 1}`,
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departure: flight.departure,
        arrival: flight.arrival,
        departureAirport: (flight as FlightDataExtended).departureAirport || 'DEP',
        arrivalAirport: (flight as FlightDataExtended).arrivalAirport || 'ARR',
        departureCity: (flight as FlightDataExtended).departureCity || 'Departure',
        arrivalCity: (flight as FlightDataExtended).arrivalCity || 'Arrival',
        duration: flight.duration,
        price: flight.price,
        stops: flight.stops,
        gate: `${String.fromCharCode(65 + idx)}${Math.floor(Math.random() * 20) + 1}`,
        seat: `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + (idx % 6))}`,
    }));

    // Add flight carousel block
    blocks.push({
        type: 'flight_carousel',
        title: route.includes('→') ? `Flights: ${route}` : 'Available Flights',
        flights: flightItems,
    } as unknown as UIBlock);

    blocks.push({
        type: 'alert',
        level: 'info',
        text: 'Prices shown are per person. Tap a card to view details.',
        dismissible: true,
    });

    return { blocks };
}

/**
 * Compose hotel search response
 */
function composeHotelResponse(toolResults: Map<string, ToolResult>): UIResponse {
    const blocks: UIBlock[] = [];
    const hotelData = toolResults.get('search_hotels');

    if (!hotelData?.success || !hotelData.data) {
        return {
            blocks: [
                {
                    type: 'alert',
                    level: 'error',
                    text: 'Unable to fetch hotel information. Please try again.',
                },
            ],
        };
    }

    const hotels = hotelData.data as HotelData[];

    blocks.push({
        type: 'title',
        text: 'Available Hotels',
        level: 1,
    });

    for (const hotel of hotels.slice(0, 5)) {
        const card: CardBlock = {
            type: 'card',
            title: hotel.name,
            subtitle: hotel.location,
            image: hotel.image,
            meta: [
                { label: 'Rating', value: `${hotel.rating} ★` },
                { label: 'Price', value: hotel.price },
            ],
            actions: [{ id: `book-${hotel.name}`, label: 'Book Now', variant: 'primary' }],
        };
        blocks.push(card);
    }

    return { blocks };
}

/**
 * Compose visa check response
 */
function composeVisaResponse(toolResults: Map<string, ToolResult>): UIResponse {
    const blocks: UIBlock[] = [];
    const visaData = toolResults.get('check_visa_requirements');

    if (!visaData?.success || !visaData.data) {
        return {
            blocks: [
                {
                    type: 'alert',
                    level: 'warning',
                    text: 'Unable to fetch visa information. Please check official sources.',
                },
            ],
        };
    }

    const visa = visaData.data as VisaData;

    blocks.push({
        type: 'title',
        text: 'Visa Requirements',
        level: 1,
    });

    // Status alert
    const alert: AlertBlock = {
        type: 'alert',
        level: visa.visaRequired ? 'warning' : 'success',
        text: visa.visaRequired
            ? `Visa required: ${visa.visaType}`
            : 'No visa required for your nationality!',
        title: 'Visa Status',
    };
    blocks.push(alert);

    // Requirements list
    if (visa.requirements?.length > 0) {
        const list: ListBlock = {
            type: 'list',
            items: visa.requirements.map((req, idx) => ({
                id: `req-${idx}`,
                text: req,
            })),
            ordered: true,
        };
        blocks.push(list);
    }

    // Warnings
    if (visa.warnings?.length) {
        for (const warning of visa.warnings) {
            blocks.push({
                type: 'alert',
                level: 'warning',
                text: warning,
                dismissible: true,
            });
        }
    }

    return { blocks };
}

/**
 * Compose weather response
 */
function composeWeatherResponse(toolResults: Map<string, ToolResult>): UIResponse {
    const blocks: UIBlock[] = [];
    const weatherData = toolResults.get('get_weather_forecast');

    if (!weatherData?.success || !weatherData.data) {
        return {
            blocks: [
                {
                    type: 'alert',
                    level: 'info',
                    text: 'Weather information temporarily unavailable.',
                },
            ],
        };
    }

    const weather = weatherData.data as WeatherData;

    blocks.push({
        type: 'title',
        text: `Weather in ${weather.location}`,
        level: 2,
    });

    blocks.push({
        type: 'card',
        title: weather.current.condition,
        subtitle: `Current temperature: ${weather.current.temp}`,
        badge: weather.current.temp,
        badgeVariant: 'primary',
    });

    return { blocks };
}

/**
 * Compose attraction discovery response with map instructions
 */
function composeAttractionResponse(
    toolResults: Map<string, ToolResult>,
    destination?: string
): UIResponse {
    const blocks: UIBlock[] = [];
    const attractionData = toolResults.get('discover_attractions');

    if (!attractionData?.success || !attractionData.data) {
        return { blocks: [] };
    }

    const attractions = attractionData.data as AttractionData[];
    const cityName = destination || 'this area';
    const cityCoords = getCityCoordinates(cityName);

    // Add intro text
    blocks.push({
        type: 'text',
        content: `🏛️ Found **${attractions.length} attractions** in ${cityName}. Here are the top places to visit:`,
        format: 'markdown',
    });

    // Create attraction carousel block
    const carouselBlock: AttractionCarouselBlock = {
        type: 'attraction_carousel',
        title: `Top Attractions in ${cityName}`,
        destination: cityName,
        attractions: attractions.slice(0, 6).map(attr => ({
            id: attr.id,
            name: attr.name,
            category: attr.category,
            description: attr.description,
            rating: attr.rating,
            image: attr.image,
            duration: attr.duration,
            price: attr.price,
            lat: attr.lat,
            lng: attr.lng,
        })),
    };
    blocks.push(carouselBlock as unknown as UIBlock);

    // Add helpful tip
    blocks.push({
        type: 'alert',
        level: 'info',
        text: 'Click on any attraction to see its location on the map.',
        dismissible: true,
    });

    // Create map instruction for frontend
    const mapInstruction: MapInstruction = {
        action: 'zoom',
        location: {
            city: cityName,
            lat: cityCoords.lat,
            lng: cityCoords.lng,
            zoom: cityCoords.zoom,
        },
        markers: attractions.slice(0, 6).map(attr => ({
            id: attr.id,
            title: attr.name,
            lat: attr.lat,
            lng: attr.lng,
            category: attr.category,
            image: attr.image,
        })),
    };

    return { blocks, map: mapInstruction };
}

/**
 * Compose tour search response
 */
function composeTourResponse(toolResults: Map<string, ToolResult>): UIResponse {
    const blocks: UIBlock[] = [];
    const tourData = toolResults.get('search_tours');

    if (!tourData?.success || !tourData.data) {
        return {
            blocks: [
                {
                    type: 'alert',
                    level: 'error',
                    text: 'Unable to fetch tour information. Please try again.',
                },
            ],
        };
    }

    const tours = tourData.data as TourData[];
    const location = tours[0]?.location || 'your destination';

    blocks.push({
        type: 'title',
        text: `Tours in ${location}`,
        level: 1,
    });

    blocks.push({
        type: 'text',
        content: `Found **${tours.length} tours**. Here are the top options:`,
        format: 'markdown',
    });

    for (const tour of tours.slice(0, 5)) {
        const card: CardBlock = {
            type: 'card',
            title: tour.name,
            subtitle: tour.category,
            image: tour.image,
            meta: [
                { label: 'Duration', value: tour.duration },
                { label: 'Price', value: tour.price },
                { label: 'Rating', value: `${tour.rating} ★` },
            ],
            actions: [{ id: `tour-${tour.id}`, label: 'View Details', variant: 'primary' }],
        };
        blocks.push(card);
    }

    return { blocks };
}

/**
 * Compose full itinerary response
 */
function composeItineraryResponse(toolResults: Map<string, ToolResult>): UIResponse {
    const blocks: UIBlock[] = [];

    blocks.push({
        type: 'title',
        text: 'Your Trip Itinerary',
        level: 1,
    });

    // Add visa info if available
    const visaResponse = composeVisaResponse(toolResults);
    if (visaResponse.blocks.length > 1) {
        blocks.push(...visaResponse.blocks.slice(1, 3)); // Skip title, add alert and list
    }

    blocks.push({ type: 'divider', spacing: 'md' });

    // Add flights if available
    const flightData = toolResults.get('search_flights');
    if (flightData?.success && flightData.data) {
        const flights = flightData.data as FlightData[];
        if (flights.length > 0) {
            blocks.push({
                type: 'card',
                title: `${flights[0].airline} ${flights[0].flightNumber}`,
                subtitle: 'Recommended Flight',
                badge: flights[0].price,
                badgeVariant: 'success',
            });
        }
    }

    // Add hotels if available
    const hotelData = toolResults.get('search_hotels');
    if (hotelData?.success && hotelData.data) {
        const hotels = hotelData.data as HotelData[];
        if (hotels.length > 0) {
            blocks.push({
                type: 'card',
                title: hotels[0].name,
                subtitle: 'Recommended Hotel',
                badge: hotels[0].price,
                badgeVariant: 'primary',
                meta: [{ label: 'Rating', value: `${hotels[0].rating} ★` }],
            });
        }
    }

    blocks.push({ type: 'divider', spacing: 'md' });

    // Add weather if available
    const weatherBlocks = composeWeatherResponse(toolResults);
    blocks.push(...weatherBlocks.blocks);

    // Add actions
    blocks.push({
        type: 'actions',
        items: [
            { id: 'book', label: 'Book This Trip', variant: 'primary' },
            { id: 'modify', label: 'Modify Itinerary', variant: 'secondary' },
            { id: 'share', label: 'Share', variant: 'ghost' },
        ],
        layout: 'horizontal',
    });

    return { blocks };
}

/**
 * Merge multiple UI responses
 */
export function mergeResponses(...responses: UIResponse[]): UIResponse {
    const blocks: UIBlock[] = [];

    for (const response of responses) {
        blocks.push(...response.blocks);
    }

    return { blocks };
}
