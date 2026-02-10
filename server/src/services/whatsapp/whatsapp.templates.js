/**
 * WhatsApp Message Templates
 * Pre-defined templates for re-engaging users outside the 24-hour messaging window.
 * 
 * IMPORTANT: These templates must be created and approved in the Meta Business Manager
 * before they can be used. The template names here must match exactly with the approved templates.
 */

import { sendTemplateMessage } from "./whatsapp.service.js";

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pre-defined template configurations
 * Each template must be approved in Meta Business Manager before use
 */
export const TEMPLATES = {
    // Welcome/Greeting template
    WELCOME: {
        name: "travel_assistant_welcome",
        description: "Initial greeting when user first messages",
        language: "en",
        sampleBody: "Welcome to AI Travel Planner! 🌍 I'm here to help you plan your perfect trip. Reply to start planning!",
    },

    // Trip reminder - incomplete planning session
    TRIP_REMINDER: {
        name: "trip_planning_reminder",
        description: "Reminds user about incomplete trip planning",
        language: "en",
        sampleBody: "Hey {{1}}! 👋 You were planning a trip to {{2}}. Ready to continue? I can help you find the best hotels, flights, and attractions!",
        parameters: ["user_name", "destination"],
    },

    // Deal/Offer notification
    TRAVEL_DEALS: {
        name: "travel_deals_alert",
        description: "Notify about travel deals for their destination",
        language: "en",
        sampleBody: "🔥 Hot deals alert! We found amazing offers for {{1}}. Flights from {{2}} and hotels from {{3}}/night. Reply to explore!",
        parameters: ["destination", "flight_price", "hotel_price"],
    },

    // Booking confirmation
    BOOKING_CONFIRMATION: {
        name: "booking_confirmation",
        description: "Confirm a booking was made",
        language: "en",
        sampleBody: "✅ Your booking is confirmed!\n\n📍 {{1}}\n📅 {{2}}\n🎫 Confirmation: {{3}}\n\nHave a great trip!",
        parameters: ["destination", "dates", "confirmation_code"],
    },

    // Itinerary ready
    ITINERARY_READY: {
        name: "itinerary_ready",
        description: "Notify when AI-generated itinerary is ready",
        language: "en",
        sampleBody: "🗺️ Your {{1}}-day itinerary for {{2}} is ready! Reply 'View' to see your personalized travel plan.",
        parameters: ["days", "destination"],
    },

    // Re-engagement after inactivity
    REENGAGEMENT: {
        name: "travel_reengagement",
        description: "Re-engage inactive users",
        language: "en",
        sampleBody: "Hey there! 🌴 Planning your next adventure? I'm here to help you discover amazing destinations. Reply to start!",
    },

    // Weather alert for upcoming trip
    WEATHER_ALERT: {
        name: "trip_weather_alert",
        description: "Weather update for upcoming trip",
        language: "en",
        sampleBody: "🌤️ Weather update for your trip to {{1}} on {{2}}:\n{{3}}\n\nReply if you need to adjust your plans!",
        parameters: ["destination", "date", "weather_summary"],
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// SESSION TRACKING FOR 24-HOUR WINDOW
// ═══════════════════════════════════════════════════════════════════════════

// In-memory store for WhatsApp session timestamps
// In production, use a database
const whatsappSessions = new Map();

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Record when a user last messaged us
 * @param {string} phoneNumber - User's phone number
 */
export function recordUserMessage(phoneNumber) {
    whatsappSessions.set(phoneNumber, {
        lastMessageAt: Date.now(),
        isWithinWindow: true,
    });
}

/**
 * Check if we can send a free-form message (within 24-hour window)
 * @param {string} phoneNumber - User's phone number
 * @returns {boolean}
 */
export function isWithin24HourWindow(phoneNumber) {
    const session = whatsappSessions.get(phoneNumber);
    if (!session) return false;

    const elapsed = Date.now() - session.lastMessageAt;
    return elapsed < TWENTY_FOUR_HOURS_MS;
}

/**
 * Get time remaining in 24-hour window
 * @param {string} phoneNumber - User's phone number
 * @returns {{inWindow: boolean, remainingMs: number, remainingHours: number}}
 */
export function getWindowStatus(phoneNumber) {
    const session = whatsappSessions.get(phoneNumber);
    if (!session) {
        return { inWindow: false, remainingMs: 0, remainingHours: 0 };
    }

    const elapsed = Date.now() - session.lastMessageAt;
    const remaining = Math.max(0, TWENTY_FOUR_HOURS_MS - elapsed);

    return {
        inWindow: remaining > 0,
        remainingMs: remaining,
        remainingHours: Math.round((remaining / (60 * 60 * 1000)) * 10) / 10,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE SENDING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build template components with parameters
 * @param {Array<string>} values - Parameter values in order
 * @returns {Array<object>} WhatsApp template components
 */
function buildTemplateComponents(values) {
    if (!values || values.length === 0) return [];

    return [
        {
            type: "body",
            parameters: values.map((value) => ({
                type: "text",
                text: String(value),
            })),
        },
    ];
}

/**
 * Send welcome template to new user
 * @param {string} to - Phone number
 */
export async function sendWelcomeTemplate(to) {
    const template = TEMPLATES.WELCOME;
    return sendTemplateMessage(to, template.name, template.language);
}

/**
 * Send trip reminder template
 * @param {string} to - Phone number
 * @param {string} userName - User's name
 * @param {string} destination - Destination they were planning
 */
export async function sendTripReminderTemplate(to, userName, destination) {
    const template = TEMPLATES.TRIP_REMINDER;
    const components = buildTemplateComponents([userName, destination]);
    return sendTemplateMessage(to, template.name, template.language, components);
}

/**
 * Send travel deals template
 * @param {string} to - Phone number
 * @param {string} destination - Destination
 * @param {string} flightPrice - Flight price string
 * @param {string} hotelPrice - Hotel price string
 */
export async function sendTravelDealsTemplate(to, destination, flightPrice, hotelPrice) {
    const template = TEMPLATES.TRAVEL_DEALS;
    const components = buildTemplateComponents([destination, flightPrice, hotelPrice]);
    return sendTemplateMessage(to, template.name, template.language, components);
}

/**
 * Send booking confirmation template
 * @param {string} to - Phone number
 * @param {string} destination - Destination
 * @param {string} dates - Travel dates
 * @param {string} confirmationCode - Booking confirmation code
 */
export async function sendBookingConfirmationTemplate(to, destination, dates, confirmationCode) {
    const template = TEMPLATES.BOOKING_CONFIRMATION;
    const components = buildTemplateComponents([destination, dates, confirmationCode]);
    return sendTemplateMessage(to, template.name, template.language, components);
}

/**
 * Send itinerary ready template
 * @param {string} to - Phone number
 * @param {number} days - Number of days
 * @param {string} destination - Destination
 */
export async function sendItineraryReadyTemplate(to, days, destination) {
    const template = TEMPLATES.ITINERARY_READY;
    const components = buildTemplateComponents([String(days), destination]);
    return sendTemplateMessage(to, template.name, template.language, components);
}

/**
 * Send re-engagement template
 * @param {string} to - Phone number
 */
export async function sendReengagementTemplate(to) {
    const template = TEMPLATES.REENGAGEMENT;
    return sendTemplateMessage(to, template.name, template.language);
}

/**
 * Send weather alert template
 * @param {string} to - Phone number
 * @param {string} destination - Destination
 * @param {string} date - Trip date
 * @param {string} weatherSummary - Weather summary
 */
export async function sendWeatherAlertTemplate(to, destination, date, weatherSummary) {
    const template = TEMPLATES.WEATHER_ALERT;
    const components = buildTemplateComponents([destination, date, weatherSummary]);
    return sendTemplateMessage(to, template.name, template.language, components);
}

// ═══════════════════════════════════════════════════════════════════════════
// SMART MESSAGING - AUTO-SWITCH BETWEEN FREE-FORM AND TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send a message, automatically using template if outside 24-hour window
 * @param {string} to - Phone number
 * @param {string} freeFormMessage - Message to send if within window
 * @param {string} templateType - Template type to use if outside window (key from TEMPLATES)
 * @param {Array} templateParams - Parameters for template
 */
export async function sendSmartMessage(to, freeFormMessage, templateType = "REENGAGEMENT", templateParams = []) {
    const { sendTextMessage } = await import("./whatsapp.service.js");

    if (isWithin24HourWindow(to)) {
        // Within 24-hour window - send free-form message
        return sendTextMessage(to, freeFormMessage);
    }

    // Outside window - must use template
    const template = TEMPLATES[templateType];
    if (!template) {
        console.warn(`[WhatsApp Templates] Unknown template type: ${templateType}, using REENGAGEMENT`);
        return sendReengagementTemplate(to);
    }

    const components = buildTemplateComponents(templateParams);
    return sendTemplateMessage(to, template.name, template.language, components);
}

/**
 * Get all available template names for Meta approval
 * @returns {Array<{name: string, description: string, sampleBody: string}>}
 */
export function getTemplateDefinitions() {
    return Object.values(TEMPLATES).map((t) => ({
        name: t.name,
        description: t.description,
        sampleBody: t.sampleBody,
        parameters: t.parameters || [],
    }));
}
