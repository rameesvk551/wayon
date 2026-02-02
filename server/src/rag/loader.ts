/**
 * RAG Document Loader
 * Loads and chunks travel regulation documents for retrieval
 */

export interface Document {
    id: string;
    content: string;
    metadata: {
        source: string;
        category: 'visa' | 'entry' | 'advisory' | 'passport';
        country?: string;
        lastUpdated?: string;
    };
}

/**
 * Sample travel regulation documents
 * In production, these would be loaded from a database or files
 */
export const TRAVEL_REGULATIONS: Document[] = [
    {
        id: 'visa-thailand-india',
        content: `Thailand Visa Requirements for Indian Passport Holders:
    
Visa on Arrival (VOA):
- Available for Indian citizens
- Duration: 15 days (non-extendable)
- Cost: 2,000 THB at the airport
- Requirements: Passport valid 6+ months, return ticket within 15 days, proof of accommodation, 10,000 THB cash per person

Note: Wait times can be 1-2 hours during peak season. Consider pre-approved e-Visa for faster entry.

Embassy Visa (30-60 days):
- Apply at Thai Embassy/Consulate in India
- Processing time: 3-5 working days
- Documents: Application form, photos, passport, bank statement, flight bookings

Important: Always carry printed copies of all documents.`,
        metadata: {
            source: 'Thai Embassy India',
            category: 'visa',
            country: 'Thailand',
            lastUpdated: '2024-01-15',
        },
    },
    {
        id: 'entry-uae-india',
        content: `UAE Entry Requirements for Indian Passport Holders:

Visa Required: Yes
Types Available:
- 30-day Tourist Visa (single entry): ~$80
- 90-day Tourist Visa (multiple entry): ~$200
- Transit Visa (48/96 hours): ~$25

Requirements:
- Passport valid for 6+ months
- Colored passport photograph
- Return ticket
- Hotel booking confirmation
- Travel insurance recommended

E-Visa Process:
- Apply online through ICP Smart Services
- Processing: 3-5 business days
- Visa is emailed as PDF

Note: Visa on arrival is NOT available for Indian passport holders.`,
        metadata: {
            source: 'UAE Immigration',
            category: 'visa',
            country: 'UAE',
            lastUpdated: '2024-01-10',
        },
    },
    {
        id: 'passport-validity-general',
        content: `General Passport Validity Requirements:

Most countries require:
- Passport valid for at least 6 months beyond travel dates
- At least 2 blank pages for entry stamps

Countries with 3-month validity requirement:
- United States
- Canada
- United Kingdom

Countries with strict 6-month requirement:
- Singapore
- Thailand
- Malaysia
- Indonesia
- UAE
- Saudi Arabia
- China

Tip: Always check specific country requirements before booking travel.
Machine-readable passports (MRP) are now mandatory for international travel.`,
        metadata: {
            source: 'International Travel Guidelines',
            category: 'passport',
            lastUpdated: '2024-01-01',
        },
    },
    {
        id: 'advisory-general',
        content: `General Travel Advisories:

Travel Insurance:
- Always recommended for international travel
- Should cover medical emergencies, trip cancellation, lost luggage
- Some countries require proof of insurance for visa

Health Requirements:
- Check if destination requires vaccination certificates
- Yellow fever certificate required for some African countries
- COVID-19 requirements vary by country (check current status)

Registration:
- Register with your country's embassy abroad
- Provides assistance during emergencies
- Usually free of charge

Emergency Contacts:
- Note down embassy contact numbers
- Keep copies of important documents
- Share itinerary with family/friends`,
        metadata: {
            source: 'General Travel Advisory',
            category: 'advisory',
            lastUpdated: '2024-01-05',
        },
    },
    {
        id: 'visa-japan-india',
        content: `Japan Visa Requirements for Indian Passport Holders:

Tourist Visa Required: Yes
Type: Short-term stay visa (up to 90 days)

Application Process:
- Apply at Japanese Embassy/Consulate in India
- In-person submission required
- Processing time: 5-7 working days

Required Documents:
- Valid passport (6+ months validity)
- Completed application form
- Photo (4.5 x 4.5 cm)
- Detailed daily itinerary
- Flight reservations
- Hotel bookings
- Bank statements (3 months)
- Income tax returns
- Employment letter

Visa Fee: ~2,000 INR (single entry)

Important: Japan has strict documentation requirements. Incomplete applications are rejected.`,
        metadata: {
            source: 'Japanese Embassy India',
            category: 'visa',
            country: 'Japan',
            lastUpdated: '2024-01-12',
        },
    },
    {
        id: 'visa-schengen-india',
        content: `Schengen Visa for Indian Passport Holders:

Schengen Area: 27 European countries with unified visa policy

Visa Type: Short-stay visa (Type C) - up to 90 days in 180-day period

Application:
- Apply at embassy of main destination country
- Or country of first entry if equal time spent
- Book appointment (can take 2-4 weeks)

Required Documents:
- Passport valid 3+ months after departure
- 2 recent passport photos
- Completed application form
- Travel insurance (minimum €30,000 coverage)
- Flight reservations
- Accommodation proof
- Bank statements (3-6 months)
- Employment proof
- Cover letter with travel purpose

Visa Fee: €80 (adults)

Processing Time: 15-45 days

Popular Schengen countries: France, Germany, Italy, Spain, Netherlands, Switzerland`,
        metadata: {
            source: 'Schengen Visa Info',
            category: 'visa',
            country: 'Schengen',
            lastUpdated: '2024-01-08',
        },
    },
];

/**
 * Load documents (in production, would load from files/database)
 */
export function loadDocuments(): Document[] {
    return TRAVEL_REGULATIONS;
}

/**
 * Chunk documents for embedding (simple chunking)
 */
export function chunkDocuments(
    documents: Document[],
    chunkSize: number = 500
): Array<{ id: string; text: string; metadata: Document['metadata'] }> {
    const chunks: Array<{ id: string; text: string; metadata: Document['metadata'] }> = [];

    for (const doc of documents) {
        const words = doc.content.split(/\s+/);
        let currentChunk: string[] = [];
        let chunkIndex = 0;

        for (const word of words) {
            currentChunk.push(word);

            if (currentChunk.length >= chunkSize) {
                chunks.push({
                    id: `${doc.id}-chunk-${chunkIndex}`,
                    text: currentChunk.join(' '),
                    metadata: doc.metadata,
                });
                currentChunk = [];
                chunkIndex++;
            }
        }

        // Push remaining words
        if (currentChunk.length > 0) {
            chunks.push({
                id: `${doc.id}-chunk-${chunkIndex}`,
                text: currentChunk.join(' '),
                metadata: doc.metadata,
            });
        }
    }

    return chunks;
}
