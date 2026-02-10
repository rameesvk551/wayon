/**
 * WhatsApp Converters
 * Convert UI blocks from the AI trip planner to WhatsApp-compatible message formats
 */

import {
    sendTextMessage,
    sendInteractiveButtons,
    sendInteractiveList,
} from "./whatsapp.service.js";

/**
 * Convert hotel carousel block to WhatsApp list message
 */
function convertHotelCarousel(block) {
    const hotels = block.hotels || [];
    if (hotels.length === 0) return null;

    return {
        type: "list",
        header: "🏨 Hotel Options",
        body: block.title || "Here are the top hotels for your trip:",
        buttonText: "View Hotels",
        sections: [
            {
                title: "Available Hotels",
                rows: hotels.slice(0, 10).map((hotel, index) => ({
                    id: hotel.id || `hotel_${index}`,
                    title: (hotel.name || "Hotel").substring(0, 24),
                    description: `⭐ ${hotel.rating || "N/A"} • ${hotel.price || "Contact for price"}`.substring(0, 72),
                })),
            },
        ],
    };
}

/**
 * Convert flight carousel block to WhatsApp list message
 */
function convertFlightCarousel(block) {
    const flights = block.flights || [];
    if (flights.length === 0) return null;

    return {
        type: "list",
        header: "✈️ Flight Options",
        body: block.title || "Available flights for your trip:",
        buttonText: "View Flights",
        sections: [
            {
                title: "Flight Options",
                rows: flights.slice(0, 10).map((flight, index) => ({
                    id: flight.id || `flight_${index}`,
                    title: `${flight.airline || "Flight"} ${flight.flightNumber || ""}`.substring(0, 24),
                    description: `${flight.departure} → ${flight.arrival} • ${flight.price || ""}`.substring(0, 72),
                })),
            },
        ],
    };
}

/**
 * Convert attraction carousel block to WhatsApp list message
 */
function convertAttractionCarousel(block) {
    const attractions = block.attractions || [];
    if (attractions.length === 0) return null;

    return {
        type: "list",
        header: "🗺️ Top Attractions",
        body: block.destination
            ? `Attractions in ${block.destination}:`
            : "Top attractions for your trip:",
        buttonText: "View Attractions",
        sections: [
            {
                title: block.destination || "Attractions",
                rows: attractions.slice(0, 10).map((attr, index) => ({
                    id: attr.id || `attr_${index}`,
                    title: (attr.name || "Attraction").substring(0, 24),
                    description: `⭐ ${attr.rating || "N/A"} • ${attr.category || ""}`.substring(0, 72),
                })),
            },
        ],
    };
}

/**
 * Convert collect_input block to WhatsApp buttons or list
 */
function convertCollectInput(block) {
    const inputs = block.inputs || [];
    if (inputs.length === 0) return null;

    // Input type to button mappings
    const inputOptions = {
        destination: { id: "input_destination", title: "Select Destination" },
        companions: { id: "input_companions", title: "Travel Companions" },
        budget: { id: "input_budget", title: "Set Budget" },
        dates: { id: "input_dates", title: "Pick Dates" },
        location: { id: "input_location", title: "Your Location" },
        transport: { id: "input_transport", title: "Transport Mode" },
        interests: { id: "input_interests", title: "Your Interests" },
    };

    const buttons = inputs
        .slice(0, 3)
        .map((input) => inputOptions[input] || { id: `input_${input}`, title: input })
        .filter(Boolean);

    if (buttons.length <= 3) {
        return {
            type: "buttons",
            body: block.title || "Help me personalize your trip",
            buttons,
        };
    }

    // If more than 3 options, use a list
    return {
        type: "list",
        header: "📝 Trip Details",
        body: block.title || "Help me personalize your trip",
        buttonText: "Select Option",
        sections: [
            {
                title: "Required Information",
                rows: inputs.map((input) => ({
                    id: `input_${input}`,
                    title: inputOptions[input]?.title || input,
                    description: `Provide your ${input}`,
                })),
            },
        ],
    };
}

/**
 * Convert weather block to text message
 */
