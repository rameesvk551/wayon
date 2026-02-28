/**
 * @typedef {'visa-free' | 'evisa' | 'visa-on-arrival' | 'visa-required'} VisaStatus
 */

/**
 * @typedef {Object} VisaRequirement
 * @property {string} country
 * @property {string} countryCode
 * @property {string} [passportCode]
 * @property {boolean} visaRequired
 * @property {string} [visaType]
 * @property {VisaStatus} status
 * @property {string} [maxStay]
 * @property {string} description
 * @property {string} [processingTime]
 * @property {string} [cost]
 * @property {string[]} [requirements]
 * @property {string[]} [documents]
 * @property {string[]} [nextSteps]
 * @property {string} [notes]
 * @property {string} [sourceUrl]
 */

/**
 * @typedef {Object} VisaInfo
 * @property {string} fromCountry
 * @property {string} toCountry
 * @property {VisaRequirement} visaRequirement
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} PassportEntry
 * @property {string} code
 * @property {string} name
 */

/**
 * @typedef {Object} DestinationEntry
 * @property {string} code
 * @property {string} name
 */

/**
 * Creates a fallback VisaRequirement when API is unavailable.
 * @param {string} from
 * @param {string} to
 * @returns {VisaRequirement}
 */
export function createFallbackRequirement(from, to) {
    return {
        country: to,
        countryCode: to.toUpperCase(),
        passportCode: from.toUpperCase(),
        visaRequired: true,
        visaType: "visa-required",
        status: "visa-required",
        description: "Unable to fetch live data. Please check with the embassy.",
        documents: ["Valid passport"],
        nextSteps: ["Check embassy website for requirements"],
    };
}
