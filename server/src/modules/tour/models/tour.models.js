/**
 * @typedef {Object} TourItineraryDay
 * @property {number} day
 * @property {string} title
 * @property {string} description
 * @property {string[]} activities
 */

/**
 * @typedef {Object} TourReview
 * @property {string} id
 * @property {string} userName
 * @property {string} avatar
 * @property {number} rating
 * @property {string} date
 * @property {string} comment
 * @property {number} helpful
 */

/**
 * @typedef {Object} TourFAQ
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef {'Adventure' | 'Cultural' | 'Nature' | 'City Tours'} TourCategory
 */

/**
 * @typedef {Object} Tour
 * @property {string} id
 * @property {string} name
 * @property {string[]} images
 * @property {string} description
 * @property {string} shortDescription
 * @property {string} location
 * @property {string} country
 * @property {{lat: number, lng: number}} coordinates
 * @property {string} duration
 * @property {number} durationDays
 * @property {number} price
 * @property {number} [originalPrice]
 * @property {string} currency
 * @property {TourCategory} category
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string} groupSize
 * @property {number} maxGroupSize
 * @property {string[]} language
 * @property {string[]} badges
 * @property {boolean} isAIRecommended
 * @property {string[]} highlights
 * @property {TourItineraryDay[]} itinerary
 * @property {string[]} included
 * @property {string[]} excluded
 * @property {TourFAQ[]} faq
 * @property {TourReview[]} reviews
 * @property {string[]} availableDates
 * @property {string} meetingPoint
 * @property {'Easy' | 'Moderate' | 'Challenging'} difficultyLevel
 * @property {string} provider
 * @property {string} [bookingUrl]
 */

/**
 * @typedef {Object} TourSearchQuery
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} [radius]      - km, default 20
 * @property {string} [category]
 * @property {string} [keyword]
 * @property {number} [limit]
 */
