/**
 * Legacy in-memory repository — used as fallback when RAPIDAPI_KEY is not set.
 */
export class InMemoryVisaRepository {
    #catalog = {
        "US-IN": {
            visaRequired: true,
            visaType: "evisa",
            status: "evisa",
            maxStay: "60 days",
            description:
                "US citizens require an e-Visa to visit India for tourism purposes.",
            processingTime: "1-4 business days",
            cost: "$80 USD",
            requirements: [
                "Valid passport with 6 months validity",
                "Recent passport-size photograph",
                "Return ticket",
                "Proof of accommodation",
            ],
            documents: [
                "Valid passport with 6 months validity",
                "Recent passport-size photograph",
                "Return ticket",
                "Proof of accommodation",
            ],
            nextSteps: [
                "Apply online at indianvisaonline.gov.in",
                "Print your eVisa approval",
            ],
            sourceUrl: "https://indianvisaonline.gov.in",
        },
        "IN-US": {
            visaRequired: true,
            visaType: "visa-required",
            status: "visa-required",
            maxStay: "Varies by visa type",
            description: "Indian citizens require a visa to visit the United States.",
            processingTime: "Several weeks",
            cost: "$160 USD",
            requirements: [
                "Valid passport",
                "DS-160 form",
                "Interview appointment",
                "Supporting documents",
            ],
            documents: [
                "Valid passport",
                "DS-160 form",
                "Interview appointment",
                "Supporting documents",
            ],
            nextSteps: [
                "Complete DS-160 online",
                "Schedule visa interview",
            ],
        },
    };

    /**
     * @param {string} from
     * @param {string} to
     * @returns {Promise<import('../models/visa.models.js').VisaRequirement>}
     */
    async getVisaRequirement(from, to) {
        const key = `${from.toUpperCase()}-${to.toUpperCase()}`;
        const match = this.#catalog[key];

        if (match) {
            return {
                country: to,
                countryCode: to,
                visaRequired: match.visaRequired ?? true,
                status: match.status || "visa-required",
                description: match.description || "",
                documents: match.documents || [],
                nextSteps: match.nextSteps || [],
                ...match,
            };
        }

        return {
            country: to,
            countryCode: to,
            visaRequired: true,
            visaType: "visa-required",
            status: "visa-required",
            description:
                "Please check with the embassy for specific visa requirements.",
            documents: ["Valid passport"],
            nextSteps: ["Contact embassy for details"],
            notes:
                "Visa requirements may vary based on nationality and travel purpose.",
        };
    }

    async getBulkVisaRequirements(from, destinations) {
        return Promise.all(
            destinations.map((dest) => this.getVisaRequirement(from, dest))
        );
    }

    async getVisaMap(_passportCode) {
        return [];
    }

    async getPassportList() {
        return [];
    }

    async getDestinationList() {
        return [];
    }
}
