import { Router } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent.js";
import { getOrCreateSession, setSessionMessages } from "../memory.js";
import { parseAiResponse } from "../utils/ai-response.js";
import { deriveIntent } from "../utils/intent.js";
import { buildUiForIntent } from "../services/ui/builders.js";
import { safeJsonParse } from "../utils/http.js";
import {
    sendTextMessage,
    sendInteractiveButtons,
    sendInteractiveList,
    markAsRead,
} from "../services/whatsapp/whatsapp.service.js";
import {
    convertAgentResponseToWhatsApp,
    sendConvertedMessages,
} from "../services/whatsapp/whatsapp.converters.js";
import {
    recordUserMessage,
    isWithin24HourWindow,
    getWindowStatus,
    getTemplateDefinitions,
    sendWelcomeTemplate,
    sendTripReminderTemplate,
    sendReengagementTemplate,
    sendItineraryReadyTemplate,
} from "../services/whatsapp/whatsapp.templates.js";

const router = Router();

// Logging utilities
const LOG_COLORS = {
    reset: "\x1b[0m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
};

const getTimestamp = () => new Date().toISOString().replace("T", " ").slice(0, 23);

const logWhatsApp = (level, message, data = null) => {
    const timestamp = getTimestamp();
    const colors = {
        info: LOG_COLORS.cyan,
        success: LOG_COLORS.green,
        warn: LOG_COLORS.yellow,
        error: LOG_COLORS.red,
    };
    const color = colors[level] || LOG_COLORS.reset;
    const prefix = `${LOG_COLORS.dim}[${timestamp}]${LOG_COLORS.reset} ${color}[WHATSAPP]${LOG_COLORS.reset}`;

    console.log(`${prefix} ${message}`);
    if (data) {
        console.log(`${LOG_COLORS.dim}├─ Details:${LOG_COLORS.reset}`, JSON.stringify(data, null, 2));
    }
};

/**
 * GET /whatsapp/webhook - Webhook verification for Meta Cloud API
 */
router.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    logWhatsApp("info", `📩 Webhook verification request`, { mode, token: token ? "***" : undefined });

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === "subscribe" && token === verifyToken) {
        logWhatsApp("success", `✅ Webhook verified successfully`);
        return res.status(200).send(challenge);
    }

    logWhatsApp("error", `❌ Webhook verification failed`);
    return res.status(403).send("Forbidden");
});

/**
 * Helper functions for extracting data from messages
 */
const getMessageType = (message) => {
    if (!message) return "unknown";
    if (typeof message._getType === "function") return message._getType();
    if (message.type) return message.type;
    if (message.role) return message.role;
    return "unknown";
};

const extractFinalAiMessage = (messages) => {
    const aiMessages = messages.filter((msg) => getMessageType(msg) === "ai");
    return aiMessages[aiMessages.length - 1] || null;
};

const extractToolResults = (messages) => {
    const results = [];
    const toolMessages = messages.filter((msg) => getMessageType(msg) === "tool");
    for (const toolMsg of toolMessages) {
        const parsed = safeJsonParse(toolMsg?.content);
        if (!parsed) continue;
        results.push({
            service: parsed.service,
            ok: parsed.ok,
            status: parsed.status,
            data: parsed.data,
            error: parsed.error,
            request: parsed.request,
        });
    }
    return results;
};

/**
 * Process a WhatsApp message and return the AI response
 */
async function processWhatsAppMessage(phoneNumber, messageText, messageId) {
    logWhatsApp("info", `💬 Processing message from ${phoneNumber}`, { text: messageText.slice(0, 100) });

    // Mark message as read
    if (messageId) {
        await markAsRead(messageId).catch(() => { });
    }

    // Use phone number as session ID
    const sessionId = `whatsapp_${phoneNumber}`;
    const session = getOrCreateSession(sessionId);

    const userMessage = new HumanMessage(messageText);
    const inputMessages = [...session.messages, userMessage];

    logWhatsApp("info", `⏳ Invoking LangGraph agent...`);
    const startTime = Date.now();

    const result = await graph.invoke({ messages: inputMessages }, { recursionLimit: 8 });

    const duration = Date.now() - startTime;
    logWhatsApp("success", `✅ Agent completed in ${duration}ms`);

    // Update session
    setSessionMessages(session.id, result.messages || inputMessages);

    // Build response
    const finalAi = extractFinalAiMessage(result.messages || []);
    const content = finalAi?.content || "";
    const parsed = parseAiResponse(content);
    const structured = parsed.ok ? parsed.data : null;

    const toolResults = extractToolResults(result.messages || []);
    const intent = deriveIntent({ structured, toolResults, itinerary: null });
    const ui = buildUiForIntent({ intent, structuredPayload: structured, toolResults });

    const replyText = structured?.reply || content || "I'm here to help plan your trip!";

    return { replyText, ui };
}

/**
 * POST /whatsapp/webhook - Handle incoming WhatsApp messages
 */
