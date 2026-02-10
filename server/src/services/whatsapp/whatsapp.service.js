import axios from "axios";
import config from "../../config.js";

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

/**
 * Get WhatsApp API endpoint for sending messages
 */
function getMessagesEndpoint() {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    return `${WHATSAPP_API_URL}/${phoneNumberId}/messages`;
}

/**
 * Get authorization headers for WhatsApp API
 */
function getHeaders() {
    return {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    };
}

/**
 * Send a simple text message
 * @param {string} to - Recipient phone number (with country code, no +)
 * @param {string} text - Message text
 */
export async function sendTextMessage(to, text) {
    try {
        const response = await axios.post(
            getMessagesEndpoint(),
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "text",
                text: { body: text },
            },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending WhatsApp text message:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Send interactive button message (max 3 buttons)
 * @param {string} to - Recipient phone number
 * @param {string} body - Message body text
 * @param {Array<{id: string, title: string}>} buttons - Button options (max 3)
 * @param {string} [header] - Optional header text
 * @param {string} [footer] - Optional footer text
 */
export async function sendInteractiveButtons(to, body, buttons, header = null, footer = null) {
    if (buttons.length > 3) {
        console.warn("WhatsApp buttons limited to 3. Truncating extra buttons.");
        buttons = buttons.slice(0, 3);
    }

    const interactive = {
        type: "button",
        body: { text: body },
        action: {
            buttons: buttons.map((btn) => ({
                type: "reply",
                reply: {
                    id: btn.id,
                    title: btn.title.substring(0, 20), // Max 20 chars
                },
            })),
        },
    };

    if (header) {
        interactive.header = { type: "text", text: header.substring(0, 60) };
    }
    if (footer) {
        interactive.footer = { text: footer.substring(0, 60) };
    }

    try {
        const response = await axios.post(
            getMessagesEndpoint(),
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "interactive",
                interactive,
            },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending WhatsApp button message:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Send interactive list message (max 10 items per section)
 * @param {string} to - Recipient phone number
 * @param {string} body - Message body text
 * @param {string} buttonText - Text on the list button
 * @param {Array<{title: string, rows: Array<{id: string, title: string, description?: string}>}>} sections
 * @param {string} [header] - Optional header text
 * @param {string} [footer] - Optional footer text
 */
export async function sendInteractiveList(to, body, buttonText, sections, header = null, footer = null) {
    // Enforce WhatsApp limits
    const limitedSections = sections.map((section) => ({
        title: section.title.substring(0, 24),
        rows: section.rows.slice(0, 10).map((row) => ({
            id: row.id,
            title: row.title.substring(0, 24),
            description: row.description ? row.description.substring(0, 72) : undefined,
        })),
    }));

    const interactive = {
        type: "list",
        body: { text: body },
        action: {
            button: buttonText.substring(0, 20),
            sections: limitedSections,
        },
    };

    if (header) {
        interactive.header = { type: "text", text: header.substring(0, 60) };
    }
    if (footer) {
        interactive.footer = { text: footer.substring(0, 60) };
    }

    try {
        const response = await axios.post(
            getMessagesEndpoint(),
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "interactive",
                interactive,
            },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending WhatsApp list message:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Send template message (for messages outside 24-hour window)
 * @param {string} to - Recipient phone number
 * @param {string} templateName - Name of the approved template
 * @param {string} languageCode - Template language code (e.g., "en_US")
 * @param {Array<{type: string, text?: string}>} [components] - Optional template components
 */
export async function sendTemplateMessage(to, templateName, languageCode = "en_US", components = []) {
    try {
        const response = await axios.post(
            getMessagesEndpoint(),
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "template",
                template: {
                    name: templateName,
                    language: { code: languageCode },
                    components: components.length > 0 ? components : undefined,
                },
            },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending WhatsApp template message:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Mark a message as read
 * @param {string} messageId - WhatsApp message ID to mark as read
 */
export async function markAsRead(messageId) {
    try {
        const response = await axios.post(
            getMessagesEndpoint(),
            {
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId,
            },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error marking message as read:", error.response?.data || error.message);
        // Don't throw - this is non-critical
    }
}
