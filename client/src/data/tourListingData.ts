// ===== TOUR LISTING MOCK DATA =====

export interface TourItineraryDay {
    day: number;
    title: string;
    description: string;
    activities: string[];
}

export interface TourReview {
    id: string;
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
}

export interface TourFAQ {
    question: string;
    answer: string;
}

export interface TourListingItem {
    id: string;
    name: string;
    images: string[];
    description: string;
    shortDescription: string;
    location: string;
    country: string;
    coordinates: { lat: number; lng: number };
    duration: string;
    durationDays: number;
    price: number;
    originalPrice?: number;
    currency: string;
    category: TourCategory;
    rating: number;
    reviewCount: number;
    groupSize: string;
    maxGroupSize: number;
    language: string[];
    badges: string[];
    isAIRecommended: boolean;
    highlights: string[];
    itinerary: TourItineraryDay[];
    included: string[];
    excluded: string[];
    faq: TourFAQ[];
    reviews: TourReview[];
    availableDates: string[];
    meetingPoint: string;
    difficultyLevel: 'Easy' | 'Moderate' | 'Challenging';
}

export type TourCategory = 'Adventure' | 'Cultural' | 'Nature' | 'City Tours';
export type TourSortOption = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'popularity' | 'duration';

export const tourCategories: TourCategory[] = ['Adventure', 'Cultural', 'Nature', 'City Tours'];

export const tourLanguages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin', 'Arabic', 'Portuguese'];

export const tourSortOptions: { value: TourSortOption; label: string }[] = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'duration', label: 'Shortest First' },
];

export const tourDestinations = [
    { id: 'td1', name: 'Bali, Indonesia', subtitle: '4 tours', icon: '🏝️' },
    { id: 'td2', name: 'Kyoto, Japan', subtitle: '2 tours', icon: '⛩️' },
    { id: 'td3', name: 'Patagonia, Argentina', subtitle: '1 tour', icon: '🏔️' },
    { id: 'td4', name: 'Paris, France', subtitle: '1 tour', icon: '🗼' },
    { id: 'td5', name: 'Serengeti, Tanzania', subtitle: '1 tour', icon: '🦁' },
    { id: 'td6', name: 'Iceland', subtitle: '1 tour', icon: '🌋' },
    { id: 'td7', name: 'Machu Picchu, Peru', subtitle: '1 tour', icon: '🏛️' },
    { id: 'td8', name: 'New York, USA', subtitle: '1 tour', icon: '🗽' },
];

const sharedReviews: TourReview[] = [
    {
        id: 'r1', userName: 'Sarah M.', avatar: '👩‍🦰', rating: 5,
        date: '2026-01-15', comment: 'Absolutely incredible experience! The guide was knowledgeable and the views were breathtaking. Would definitely recommend to anyone.', helpful: 24
    },
    {
        id: 'r2', userName: 'James K.', avatar: '👨', rating: 4,
        date: '2026-01-08', comment: 'Great tour overall. Well organized and the itinerary was packed with amazing activities. Only wish we had more free time.', helpful: 18
    },
    {
        id: 'r3', userName: 'Akiko T.', avatar: '👩', rating: 5,
        date: '2025-12-28', comment: 'Perfect in every way! The accommodation was top-notch and the cultural experiences were authentic and moving.', helpful: 31
    },
    {
        id: 'r4', userName: 'Carlos R.', avatar: '👨‍🦱', rating: 4,
        date: '2025-12-15', comment: 'Very enjoyable trip. Our guide spoke excellent English and made sure everyone felt included. The food was amazing!', helpful: 12
    },
];

const sharedFAQ: TourFAQ[] = [
    { question: 'What is the cancellation policy?', answer: 'Free cancellation up to 48 hours before the tour starts. After that, a 50% fee applies.' },
    { question: 'Is travel insurance included?', answer: 'Travel insurance is not included but strongly recommended. We can suggest trusted providers.' },
    { question: 'What should I bring?', answer: 'Comfortable walking shoes, weather-appropriate clothing, sunscreen, camera, and a reusable water bottle.' },
    { question: 'Are meals included?', answer: 'Meals specified in the itinerary are included. Other meals are at your own expense.' },
    { question: 'What is the fitness level required?', answer: 'The difficulty level is listed on each tour. Generally, moderate fitness is sufficient for most tours.' },
];

