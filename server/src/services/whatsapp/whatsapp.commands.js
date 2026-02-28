/**
 * WhatsApp Command Dispatcher
 *
 * Parses incoming messages for /commands and routes them
 * to the corresponding module service. Returns null if
 * the message is not a command (falls through to AI agent).
 */

/**
 * @typedef {Object} CommandResult
 * @property {string} command - The matched command name
 * @property {Array} messages - Array of WhatsApp-ready message objects
 */

/**
 * Registry of module service instances, populated at boot time
 * via `registerServices()`.
 */
const services = {};

/**
 * Register module service instances so commands can call them directly.
 * Called once during server bootstrap.
 *
 * @param {Object} svcMap
 * @param {Object} [svcMap.hotel]
 * @param {Object} [svcMap.attraction]
 * @param {Object} [svcMap.tour]
 * @param {Object} [svcMap.visa]
 * @param {Object} [svcMap.budget]
 * @param {Object} [svcMap.packing]
 * @param {Object} [svcMap.transportation]
 * @param {Object} [svcMap.routeOptimizer]
 * @param {Object} [svcMap.pdf]
 */
export function registerServices(svcMap) {
    Object.assign(services, svcMap);
}

// ═══════════════════════════════════════════════════════════════
// COMMAND DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const COMMANDS = [
    { name: "menu", pattern: /^\/menu$/i, handler: handleMenu },
    { name: "help", pattern: /^\/help$/i, handler: handleMenu },
    { name: "hotels", pattern: /^\/hotels?\s+(.+)/i, handler: handleHotels },
    { name: "attractions", pattern: /^\/attractions?\s+(.+)/i, handler: handleAttractions },
    { name: "tours", pattern: /^\/tours?\s+(.+)/i, handler: handleTours },
    { name: "visa", pattern: /^\/visa\s+(\S+)\s+(\S+)/i, handler: handleVisa },
    { name: "budget", pattern: /^\/budget\s+(\S+)/i, handler: handleBudget },
    { name: "packing", pattern: /^\/packing\s+(\S+)/i, handler: handlePacking },
    { name: "transport", pattern: /^\/transport\s+(.+?)\s+to\s+(.+)/i, handler: handleTransport },
    { name: "optimize", pattern: /^\/optimize/i, handler: handleOptimize },
    { name: "pdf", pattern: /^\/pdf/i, handler: handlePdf },
];

// ═══════════════════════════════════════════════════════════════
// MAIN DISPATCHER
// ═══════════════════════════════════════════════════════════════

/**
 * Try to dispatch a message as a command.
 * @param {string} text - Raw message text
 * @returns {Promise<CommandResult|null>} Result or null if not a command
 */
export async function dispatchCommand(text) {
    const trimmed = text.trim();
    if (!trimmed.startsWith("/")) return null;

    for (const cmd of COMMANDS) {
        const match = trimmed.match(cmd.pattern);
        if (match) {
            try {
                const messages = await cmd.handler(match);
                return { command: cmd.name, messages };
            } catch (error) {
                console.error(`[WhatsApp Command] /${cmd.name} failed:`, error.message);
                return {
                    command: cmd.name,
                    messages: [{ type: "text", body: `❌ Error running /${cmd.name}: ${error.message}` }],
                };
            }
        }
    }

    // Starts with / but didn't match any command
    return {
        command: "unknown",
        messages: [{
            type: "text",
            body: `❓ Unknown command: "${trimmed.split(/\s/)[0]}"\n\nType /menu to see all available commands.`,
        }],
    };
}

// ═══════════════════════════════════════════════════════════════
// COMMAND HANDLERS
// ═══════════════════════════════════════════════════════════════

/** /menu — Show all available commands */
async function handleMenu() {
    return [{
        type: "list",
        header: "🌍 Travel Assistant",
        body: "What would you like to do? Pick a feature below, or just type your travel question for AI-powered help!",
        buttonText: "Browse Features",
        sections: [
            {
                title: "🔍 Search & Discover",
                rows: [
                    { id: "cmd_hotels", title: "🏨 Search Hotels", description: "Type: /hotels <city>" },
                    { id: "cmd_attractions", title: "🗺️ Find Attractions", description: "Type: /attractions <city>" },
                    { id: "cmd_tours", title: "🎯 Browse Tours", description: "Type: /tours <lat> <lng>" },
                ],
            },
            {
                title: "📋 Trip Management",
                rows: [
                    { id: "cmd_visa", title: "🛂 Check Visa", description: "Type: /visa <from> <to>" },
                    { id: "cmd_budget", title: "💰 View Budget", description: "Type: /budget <tripId>" },
                    { id: "cmd_packing", title: "🎒 Packing List", description: "Type: /packing <tripId>" },
                    { id: "cmd_transport", title: "🚌 Transport Routes", description: "Type: /transport A to B" },
                ],
            },
        ],
    }];
}