function convertWeather(block) {
    const emoji = {
        sunny: "☀️",
        cloudy: "☁️",
        rainy: "🌧️",
        snowy: "❄️",
        partly_cloudy: "⛅",
    };

    const conditionEmoji = emoji[block.condition] || "🌤️";

    let text = `${conditionEmoji} *Weather in ${block.location}*\n\n`;
    text += `🌡️ Temperature: ${block.temperature}°C`;
    if (block.feelsLike) text += ` (feels like ${block.feelsLike}°C)`;
    text += `\n💧 Humidity: ${block.humidity}%`;
    text += `\n💨 Wind: ${block.wind}`;
    if (block.uvIndex && block.uvIndex !== "N/A") {
        text += `\n☀️ UV Index: ${block.uvIndex}`;
    }

    return {
        type: "text",
        body: text,
    };
}

/**
 * Convert alert block to text message
 */
function convertAlert(block) {
    const prefix = {
        warning: "⚠️",
        info: "ℹ️",
        success: "✅",
        error: "❌",
    };

    return {
        type: "text",
        body: `${prefix[block.level] || "📢"} ${block.text}`,
    };
}

/**
 * Convert list block to text message
 */
function convertList(block) {
    const items = block.items || [];
    if (items.length === 0) return null;

    const listText = items
        .map((item, index) => (block.ordered ? `${index + 1}. ${item.text}` : `• ${item.text}`))
        .join("\n");

    return {
        type: "text",
        body: listText,
    };
}

/**
 * Convert UI blocks to WhatsApp message format
 * @param {Array} blocks - Array of UI blocks from the agent
 * @returns {Array} Array of WhatsApp message objects
 */
export function convertBlocksToWhatsApp(blocks) {
    if (!blocks || !Array.isArray(blocks)) return [];

    const messages = [];

    for (const block of blocks) {
        let converted = null;

        switch (block.type) {
            case "hotel_carousel":
                converted = convertHotelCarousel(block);
                break;
            case "flight_carousel":
                converted = convertFlightCarousel(block);
                break;
            case "attraction_carousel":
                converted = convertAttractionCarousel(block);
                break;
            case "collect_input":
                converted = convertCollectInput(block);
                break;
            case "weather":
                converted = convertWeather(block);
                break;
            case "alert":
                converted = convertAlert(block);
                break;
            case "list":
                converted = convertList(block);
                break;
            default:
                console.log(`[WhatsApp] Unknown block type: ${block.type}`);
        }

        if (converted) {
            messages.push(converted);
        }
    }

    return messages;
}

/**
 * Send converted messages to WhatsApp
 * @param {string} to - Recipient phone number
 * @param {Array} messages - Converted WhatsApp messages
 */
export async function sendConvertedMessages(to, messages) {
    const results = [];

    for (const msg of messages) {
        try {
            let result;
            switch (msg.type) {
                case "text":
                    result = await sendTextMessage(to, msg.body);
                    break;
                case "buttons":
                    result = await sendInteractiveButtons(to, msg.body, msg.buttons, msg.header);
                    break;
                case "list":
                    result = await sendInteractiveList(
                        to,
                        msg.body,
                        msg.buttonText,
                        msg.sections,
                        msg.header
                    );
                    break;
                default:
                    console.warn(`[WhatsApp] Unknown message type: ${msg.type}`);
            }
            if (result) results.push(result);
        } catch (error) {
            console.error(`[WhatsApp] Failed to send message:`, error.message);
            results.push({ error: error.message });
        }
    }

    return results;
}

/**
 * Convert a full agent response (text + UI blocks) to WhatsApp messages
 * @param {string} replyText - The text reply from the agent
 * @param {object} ui - The UI object containing blocks
 * @returns {Array} Array of WhatsApp message objects (text first, then interactive)
 */
export function convertAgentResponseToWhatsApp(replyText, ui) {
    const messages = [];

    // Add text reply if present
    if (replyText && replyText.trim()) {
        messages.push({
            type: "text",
            body: replyText,
        });
    }

    // Convert UI blocks
    if (ui && ui.blocks) {
        const blockMessages = convertBlocksToWhatsApp(ui.blocks);
        messages.push(...blockMessages);
    }

    return messages;
}
