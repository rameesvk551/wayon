/**
 * Visa Service — consolidates all use cases into a single service.
 * Wraps the repository and adds response shaping.
 */
export class VisaService {
    #repository;

    /**
     * @param {import('../repository/visa.repository.js').CachedVisaRepository |
     *         import('../repository/inmemory.repository.js').InMemoryVisaRepository} repository
     */
    constructor(repository) {
        this.#repository = repository;
    }

    /**
     * Get visa requirement for a single passport → destination pair.
     * @param {string} from
     * @param {string} to
     */
    async getVisaRequirement(from, to) {
        const requirement = await this.#repository.getVisaRequirement(from, to);
        return {
            fromCountry: from,
            toCountry: to,
            visaRequirement: requirement,
            lastUpdated: new Date().toISOString(),
        };
    }

    /**
     * Get visa requirements for multiple destinations.
     * @param {string} from
     * @param {string[]} destinations
     */
    async getBulkVisaRequirements(from, destinations) {
        const requirements = await this.#repository.getBulkVisaRequirements(
            from,
            destinations
        );

        const results = requirements.map((req, index) => ({
            fromCountry: from,
            toCountry: destinations[index],
            visaRequirement: req,
            lastUpdated: new Date().toISOString(),
        }));

        return { from, destinations, results };
    }

    /**
     * Get visa map — all destinations for a passport.
     * @param {string} passport
     */
    async getVisaMap(passport) {
        const results = await this.#repository.getVisaMap(passport);

        const stats = {
            visaFree: results.filter((r) => r.status === "visa-free").length,
            evisa: results.filter((r) => r.status === "evisa").length,
            visaOnArrival: results.filter((r) => r.status === "visa-on-arrival")
                .length,
            visaRequired: results.filter((r) => r.status === "visa-required").length,
        };

        return {
            passport: passport.toUpperCase(),
            results,
            total: results.length,
            stats,
        };
    }

    /** List all passport countries. */
    async getPassports() {
        const passports = await this.#repository.getPassportList();
        return { passports, total: passports.length };
    }

    /** List all destination countries. */
    async getDestinations() {
        const destinations = await this.#repository.getDestinationList();
        return { destinations, total: destinations.length };
    }
}
