/**
 * Maps raw API requirement string to internal VisaStatus.
 * @param {string} requirement
 * @returns {import('../models/visa.models.js').VisaStatus}
 */
export function mapApiStatus(requirement) {
    const r = (requirement || "").toLowerCase().trim();
    if (
        r === "free" ||
        r === "visa-free" ||
        r === "visa free" ||
        r === "freedom of movement"
    )
        return "visa-free";
    if (
        r === "e-visa" ||
        r === "evisa" ||
        r === "eta" ||
        r === "e-visa / eta"
    )
        return "evisa";
    if (
        r === "on-arrival" ||
        r === "visa on arrival" ||
        r === "visa-on-arrival" ||
        r === "on arrival"
    )
        return "visa-on-arrival";
    return "visa-required";
}

/**
 * Maps API color codes to visa requirement strings.
 * Based on the RapidAPI Visa Requirement v2 color scheme.
 * @param {string} color
 * @returns {string}
 */
export function colorToRequirement(color) {
    switch (color.toLowerCase()) {
        case "green":
            return "free";
        case "blue":
            return "on-arrival";
        case "yellow":
            return "e-visa";
        case "red":
            return "required";
        case "grey":
        case "gray":
        default:
            return "required";
    }
}

/**
 * @param {import('../models/visa.models.js').VisaStatus} status
 * @returns {string[]}
 */
export function mapStatusToDocuments(status) {
    switch (status) {
        case "visa-free":
            return ["Valid passport", "Return ticket"];
        case "evisa":
            return [
                "Valid passport (6+ months validity)",
                "Digital passport photo",
                "Return ticket",
                "Proof of accommodation",
                "Bank statement",
            ];
        case "visa-on-arrival":
            return [
                "Valid passport (6+ months validity)",
                "Passport-size photo",
                "Return ticket",
                "Proof of funds",
                "Hotel booking",
            ];
        case "visa-required":
            return [
                "Valid passport",
                "Visa application form",
                "Passport photos",
                "Bank statements",
                "Employment/sponsor letter",
                "Travel itinerary",
                "Travel insurance",
            ];
        default:
            return ["Valid passport"];
    }
}

/**
 * @param {import('../models/visa.models.js').VisaStatus} status
 * @param {string} destinationName
 * @returns {string[]}
 */
export function mapStatusToNextSteps(status, destinationName) {
    switch (status) {
        case "visa-free":
            return [
                "Book your flights",
                `No visa paperwork needed for ${destinationName}!`,
            ];
        case "evisa":
            return [
                "Apply online at official eVisa portal",
                "Print or download your eVisa approval",
                "Carry printed copy during travel",
            ];
        case "visa-on-arrival":
            return [
                "Prepare required documents before travel",
                "Carry local currency or USD for visa fee",
                "Complete application form on arrival",
            ];
        case "visa-required":
            return [
                "Check embassy website for latest requirements",
                "Book visa appointment at embassy/consulate",
                "Submit all required documents",
                "Wait for visa approval",
            ];
        default:
            return ["Check with embassy for details"];
    }
}

/**
 * @param {import('../models/visa.models.js').VisaStatus} status
 * @returns {string}
 */
export function mapStatusToProcessingTime(status) {
    switch (status) {
        case "visa-free":
            return "Instant";
        case "evisa":
            return "2-5 business days";
        case "visa-on-arrival":
            return "On arrival";
        case "visa-required":
            return "1-4 weeks";
        default:
            return "Unknown";
    }
}

/**
 * @param {import('../models/visa.models.js').VisaStatus} status
 * @returns {string}
 */
export function mapStatusToCost(status) {
    switch (status) {
        case "visa-free":
            return "Free";
        case "evisa":
            return "~$25-80";
        case "visa-on-arrival":
            return "~$20-50";
        case "visa-required":
            return "~$50-200";
        default:
            return "Check with embassy";
    }
}
