/**
 * @typedef {Object} Hotel
 * @property {string} id
 * @property {string} name
 * @property {number} lat
 * @property {number} lng
 * @property {number} price
 * @property {string} currency
 * @property {number} [rating]
 * @property {string} provider
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [country]
 * @property {string[]} [amenities]
 * @property {string[]} [images]
 * @property {string} [url]
 * @property {string} [description]
 * @property {number} [reviewCount]
 * @property {number} [originalPrice]
 * @property {string[]} [badges]
 * @property {string} [landmark]
 * @property {string} [distance]
 * @property {number} [stars]
 */

/**
 * @typedef {Object} HotelSearchQuery
 * @property {string} location
 * @property {string} checkin
 * @property {string} checkout
 * @property {number} guests
 * @property {number} [cursor]
 * @property {number} [limit]
 */

/**
 * @typedef {Object} PaginatedHotelResponse
 * @property {Hotel[]} hotels
 * @property {number} cursor
 * @property {boolean} hasMore
 * @property {number} total
 */