export const mockTours: TourListingItem[] = [
    {
        id: 'tour-1',
        name: 'Bali Sacred Temples & Rice Terraces',
        images: [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
            'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
            'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80',
        ],
        description: 'Embark on a transformative journey through Bali\'s most sacred temples and breathtaking rice terraces. Experience the spiritual essence of the Island of the Gods as you explore ancient Hindu temples, walk through emerald rice paddies, and witness traditional Balinese ceremonies. This immersive cultural tour takes you beyond the tourist trail into the heart of Balinese spirituality.',
        shortDescription: 'Explore ancient temples, lush rice terraces, and sacred Balinese traditions.',
        location: 'Ubud, Bali',
        country: 'Indonesia',
        coordinates: { lat: -8.5069, lng: 115.2624 },
        duration: '5 Days',
        durationDays: 5,
        price: 899,
        originalPrice: 1099,
        currency: '$',
        category: 'Cultural',
        rating: 4.9,
        reviewCount: 2847,
        groupSize: '4-12',
        maxGroupSize: 12,
        language: ['English', 'Japanese'],
        badges: ['Best Seller', 'Top Rated'],
        isAIRecommended: true,
        highlights: ['Visit Tirta Empul Holy Water Temple', 'Walk through Tegallalang Rice Terrace', 'Traditional cooking class', 'Sunrise at Mount Batur viewpoint', 'Balinese dance performance'],
        itinerary: [
            { day: 1, title: 'Arrival & Ubud Exploration', description: 'Welcome to Bali! Transfer to Ubud and explore the vibrant art market.', activities: ['Airport pickup', 'Ubud Art Market', 'Welcome dinner'] },
            { day: 2, title: 'Sacred Temples Tour', description: 'Visit the most important temples in Bali.', activities: ['Tirta Empul Temple', 'Gunung Kawi', 'Pura Saraswati', 'Traditional lunch'] },
            { day: 3, title: 'Rice Terraces & Cooking', description: 'Walk through stunning rice terraces and learn Balinese cooking.', activities: ['Tegallalang Rice Terrace', 'Coffee plantation visit', 'Cooking class', 'Spa treatment'] },
            { day: 4, title: 'Sunrise & Waterfalls', description: 'Early morning sunrise trek followed by hidden waterfall exploration.', activities: ['Mount Batur sunrise viewpoint', 'Tegenungan Waterfall', 'Kanto Lampo Waterfall'] },
            { day: 5, title: 'Farewell & Departure', description: 'Final morning to explore before departure.', activities: ['Monkey Forest visit', 'Souvenir shopping', 'Airport transfer'] },
        ],
        included: ['4 nights accommodation', 'Daily breakfast', 'All entrance fees', 'Professional English-speaking guide', 'Air-conditioned transport', 'Cooking class', 'Spa treatment'],
        excluded: ['International flights', 'Travel insurance', 'Personal expenses', 'Lunch & dinner (except Day 1)', 'Tips for guides'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-01', '2026-03-15', '2026-04-01', '2026-04-15', '2026-05-01'],
        meetingPoint: 'Ngurah Rai International Airport',
        difficultyLevel: 'Easy',
    },
    {
        id: 'tour-2',
        name: 'Patagonia Glacier Trek Adventure',
        images: [
            'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
            'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
        ],
        description: 'Challenge yourself with an unforgettable trek through Patagonia\'s most dramatic landscapes. Hike alongside massive glaciers, crystal-clear lakes, and towering granite peaks. This adventure tour takes you through Torres del Paine National Park, one of the most spectacular wilderness areas on Earth.',
        shortDescription: 'Trek through glaciers, turquoise lakes, and towering peaks in Patagonia.',
        location: 'Torres del Paine, Patagonia',
        country: 'Argentina',
        coordinates: { lat: -50.9423, lng: -73.4068 },
        duration: '8 Days',
        durationDays: 8,
        price: 2499,
        originalPrice: 2999,
        currency: '$',
        category: 'Adventure',
        rating: 4.8,
        reviewCount: 1523,
        groupSize: '6-10',
        maxGroupSize: 10,
        language: ['English', 'Spanish'],
        badges: ['Top Rated', 'Limited Spots'],
        isAIRecommended: true,
        highlights: ['W Trek through Torres del Paine', 'Perito Moreno Glacier visit', 'Grey Glacier kayaking', 'Condor watching', 'Chilean Patagonian cuisine'],
        itinerary: [
            { day: 1, title: 'Arrival in Punta Arenas', description: 'Arrive and transfer to Puerto Natales.', activities: ['Airport transfer', 'Gear check', 'Welcome briefing'] },
            { day: 2, title: 'Enter Torres del Paine', description: 'Begin the W Trek with views of Lake Nordenskjöld.', activities: ['Park entrance', 'Trek to Base Camp', 'Evening campfire'] },
            { day: 3, title: 'Torres Base Hike', description: 'Hike to the iconic Torres viewpoint.', activities: ['Torres sunrise hike', 'Glacial lake visit', 'Wildlife spotting'] },
            { day: 4, title: 'French Valley', description: 'Trek through the stunning French Valley.', activities: ['French Valley trek', 'Hanging glacier views', 'Mountain lunch'] },
            { day: 5, title: 'Grey Glacier', description: 'Reach the mighty Grey Glacier.', activities: ['Trek to Grey Glacier', 'Glacier viewing', 'Optional kayaking'] },
            { day: 6, title: 'Glacier Exploration', description: 'Full day exploring the glacier area.', activities: ['Ice hiking', 'Photography session', 'Lakeside camp'] },
            { day: 7, title: 'Exit Trek & Town', description: 'Complete the trek and return to town.', activities: ['Final trek segment', 'Celebration dinner', 'Rest day options'] },
            { day: 8, title: 'Departure', description: 'Transfer to airport for departure.', activities: ['Breakfast', 'Souvenir shopping', 'Airport transfer'] },
        ],
        included: ['7 nights accommodation (mix of refugios & hotels)', 'All meals during trek', 'Professional mountain guide', 'Park entrance fees', 'All ground transfers', 'Camping equipment', 'Emergency satellite phone'],
        excluded: ['International flights', 'Travel insurance (mandatory)', 'Alcoholic beverages', 'Optional kayaking ($85)', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-10', '2026-04-05', '2026-11-15', '2026-12-01'],
        meetingPoint: 'Punta Arenas Airport',
        difficultyLevel: 'Challenging',
    },
    {
        id: 'tour-3',
        name: 'Kyoto Traditional Arts & Gardens',
        images: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
            'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
        ],
        description: 'Immerse yourself in the timeless beauty of Kyoto, Japan\'s cultural capital. From ancient zen gardens to traditional tea ceremonies, geisha districts to bamboo groves, this tour reveals the soul of Japanese culture. Experience the perfect harmony of nature and artistry that has defined Kyoto for over a thousand years.',
        shortDescription: 'Discover Kyoto\'s zen gardens, tea ceremonies, and ancient traditions.',
        location: 'Kyoto',
        country: 'Japan',
        coordinates: { lat: 35.0116, lng: 135.7681 },
        duration: '4 Days',
        durationDays: 4,
        price: 1299,
        currency: '$',
        category: 'Cultural',
        rating: 4.9,
        reviewCount: 3210,
        groupSize: '2-8',
        maxGroupSize: 8,
        language: ['English', 'Japanese'],
        badges: ['Best Seller', 'Top Rated'],
        isAIRecommended: true,
        highlights: ['Private tea ceremony', 'Arashiyama Bamboo Grove', 'Fushimi Inari shrine at dawn', 'Zen garden meditation', 'Kimono experience'],
        itinerary: [
            { day: 1, title: 'Welcome to Kyoto', description: 'Arrive and explore Gion district.', activities: ['Hotel check-in', 'Gion walking tour', 'Kaiseki dinner'] },
            { day: 2, title: 'Temples & Gardens', description: 'Visit iconic temples and zen gardens.', activities: ['Kinkaku-ji Golden Pavilion', 'Ryoan-ji Zen Garden', 'Tea ceremony', 'Nishiki Market'] },
            { day: 3, title: 'Bamboo & Shrines', description: 'Explore natural beauty and ancient shrines.', activities: ['Fushimi Inari sunrise', 'Arashiyama Bamboo Grove', 'Kimono experience', 'Sagano scenic railway'] },
            { day: 4, title: 'Final Explorations', description: 'Last morning in Kyoto.', activities: ['Zen meditation session', 'Souvenir shopping', 'Departure transfer'] },
        ],
        included: ['3 nights ryokan/hotel', 'Daily breakfast', 'Tea ceremony', 'Kimono rental', 'English-speaking guide', 'All entrance fees', 'Kaiseki dinner'],
        excluded: ['Flights to/from Kyoto', 'Travel insurance', 'Lunches', 'Personal shopping', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-20', '2026-04-01', '2026-04-10', '2026-05-15', '2026-10-15'],
        meetingPoint: 'Kyoto Station',
        difficultyLevel: 'Easy',
    },
    {
        id: 'tour-4',
        name: 'Serengeti Wildlife Safari',
        images: [
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
            'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
            'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
        ],
        description: 'Witness the awe-inspiring wildlife of the Serengeti on this luxury safari adventure. Track the Big Five across endless golden plains, witness the Great Migration, and sleep under star-filled African skies. This tour combines thrilling game drives with luxury tented camp experiences for the ultimate safari.',
        shortDescription: 'Track the Big Five and witness the Great Migration on a luxury safari.',
        location: 'Serengeti National Park',
        country: 'Tanzania',
        coordinates: { lat: -2.3333, lng: 34.8333 },
        duration: '6 Days',
        durationDays: 6,
        price: 3899,
        originalPrice: 4499,
        currency: '$',
        category: 'Nature',
        rating: 4.9,
        reviewCount: 1890,
        groupSize: '4-8',
        maxGroupSize: 8,
        language: ['English'],
        badges: ['Premium', 'Top Rated'],
        isAIRecommended: true,
        highlights: ['Big Five game drives', 'Great Migration viewing', 'Hot air balloon safari', 'Maasai village visit', 'Luxury tented camps'],
        itinerary: [
            { day: 1, title: 'Arrival in Arusha', description: 'Arrive and prepare for safari.', activities: ['Airport transfer', 'Safari briefing', 'Equipment check'] },
            { day: 2, title: 'Enter the Serengeti', description: 'Drive into the vast Serengeti plains.', activities: ['Game drive en route', 'Picnic lunch', 'Afternoon game drive'] },
            { day: 3, title: 'Central Serengeti', description: 'Full day exploring the central plains.', activities: ['Dawn game drive', 'Big cat tracking', 'Sundowner drinks'] },
            { day: 4, title: 'Balloon Safari', description: 'Take to the skies over the Serengeti.', activities: ['Hot air balloon ride', 'Champagne breakfast', 'Afternoon game drive'] },
            { day: 5, title: 'Maasai & Migration', description: 'Cultural visit and migration search.', activities: ['Maasai village visit', 'Migration tracking', 'Farewell dinner'] },
            { day: 6, title: 'Departure', description: 'Final morning game drive and departure.', activities: ['Sunrise game drive', 'Bush breakfast', 'Airport transfer'] },
        ],
        included: ['5 nights luxury tented camp', 'All meals & drinks', 'Private 4x4 safari vehicle', 'Professional safari guide', 'Hot air balloon ride', 'All park fees', 'Maasai village visit', 'Airport transfers'],
        excluded: ['International flights', 'Travel insurance', 'Visa fees', 'Premium alcoholic beverages', 'Tips for staff'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-06-15', '2026-07-01', '2026-08-01', '2026-09-15'],
        meetingPoint: 'Kilimanjaro International Airport',
        difficultyLevel: 'Easy',
    },
    {
        id: 'tour-5',
        name: 'Iceland Northern Lights & Ice Caves',
        images: [
            'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&q=80',
            'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
            'https://images.unsplash.com/photo-1476610182048-b716b8515aaa?w=800&q=80',
        ],
        description: 'Chase the magical Northern Lights across Iceland\'s otherworldly landscapes. Explore crystal ice caves, bathe in natural hot springs, and walk between tectonic plates. This winter adventure combines Iceland\'s most spectacular natural phenomena with comfortable lodges and expert guides.',
        shortDescription: 'Chase aurora borealis, explore ice caves, and soak in hot springs.',
        location: 'Reykjavik & South Coast',
        country: 'Iceland',
        coordinates: { lat: 64.1466, lng: -21.9426 },
        duration: '5 Days',
        durationDays: 5,
        price: 1899,
        originalPrice: 2299,
        currency: '$',
        category: 'Adventure',
        rating: 4.7,
        reviewCount: 2105,
        groupSize: '6-14',
        maxGroupSize: 14,
        language: ['English'],
        badges: ['Seasonal', 'Popular'],
        isAIRecommended: false,
        highlights: ['Northern Lights hunting', 'Crystal ice cave exploration', 'Blue Lagoon soak', 'Golden Circle tour', 'Glacier hiking'],
        itinerary: [
            { day: 1, title: 'Reykjavik Arrival', description: 'Arrive and explore the vibrant capital.', activities: ['City walking tour', 'Hallgrímskirkja', 'Northern Lights hunt'] },
            { day: 2, title: 'Golden Circle', description: 'Visit Iceland\'s most famous landmarks.', activities: ['Þingvellir', 'Geysir', 'Gullfoss waterfall', 'Aurora hunt'] },
            { day: 3, title: 'South Coast', description: 'Explore waterfalls and black sand beaches.', activities: ['Seljalandsfoss', 'Skógafoss', 'Reynisfjara beach', 'Glacier viewpoints'] },
            { day: 4, title: 'Ice Cave & Glacier', description: 'Explore a crystal ice cave and glacier.', activities: ['Vatnajökull ice cave', 'Glacier walk', 'Jökulsárlón glacier lagoon', 'Diamond Beach'] },
            { day: 5, title: 'Blue Lagoon & Departure', description: 'Relax in geothermal waters before departure.', activities: ['Blue Lagoon', 'Souvenir shopping', 'Airport transfer'] },
        ],
        included: ['4 nights hotel/guesthouse', 'Daily breakfast', 'Ice cave tour', 'Glacier hiking gear', 'English-speaking guide', 'Super jeep transport', 'Blue Lagoon entry'],
        excluded: ['Flights', 'Travel insurance', 'Lunches & dinners', 'Personal expenses', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-11-01', '2026-11-15', '2026-12-01', '2027-01-15', '2027-02-01'],
        meetingPoint: 'Keflavík International Airport',
        difficultyLevel: 'Moderate',
    },
    {
        id: 'tour-6',
        name: 'Paris Art & Gastronomy Walk',
        images: [
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
            'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&q=80',
        ],
        description: 'Discover the artistic soul and culinary genius of Paris like a true Parisian. Stroll through world-class museums, hidden galleries, and charming neighborhoods while indulging in the finest French cuisine. From Montmartre studios to Michelin-starred tastings, this tour celebrates the best of la vie parisienne.',
        shortDescription: 'Discover world-class art, hidden galleries, and exquisite French cuisine.',
        location: 'Paris',
        country: 'France',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        duration: '3 Days',
        durationDays: 3,
        price: 1099,
        currency: '$',
        category: 'City Tours',
        rating: 4.6,
        reviewCount: 1456,
        groupSize: '4-10',
        maxGroupSize: 10,
        language: ['English', 'French'],
        badges: ['Popular'],
        isAIRecommended: false,
        highlights: ['Skip-the-line Louvre tour', 'Montmartre art walk', 'Cheese & wine tasting', 'Seine river cruise', 'Pastry making class'],
        itinerary: [
            { day: 1, title: 'Art Immersion', description: 'Dive into Paris\'s world-class art scene.', activities: ['Louvre skip-the-line', 'Montmartre walking tour', 'Artist studio visit', 'Welcome dinner'] },
            { day: 2, title: 'Culinary Paris', description: 'Taste your way through the city.', activities: ['Marché d\'Aligre', 'Pastry making class', 'Cheese & wine tasting', 'Seine cruise'] },
            { day: 3, title: 'Hidden Paris', description: 'Explore off-the-beaten-path neighborhoods.', activities: ['Le Marais walk', 'Secret passages tour', 'Final lunch', 'Departure'] },
        ],
        included: ['2 nights boutique hotel', 'Daily breakfast', 'Louvre tickets', 'Pastry class', 'Wine tasting', 'Seine cruise', 'Expert art guide'],
        excluded: ['Flights', 'Travel insurance', 'Dinners (except Day 1)', 'Personal shopping', 'Metro tickets'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-05', '2026-04-10', '2026-05-20', '2026-06-15', '2026-09-10'],
        meetingPoint: 'Charles de Gaulle Airport or Hotel Lobby',
        difficultyLevel: 'Easy',
    },
    {
        id: 'tour-7',
        name: 'Machu Picchu & Sacred Valley',
        images: [
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
            'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
            'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800&q=80',
        ],
        description: 'Journey to the heart of the ancient Inca Empire on this unforgettable trek to Machu Picchu. Follow the legendary Inca Trail through cloud forests, past ancient ruins, and up to the mystical citadel at sunrise. Combined with exploration of the Sacred Valley, this is Peru\'s ultimate adventure.',
        shortDescription: 'Trek the Inca Trail to the mystical citadel of Machu Picchu.',
        location: 'Cusco & Sacred Valley',
        country: 'Peru',
        coordinates: { lat: -13.1631, lng: -72.5450 },
        duration: '7 Days',
        durationDays: 7,
        price: 1799,
        originalPrice: 2199,
        currency: '$',
        category: 'Adventure',
        rating: 4.8,
        reviewCount: 2340,
        groupSize: '6-12',
        maxGroupSize: 12,
        language: ['English', 'Spanish'],
        badges: ['Best Seller', 'Top Rated'],
        isAIRecommended: true,
        highlights: ['Classic 4-day Inca Trail', 'Sunrise at Machu Picchu', 'Sacred Valley exploration', 'Cusco city tour', 'Traditional Pachamanca feast'],
        itinerary: [
            { day: 1, title: 'Arrive in Cusco', description: 'Acclimatize to the altitude.', activities: ['Airport transfer', 'City walking tour', 'San Pedro Market', 'Welcome dinner'] },
            { day: 2, title: 'Sacred Valley', description: 'Explore the Sacred Valley of the Incas.', activities: ['Pisac ruins', 'Ollantaytambo', 'Moray terraces', 'Salt mines'] },
            { day: 3, title: 'Inca Trail Day 1', description: 'Begin the legendary trek.', activities: ['Trek start at km 82', 'Patallacta ruins', 'Camp at Wayllabamba'] },
            { day: 4, title: 'Inca Trail Day 2', description: 'Cross the highest pass.', activities: ['Dead Woman\'s Pass (4,215m)', 'Cloud forest descent', 'Camp at Pacaymayo'] },
            { day: 5, title: 'Inca Trail Day 3', description: 'Trek through stunning ruins.', activities: ['Runkurakay ruins', 'Sayacmarca', 'Wiñay Wayna', 'Final camp'] },
            { day: 6, title: 'Machu Picchu', description: 'The grand reveal at sunrise.', activities: ['Sunrise at Sun Gate', 'Guided Machu Picchu tour', 'Free exploration', 'Train to Cusco'] },
            { day: 7, title: 'Departure', description: 'Final morning in Cusco.', activities: ['Free morning', 'Souvenir shopping', 'Airport transfer'] },
        ],
        included: ['6 nights accommodation', 'All meals on trek', 'Inca Trail permit', 'Professional guide & porters', 'Camping equipment', 'Train tickets', 'Entrance fees'],
        excluded: ['Flights', 'Travel insurance', 'Sleeping bag rental ($25)', 'Huayna Picchu ticket ($20)', 'Tips for porters'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-04-01', '2026-05-15', '2026-06-01', '2026-09-01', '2026-10-15'],
        meetingPoint: 'Alejandro Velasco Astete Airport, Cusco',
        difficultyLevel: 'Challenging',
    },
    {
        id: 'tour-8',
        name: 'New York City Highlights',
        images: [
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
            'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
            'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800&q=80',
        ],
        description: 'Experience the electrifying energy of New York City on this action-packed urban adventure. From the dazzling lights of Times Square to the serene paths of Central Park, iconic museums to hidden speakeasies, this tour captures the essence of the city that never sleeps.',
        shortDescription: 'Explore iconic landmarks, Broadway, Central Park, and NYC culture.',
        location: 'New York City',
        country: 'USA',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        duration: '3 Days',
        durationDays: 3,
        price: 799,
        originalPrice: 999,
        currency: '$',
        category: 'City Tours',
        rating: 4.5,
        reviewCount: 3450,
        groupSize: '6-16',
        maxGroupSize: 16,
        language: ['English', 'Spanish', 'Mandarin'],
        badges: ['Most Popular', 'Best Value'],
        isAIRecommended: false,
        highlights: ['Statue of Liberty & Ellis Island', 'Broadway show tickets', 'Central Park bike tour', 'Brooklyn Bridge walk', 'Rooftop bar experience'],
        itinerary: [
            { day: 1, title: 'Iconic Manhattan', description: 'Hit the biggest landmarks.', activities: ['Statue of Liberty ferry', 'Wall Street walk', 'Brooklyn Bridge', 'Times Square'] },
            { day: 2, title: 'Culture & Parks', description: 'Museums and green spaces.', activities: ['Met Museum tour', 'Central Park bike ride', 'Broadway show', 'Rooftop dinner'] },
            { day: 3, title: 'Boroughs & Bites', description: 'Explore beyond Manhattan.', activities: ['Williamsburg food tour', 'High Line walk', 'Chelsea Market', 'Departure'] },
        ],
        included: ['2 nights midtown hotel', 'Daily breakfast', 'Statue of Liberty tickets', 'Broadway tickets', 'Bike rental', 'Expert local guide', 'Metro pass'],
        excluded: ['Flights', 'Travel insurance', 'Lunches & dinners (except Day 2)', 'Personal shopping', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-01', '2026-04-15', '2026-05-01', '2026-06-15', '2026-09-01', '2026-10-15', '2026-12-15'],
        meetingPoint: 'JFK Airport or Hotel Lobby',
        difficultyLevel: 'Easy',
    },
    {
        id: 'tour-9',
        name: 'Bali Volcano & Waterfall Adventure',
        images: [
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
        ],
        description: 'Conquer Bali\'s mightiest volcano and discover hidden waterfalls on this thrilling adventure tour. Trek to the summit of Mount Batur for a spectacular sunrise, then explore secret jungle waterfalls and natural infinity pools. Perfect for active travelers seeking an adrenaline rush.',
        shortDescription: 'Summit Mount Batur at sunrise and explore hidden jungle waterfalls.',
        location: 'Kintamani, Bali',
        country: 'Indonesia',
        coordinates: { lat: -8.2400, lng: 115.3750 },
        duration: '3 Days',
        durationDays: 3,
        price: 549,
        originalPrice: 699,
        currency: '$',
        category: 'Adventure',
        rating: 4.6,
        reviewCount: 987,
        groupSize: '4-10',
        maxGroupSize: 10,
        language: ['English'],
        badges: ['Adventure Pick'],
        isAIRecommended: false,
        highlights: ['Mount Batur sunrise trek', 'Secret waterfall hike', 'Natural hot springs', 'White water rafting', 'Volcanic breakfast'],
        itinerary: [
            { day: 1, title: 'Arrival & Preparation', description: 'Check in and prep for adventure.', activities: ['Hotel check-in', 'Equipment fitting', 'Briefing', 'Early dinner'] },
            { day: 2, title: 'Volcano & Waterfalls', description: 'The big day - summit and splash!', activities: ['2am Mount Batur trek start', 'Sunrise summit breakfast', 'Hot springs soak', 'Waterfall trek'] },
            { day: 3, title: 'Rafting & Departure', description: 'Final adventure before heading home.', activities: ['White water rafting', 'Riverside lunch', 'Airport transfer'] },
        ],
        included: ['2 nights accommodation', 'All meals', 'Professional trekking guide', 'Rafting session', 'All equipment', 'Transport'],
        excluded: ['Flights', 'Travel insurance', 'Personal expenses', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-01', '2026-03-15', '2026-04-01', '2026-05-01', '2026-06-01'],
        meetingPoint: 'Ubud Hotel Pickup',
        difficultyLevel: 'Moderate',
    },
    {
        id: 'tour-10',
        name: 'Borneo Rainforest Expedition',
        images: [
            'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80',
            'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        ],
        description: 'Venture deep into the world\'s oldest rainforest on this nature expedition through Borneo. Encounter wild orangutans in their natural habitat, cruise through mangrove forests at night to spot pygmy elephants, and stay in remote jungle lodges. This is wildlife adventure at its most authentic.',
        shortDescription: 'Spot wild orangutans and explore the world\'s oldest rainforest.',
        location: 'Sabah, Borneo',
        country: 'Malaysia',
        coordinates: { lat: 5.9804, lng: 116.0735 },
        duration: '6 Days',
        durationDays: 6,
        price: 1649,
        currency: '$',
        category: 'Nature',
        rating: 4.7,
        reviewCount: 654,
        groupSize: '4-8',
        maxGroupSize: 8,
        language: ['English'],
        badges: ['Eco-Friendly', 'Unique'],
        isAIRecommended: true,
        highlights: ['Wild orangutan encounters', 'Kinabatangan River cruise', 'Pygmy elephant spotting', 'Canopy walkway', 'Firefly watching'],
        itinerary: [
            { day: 1, title: 'Arrival in Kota Kinabalu', description: 'Arrive and transfer to lodge.', activities: ['Airport pickup', 'City tour', 'Welcome dinner'] },
            { day: 2, title: 'Sepilok Orangutan Centre', description: 'Visit the famous rehabilitation centre.', activities: ['Orangutan feeding', 'Sun bear centre', 'Rainforest discovery walk'] },
            { day: 3, title: 'Kinabatangan River', description: 'Cruise the wildlife-rich river.', activities: ['Morning river cruise', 'Proboscis monkey spotting', 'Night safari'] },
            { day: 4, title: 'Deep Jungle', description: 'Trek into pristine primary forest.', activities: ['Jungle trek', 'Canopy walkway', 'Bird watching', 'Firefly cruise'] },
            { day: 5, title: 'Danum Valley', description: 'Explore one of the last pristine forests.', activities: ['Dawn nature walk', 'Swimming in river pools', 'Night walk'] },
            { day: 6, title: 'Departure', description: 'Final morning in the rainforest.', activities: ['Sunrise bird walk', 'Transfer to airport'] },
        ],
        included: ['5 nights eco-lodge', 'All meals', 'River cruises', 'Professional naturalist guide', 'All park fees', 'Internal transfers'],
        excluded: ['International flights', 'Travel insurance', 'Alcoholic drinks', 'Personal expenses', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-15', '2026-04-20', '2026-06-01', '2026-08-15', '2026-10-01'],
        meetingPoint: 'Kota Kinabalu International Airport',
        difficultyLevel: 'Moderate',
    },
    {
        id: 'tour-11',
        name: 'Bali Underwater Paradise Dive',
        images: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
            'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
        ],
        description: 'Explore Bali\'s spectacular underwater world on this diving adventure. From the famous USAT Liberty shipwreck to vibrant coral gardens teeming with tropical fish, manta ray encounters to serene seahorse dives. Suitable for certified divers and beginners alike with PADI courses available.',
        shortDescription: 'Dive shipwrecks, coral reefs, and swim with manta rays in Bali.',
        location: 'Tulamben & Nusa Penida, Bali',
        country: 'Indonesia',
        coordinates: { lat: -8.2775, lng: 115.5931 },
        duration: '4 Days',
        durationDays: 4,
        price: 749,
        currency: '$',
        category: 'Nature',
        rating: 4.8,
        reviewCount: 876,
        groupSize: '2-6',
        maxGroupSize: 6,
        language: ['English', 'French'],
        badges: ['Small Group'],
        isAIRecommended: false,
        highlights: ['USAT Liberty shipwreck dive', 'Manta ray snorkeling', 'Coral garden exploration', 'PADI option available', 'Underwater photography'],
        itinerary: [
            { day: 1, title: 'Arrival & Orientation', description: 'Arrive and do orientation dive.', activities: ['Equipment check', 'Pool session', 'Shore dive at Tulamben'] },
            { day: 2, title: 'Shipwreck & Coral', description: 'Dive the famous shipwreck.', activities: ['USAT Liberty wreck dive', 'Coral garden dive', 'Night dive option'] },
            { day: 3, title: 'Nusa Penida', description: 'Cross to Nusa Penida for mantas.', activities: ['Manta Point dive', 'Crystal Bay dive', 'Cliff-top sunset'] },
            { day: 4, title: 'Final Dive & Departure', description: 'One last dive before heading home.', activities: ['Sunrise dive', 'Photo review session', 'Transfer'] },
        ],
        included: ['3 nights accommodation', 'All meals', '6-8 dives', 'PADI certified instructor', 'All equipment', 'Boat transfers', 'UW photo guide'],
        excluded: ['Flights', 'Travel insurance', 'PADI certification fee', 'Personal expenses', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01', '2026-07-01', '2026-08-01'],
        meetingPoint: 'Ubud or Sanur Hotel Pickup',
        difficultyLevel: 'Moderate',
    },
    {
        id: 'tour-12',
        name: 'Kyoto Cherry Blossom Festival',
        images: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
            'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
            'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
        ],
        description: 'Experience the magical cherry blossom season in Kyoto, when the ancient capital transforms into a pink wonderland. This seasonal tour is perfectly timed for peak sakura, combining the best hanami spots with cultural experiences you won\'t find in any guidebook.',
        shortDescription: 'Experience peak sakura season in Japan\'s ancient cultural capital.',
        location: 'Kyoto',
        country: 'Japan',
        coordinates: { lat: 35.0294, lng: 135.7642 },
        duration: '5 Days',
        durationDays: 5,
        price: 1899,
        originalPrice: 2299,
        currency: '$',
        category: 'Cultural',
        rating: 4.9,
        reviewCount: 1245,
        groupSize: '4-10',
        maxGroupSize: 10,
        language: ['English', 'Japanese'],
        badges: ['Seasonal Special', 'Top Rated'],
        isAIRecommended: true,
        highlights: ['Peak cherry blossom viewing', 'Private tea ceremony under sakura', 'Philosopher\'s Path walk', 'Night illumination tours', 'Sake brewery visit'],
        itinerary: [
            { day: 1, title: 'Cherry Blossom Welcome', description: 'Arrive and immerse in sakura magic.', activities: ['Hotel check-in', 'Maruyama Park hanami', 'Night sakura at Kiyomizu-dera'] },
            { day: 2, title: 'Philosopher\'s Path', description: 'Walk the most famous sakura trail.', activities: ['Philosopher\'s Path', 'Nanzen-ji Temple', 'Tea ceremony under cherry trees', 'Sake tasting'] },
            { day: 3, title: 'Imperial Gardens', description: 'Explore royal cherry blossom gardens.', activities: ['Kyoto Imperial Palace', 'Nijo Castle', 'Arashiyama in bloom', 'Geisha district walk'] },
            { day: 4, title: 'Hidden Sakura Spots', description: 'Discover secret blossom locations.', activities: ['Daigo-ji Temple', 'Heian Shrine gardens', 'Sake brewery tour', 'Farewell kaiseki'] },
            { day: 5, title: 'Final Morning', description: 'Last cherry blossom viewing.', activities: ['Morning meditation', 'Final sakura walk', 'Departure transfer'] },
        ],
        included: ['4 nights luxury ryokan', 'Daily breakfast', 'Private tea ceremony', 'Sake brewery tour', 'All entrance fees', 'Expert cultural guide', 'Welcome & farewell dinners'],
        excluded: ['Flights', 'Travel insurance', 'Lunches', 'Personal shopping', 'Tips'],
        faq: sharedFAQ,
        reviews: sharedReviews,
        availableDates: ['2026-03-25', '2026-04-01', '2026-04-05', '2026-04-10'],
        meetingPoint: 'Kyoto Station',
        difficultyLevel: 'Easy',
    },
];
