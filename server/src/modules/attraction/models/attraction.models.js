/**
 * @typedef {Object} GeoPoint
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} AttractionSource
 * @property {string} provider
 * @property {string} externalId
 * @property {string} [sourceUrl]
 * @property {Record<string, unknown>} [payload]
 * @property {string} lastSyncedAt
 */

/**
 * @typedef {Object} Attraction
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {GeoPoint} location
 * @property {string} address
 * @property {string} [city]
 * @property {string} [country]
 * @property {number} [rating]
 * @property {number} [userRatingsTotal]
 * @property {string[]} photos
 * @property {string[]} types
 * @property {string} category
 * @property {boolean} [openNow]
 * @property {number} [priceLevel]
 * @property {AttractionSource[]} sources
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AttractionQuery
 * @property {string} [city]
 * @property {string} [country]
 * @property {string[]} [types]
 * @property {number} limit
 */

/**
 * @typedef {Object} ProviderAttraction
 * @property {string} provider
 * @property {string} externalId
 * @property {string} name
 * @property {string} [description]
 * @property {GeoPoint} location
 * @property {string} address
 * @property {string} [city]
 * @property {string} [country]
 * @property {number} [rating]
 * @property {number} [userRatingsTotal]
 * @property {string[]} photos
 * @property {string[]} types
 * @property {string} category
 * @property {boolean} [openNow]
 * @property {number} [priceLevel]
 * @property {string} [sourceUrl]
 * @property {Record<string, unknown>} [payload]
 */

/**
 * @typedef {Object} AttractionView
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {GeoPoint} location
 * @property {string} address
 * @property {string} [city]
 * @property {string} [country]
 * @property {number} [rating]
 * @property {number} [userRatingsTotal]
 * @property {string[]} photos
 * @property {string[]} types
 * @property {string} category
 * @property {boolean} [openNow]
 * @property {number} [priceLevel]
 * @property {Array<{provider: string, externalId: string, sourceUrl?: string, lastSyncedAt: string}>} sources
 */

/**
 * @typedef {Object} SearchAttractionsOutput
 * @property {boolean} success
 * @property {AttractionView[]} attractions
 * @property {number} count
 * @property {string} source
 * @property {string} searchedAt
 */

/**
 * @typedef {Object} GetAttractionByIdOutput
 * @property {boolean} success
 * @property {AttractionView | null} attraction
 * @property {string} source
 * @property {string} fetchedAt
 */

export const ATTRACTION_CATEGORIES = [
    'landmark',
    'museum',
    'park',
    'nature',
    'religious',
    'entertainment',
    'culture',
    'education',
    'shopping',
    'dining',
    'beach',
    'outdoor',
    'attraction'
];

/**
 * @param {Attraction} attraction
 * @returns {AttractionView}
 */
export function mapAttractionToView(attraction) {
    return {
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        location: attraction.location,
        address: attraction.address,
        city: attraction.city,
        country: attraction.country,
        rating: attraction.rating,
        userRatingsTotal: attraction.userRatingsTotal,
        photos: attraction.photos,
        types: attraction.types,
        category: attraction.category,
        openNow: attraction.openNow,
        priceLevel: attraction.priceLevel,
        sources: attraction.sources.map((s) => ({
            provider: s.provider,
            externalId: s.externalId,
            sourceUrl: s.sourceUrl,
            lastSyncedAt: s.lastSyncedAt,
        })),
    };
}