/** /hotels <city> */
async function handleHotels(match) {
    const city = match[1].trim();

    if (!services.hotel) {
        return [{ type: "text", body: "🏨 Hotel search is currently unavailable. Please try again later." }];
    }

    const result = await services.hotel.search({ city, limit: 10 });
    const hotels = result.hotels || [];

    if (hotels.length === 0) {
        return [{ type: "text", body: `🏨 No hotels found in *${city}*. Try a different city name.` }];
    }

    return [
        { type: "text", body: `🏨 *Hotels in ${city}*\nFound ${result.total || hotels.length} hotels:` },
        {
            type: "list",
            header: "🏨 Hotel Results",
            body: `Top hotels in ${city}`,
            buttonText: "View Hotels",
            sections: [{
                title: `Hotels in ${city}`,
                rows: hotels.slice(0, 10).map((h, i) => ({
                    id: h.id || `hotel_${i}`,
                    title: (h.name || "Hotel").substring(0, 24),
                    description: `${h.price ? `💲${h.price}` : "Contact"} • ⭐ ${h.rating || "N/A"}`.substring(0, 72),
                })),
            }],
        },
    ];
}

/** /attractions <city> */
async function handleAttractions(match) {
    const city = match[1].trim();

    if (!services.attraction) {
        return [{ type: "text", body: "🗺️ Attraction search is currently unavailable. Please try again later." }];
    }

    const result = await services.attraction.search({ city });
    const attractions = result.attractions || [];

    if (attractions.length === 0) {
        return [{ type: "text", body: `🗺️ No attractions found in *${city}*. Try a different city name.` }];
    }

    return [
        { type: "text", body: `🗺️ *Top Attractions in ${city}*\nFound ${attractions.length} places:` },
        {
            type: "list",
            header: "🗺️ Attractions",
            body: `Things to see in ${city}`,
            buttonText: "View Places",
            sections: [{
                title: city.substring(0, 24),
                rows: attractions.slice(0, 10).map((a, i) => ({
                    id: a.id || `attr_${i}`,
                    title: (a.name || "Attraction").substring(0, 24),
                    description: `⭐ ${a.rating || "N/A"} • ${a.category || ""}`.substring(0, 72),
                })),
            }],
        },
    ];
}

/** /tours <lat> <lng> OR /tours <city> */
async function handleTours(match) {
    const args = match[1].trim();

    if (!services.tour) {
        return [{ type: "text", body: "🎯 Tour search is currently unavailable. Please try again later." }];
    }

    // Try parsing as lat/lng
    const coords = args.match(/^(-?[\d.]+)\s+(-?[\d.]+)$/);
    let query;
    let label;

    if (coords) {
        query = { latitude: parseFloat(coords[1]), longitude: parseFloat(coords[2]), radius: 50000 };
        label = `(${coords[1]}, ${coords[2]})`;
    } else {
        // Treat as city name — tour service needs coordinates, so provide a helpful message
        return [{
            type: "text",
            body: `🎯 *Tour Search*\n\nPlease provide coordinates:\n\`/tours <latitude> <longitude>\`\n\nExample: \`/tours 48.8566 2.3522\` (Paris)`,
        }];
    }

    const tours = await services.tour.search(query);

    if (!tours || tours.length === 0) {
        return [{ type: "text", body: `🎯 No tours found near ${label}. Try different coordinates.` }];
    }

    return [
        { type: "text", body: `🎯 *Tours near ${label}*\nFound ${tours.length} tours:` },
        {
            type: "list",
            header: "🎯 Tours",
            body: `Available tours`,
            buttonText: "View Tours",
            sections: [{
                title: "Tours",
                rows: tours.slice(0, 10).map((t, i) => ({
                    id: t.id || `tour_${i}`,
                    title: (t.name || "Tour").substring(0, 24),
                    description: `⭐ ${t.rating || "N/A"} • ${t.price || ""}`.substring(0, 72),
                })),
            }],
        },
    ];
}

/** /visa <from_country> <to_country> */
async function handleVisa(match) {
    const from = match[1].trim().toUpperCase();
    const to = match[2].trim().toUpperCase();

    if (!services.visa) {
        return [{ type: "text", body: "🛂 Visa checker is currently unavailable. Please try again later." }];
    }

    const result = await services.visa.getVisaRequirement(from, to);

    const req = result.visaRequirement || {};
    const statusEmoji = {
        "visa-free": "✅",
        "evisa": "📱",
        "visa-on-arrival": "🛬",
        "visa-required": "📋",
    };

    const emoji = statusEmoji[req.status] || "ℹ️";
    let text = `🛂 *Visa Requirement*\n\n`;
    text += `📍 From: *${from}*\n`;
    text += `📍 To: *${to}*\n\n`;
    text += `${emoji} Status: *${req.status || "Unknown"}*\n`;

    if (req.duration) text += `⏱️ Stay: ${req.duration}\n`;
    if (req.notes) text += `📝 Notes: ${req.notes}\n`;

    text += `\n🕐 Last updated: ${result.lastUpdated || "N/A"}`;

    return [{ type: "text", body: text }];
}