router.post("/webhook", async (req, res) => {
    logWhatsApp("info", `📨 Incoming webhook POST`);

    // Acknowledge receipt immediately (WhatsApp requires quick response)
    res.status(200).send("EVENT_RECEIVED");

    try {
        const body = req.body;

        // Extract message from webhook payload
        const entry = body?.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        // Check if this is a message event
        if (!value?.messages || value.messages.length === 0) {
            logWhatsApp("info", `📭 No messages in webhook (status update or other event)`);
            return;
        }

        const message = value.messages[0];
        const phoneNumber = message.from;
        const messageId = message.id;

        // Record message timestamp for 24-hour window tracking
        recordUserMessage(phoneNumber);

        // Extract message text based on type
        let messageText = "";
        switch (message.type) {
            case "text":
                messageText = message.text?.body || "";
                break;
            case "interactive":
                // Handle button or list replies
                if (message.interactive?.type === "button_reply") {
                    messageText = message.interactive.button_reply?.title || message.interactive.button_reply?.id || "";
                } else if (message.interactive?.type === "list_reply") {
                    messageText = message.interactive.list_reply?.title || message.interactive.list_reply?.id || "";
                }
                break;
            default:
                logWhatsApp("warn", `⚠️ Unsupported message type: ${message.type}`);
                await sendTextMessage(
                    phoneNumber,
                    "I can only process text messages at the moment. Please type your travel query!"
                );
                return;
        }

        if (!messageText.trim()) {
            logWhatsApp("warn", `⚠️ Empty message received`);
            return;
        }

        logWhatsApp("info", `📱 Message from ${phoneNumber}`, { type: message.type, text: messageText.slice(0, 100) });

        // Process message with AI agent
        const { replyText, ui } = await processWhatsAppMessage(phoneNumber, messageText, messageId);

        // Convert response to WhatsApp format
        const whatsappMessages = convertAgentResponseToWhatsApp(replyText, ui);

        logWhatsApp("info", `📤 Sending ${whatsappMessages.length} message(s) to ${phoneNumber}`);

        // Send all messages
        await sendConvertedMessages(phoneNumber, whatsappMessages);

        logWhatsApp("success", `✅ Response sent successfully`);
    } catch (error) {
        logWhatsApp("error", `❌ Error processing webhook`, { error: error.message, stack: error.stack?.split("\n").slice(0, 5) });

        // Try to send error message if we have the phone number
        try {
            const phoneNumber = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
            if (phoneNumber) {
                await sendTextMessage(
                    phoneNumber,
                    "Sorry, I encountered an error processing your request. Please try again!"
                );
            }
        } catch (sendError) {
            logWhatsApp("error", `❌ Failed to send error message`, { error: sendError.message });
        }
    }
});

/**
 * POST /whatsapp/send - Manual send endpoint (for testing)
 */
router.post("/send", async (req, res) => {
    const { to, message, type } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message' in request body" });
    }

    try {
        let result;
        switch (type) {
            case "buttons":
                result = await sendInteractiveButtons(to, message, [
                    { id: "option_1", title: "Option 1" },
                    { id: "option_2", title: "Option 2" },
                ]);
                break;
            case "list":
                result = await sendInteractiveList(to, message, "View Options", [
                    {
                        title: "Options",
                        rows: [
                            { id: "item_1", title: "Item 1", description: "First option" },
                            { id: "item_2", title: "Item 2", description: "Second option" },
                        ],
                    },
                ]);
                break;
            default:
                result = await sendTextMessage(to, message);
        }

        return res.json({ success: true, result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /whatsapp/templates - List available template definitions
 */
router.get("/templates", (req, res) => {
    const templates = getTemplateDefinitions();
    return res.json({
        info: "These templates must be created and approved in Meta Business Manager before use.",
        templates,
    });
});

/**
 * GET /whatsapp/session/:phoneNumber - Get session status for a phone number
 */
router.get("/session/:phoneNumber", (req, res) => {
    const { phoneNumber } = req.params;
    const status = getWindowStatus(phoneNumber);
    return res.json({
        phoneNumber,
        ...status,
        canSendFreeForm: status.inWindow,
        mustUseTemplate: !status.inWindow,
    });
});

/**
 * POST /whatsapp/template - Send a template message
 */
router.post("/template", async (req, res) => {
    const { to, templateType, params } = req.body;

    if (!to || !templateType) {
        return res.status(400).json({ error: "Missing 'to' or 'templateType' in request body" });
    }

    try {
        let result;
        switch (templateType.toUpperCase()) {
            case "WELCOME":
                result = await sendWelcomeTemplate(to);
                break;
            case "TRIP_REMINDER":
                if (!params?.userName || !params?.destination) {
                    return res.status(400).json({ error: "TRIP_REMINDER requires params.userName and params.destination" });
                }
                result = await sendTripReminderTemplate(to, params.userName, params.destination);
                break;
            case "ITINERARY_READY":
                if (!params?.days || !params?.destination) {
                    return res.status(400).json({ error: "ITINERARY_READY requires params.days and params.destination" });
                }
                result = await sendItineraryReadyTemplate(to, params.days, params.destination);
                break;
            case "REENGAGEMENT":
            default:
                result = await sendReengagementTemplate(to);
                break;
        }

        return res.json({ success: true, result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