/** /budget <tripId> */
async function handleBudget(match) {
    const tripId = match[1].trim();

    if (!services.budget) {
        return [{ type: "text", body: "💰 Budget tracker is currently unavailable. Please try again later." }];
    }

    const result = await services.budget.getExpenses(tripId);
    const expenses = result.expenses || [];
    const settings = result.budgetSettings;

    let text = `💰 *Budget for Trip*\n\n`;

    if (settings && settings.totalBudget) {
        const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const remaining = settings.totalBudget - totalSpent;
        text += `📊 Total Budget: $${settings.totalBudget}\n`;
        text += `💸 Spent: $${totalSpent.toFixed(2)}\n`;
        text += `${remaining >= 0 ? "✅" : "⚠️"} Remaining: $${remaining.toFixed(2)}\n\n`;
    }

    if (expenses.length === 0) {
        text += `No expenses recorded yet.`;
    } else {
        text += `📋 *Recent Expenses:*\n`;
        expenses.slice(0, 10).forEach((e, i) => {
            text += `${i + 1}. ${e.note || "Expense"} — $${e.amount || 0} (${e.date || "N/A"})\n`;
        });
        if (expenses.length > 10) {
            text += `\n... and ${expenses.length - 10} more`;
        }
    }

    return [{ type: "text", body: text }];
}

/** /packing <tripId> */
async function handlePacking(match) {
    const tripId = match[1].trim();

    if (!services.packing) {
        return [{ type: "text", body: "🎒 Packing assistant is currently unavailable. Please try again later." }];
    }

    const result = await services.packing.getPackingList(tripId);
    const items = result.items || [];

    let text = `🎒 *Packing List*\n\n`;

    if (items.length === 0) {
        text += `Your packing list is empty. Add items through the app!`;
    } else {
        const packed = items.filter((i) => i.checked);
        const unpacked = items.filter((i) => !i.checked);

        text += `📊 Progress: ${packed.length}/${items.length} items packed\n\n`;

        if (unpacked.length > 0) {
            text += `❌ *Still need to pack:*\n`;
            unpacked.slice(0, 15).forEach((item) => {
                text += `• ${item.label || item.name || "Item"}\n`;
            });
            if (unpacked.length > 15) {
                text += `  ... and ${unpacked.length - 15} more\n`;
            }
            text += `\n`;
        }

        if (packed.length > 0) {
            text += `✅ *Already packed:*\n`;
            packed.slice(0, 10).forEach((item) => {
                text += `• ${item.label || item.name || "Item"}\n`;
            });
            if (packed.length > 10) {
                text += `  ... and ${packed.length - 10} more\n`;
            }
        }
    }

    return [{ type: "text", body: text }];
}

/** /transport <origin> to <destination> */
async function handleTransport(match) {
    const originName = match[1].trim();
    const destName = match[2].trim();

    if (!services.transportation) {
        return [{ type: "text", body: "🚌 Transportation service is currently unavailable. Please try again later." }];
    }

    // The transportation service requires lat/lng coordinates.
    // We send a helpful message since we can't geocode from WhatsApp alone.
    return [{
        type: "text",
        body:
            `🚌 *Transport: ${originName} → ${destName}*\n\n` +
            `The transport planner needs precise coordinates.\n` +
            `Please use the web app for full route planning, or ask me in natural language:\n\n` +
            `💬 _"How do I get from ${originName} to ${destName}?"_\n\n` +
            `I'll use AI to find the best routes for you!`,
    }];
}

/** /optimize — info only */
async function handleOptimize() {
    return [{
        type: "text",
        body:
            `🗺️ *Route Optimizer*\n\n` +
            `The route optimizer creates the most efficient order to visit your attractions.\n\n` +
            `To use it, ask in natural language:\n` +
            `💬 _"Optimize my route through Paris attractions"_\n` +
            `💬 _"Plan a 3-day itinerary for Tokyo"_\n\n` +
            `Or use the web app for full itinerary planning with maps!`,
    }];
}

/** /pdf — info only */
async function handlePdf() {
    return [{
        type: "text",
        body:
            `📄 *PDF Export*\n\n` +
            `You can generate a beautiful PDF of your trip itinerary.\n\n` +
            `This feature is available through the web app after you create an itinerary.\n\n` +
            `Need help planning? Just type your question:\n` +
            `💬 _"Plan a 5-day trip to Bali"_`,
    }];
}
