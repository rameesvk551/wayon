import { useState } from 'react';
import { useItineraryEditorStore } from '../../store/useItineraryEditorStore';
import type { ItemCategory } from '../../types/itinerary-editor';
import { CATEGORY_ICONS } from '../../types/itinerary-editor';
import type { AttractionItem, UIResponse } from '../../types/ui-schema';

const CATEGORIES: ItemCategory[] = [
    'sightseeing', 'food', 'adventure', 'culture',
    'relaxation', 'shopping', 'nightlife', 'nature',
    'historical', 'general',
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4333';

type StreamFinalPayload = {
    ui?: UIResponse;
    uiBlocks?: UIResponse;
};

const CATEGORY_MAP: Record<string, ItemCategory> = {
    sightseeing: 'sightseeing',
    food: 'food',
    restaurant: 'food',
    dining: 'food',
    adventure: 'adventure',
    culture: 'culture',
    cultural: 'culture',
    relaxation: 'relaxation',
    shopping: 'shopping',
    nightlife: 'nightlife',
    nature: 'nature',
    historical: 'historical',
    history: 'historical',
    general: 'general',
};

const toEditorCategory = (value?: string): ItemCategory => {
    const key = (value || 'general').trim().toLowerCase();
    return CATEGORY_MAP[key] || 'general';
};

const parseAttractions = (payload: StreamFinalPayload): AttractionItem[] => {
    const ui = payload.ui || payload.uiBlocks;
    const blocks = ui?.blocks || [];
    for (const block of blocks) {
        if (block.type === 'attraction_carousel' && Array.isArray(block.attractions)) {
            return block.attractions;
        }
    }
    return [];
};

const fetchAttractionsFromService = async (destination: string, query: string): Promise<AttractionItem[]> => {
    const prompt = [
        `Find top attractions and places to visit in ${destination}.`,
        query ? `Focus on this request: ${query}.` : '',
        'Return attraction options only.',
    ]
        .filter(Boolean)
        .join(' ');

    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch attraction suggestions');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalPayload: StreamFinalPayload | null = null;

    const processChunk = (chunk: string) => {
        const lines = chunk.split('\n');
        let event = 'message';
        const dataLines: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('event:')) {
                event = trimmed.replace('event:', '').trim();
                continue;
            }
            if (trimmed.startsWith('data:')) {
                dataLines.push(trimmed.replace('data:', '').trim());
            }
        }

        if (event !== 'final' || dataLines.length === 0) return;
        try {
            finalPayload = JSON.parse(dataLines.join('\n')) as StreamFinalPayload;
        } catch {
            finalPayload = null;
        }
    };

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop() || '';
        for (const part of parts) {
            if (!part.trim()) continue;
            processChunk(part);
        }
    }

    if (buffer.trim()) {
        processChunk(buffer);
    }

    if (!finalPayload) {
        return [];
    }

    return parseAttractions(finalPayload);
};

export default function AddPlaceModal() {
    const { addPlaceModal, setAddPlaceModal, addItem, trip } = useItineraryEditorStore();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<ItemCategory>('sightseeing');
    const [startTime, setStartTime] = useState('10:00');
    const [duration, setDuration] = useState(60);
    const [description, setDescription] = useState('');
    const [lat, setLat] = useState<number | undefined>(undefined);
    const [lng, setLng] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<AttractionItem[]>([]);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!addPlaceModal.isOpen || !addPlaceModal.dayNumber) return null;

    const handleAttractionSearch = async () => {
        if (!trip?.destination) {
            setSearchError('Destination not found for this trip.');
            return;
        }
        setSearchLoading(true);
        setSearchError(null);
        try {
            const results = await fetchAttractionsFromService(trip.destination, searchQuery.trim());
            setSearchResults(results);
            if (results.length === 0) {
                setSearchError('No attraction results found. Try another keyword.');
            }
        } catch (err) {
            console.error('Attraction search failed:', err);
            setSearchError('Failed to fetch attractions. Check server connection and try again.');
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handlePickAttraction = (attraction: AttractionItem) => {
        setName(attraction.name || '');
        setDescription(attraction.description || '');
        setCategory(toEditorCategory(attraction.category));
        setLat(Number.isFinite(attraction.lat) ? attraction.lat : undefined);
        setLng(Number.isFinite(attraction.lng) ? attraction.lng : undefined);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        await addItem({
            dayNumber: addPlaceModal.dayNumber!,
            name: name.trim(),
            category,
            startTime,
            duration,
            description: description.trim(),
            lat,
            lng,
        });
        setIsSubmitting(false);

        // Reset form
        setName('');
        setDescription('');
        setCategory('sightseeing');
        setStartTime('10:00');
        setDuration(60);
        setLat(undefined);
        setLng(undefined);
        setSearchQuery('');
        setSearchResults([]);
        setSearchError(null);
    };

    const handleClose = () => {
        setAddPlaceModal({ isOpen: false, dayNumber: null });
    };

    return (
        <div className="ie-modal-overlay" onClick={handleClose}>
            <div className="ie-modal" onClick={e => e.stopPropagation()}>
                <div className="ie-modal__header">
                    <h3 className="ie-modal__title">
                        Add Place to Day {addPlaceModal.dayNumber}
                    </h3>
                    <button className="ie-modal__close" onClick={handleClose} aria-label="Close">×</button>
                </div>

                <form className="ie-modal__form" onSubmit={handleSubmit}>
                    {/* Search from attraction service */}
                    <div className="ie-modal__field">
                        <label className="ie-modal__label">Search from attraction service</label>
                        <div className="ie-modal__row">
                            <input
                                className="ie-modal__input"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={trip?.destination ? `e.g., museums in ${trip.destination}` : 'Search attractions'}
                            />
                            <button
                                type="button"
                                className="ie-modal__btn ie-modal__btn--secondary"
                                onClick={handleAttractionSearch}
                                disabled={searchLoading}
                            >
                                {searchLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        {searchError && <p className="ie-modal__hint ie-modal__hint--error">{searchError}</p>}
                        {searchResults.length > 0 && (
                            <div className="ie-modal__results">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        type="button"
                                        className="ie-modal__result-item"
                                        onClick={() => handlePickAttraction(result)}
                                    >
                                        <span className="ie-modal__result-title">{result.name}</span>
                                        <span className="ie-modal__result-meta">
                                            {(result.category || 'general').toLowerCase()} • {Number(result.rating || 0).toFixed(1)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <div className="ie-modal__field">
                        <label className="ie-modal__label">Place Name *</label>
                        <input
                            className="ie-modal__input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., Eiffel Tower"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="ie-modal__field">
                        <label className="ie-modal__label">Category</label>
                        <div className="ie-modal__category-grid">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`ie-modal__category-chip ${category === cat ? 'ie-modal__category-chip--active' : ''}`}
                                    onClick={() => setCategory(cat)}
                                >
                                    {CATEGORY_ICONS[cat]} {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time & Duration */}
                    <div className="ie-modal__row">
                        <div className="ie-modal__field ie-modal__field--half">
                            <label className="ie-modal__label">Start Time</label>
                            <input
                                type="time"
                                className="ie-modal__input"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="ie-modal__field ie-modal__field--half">
                            <label className="ie-modal__label">Duration</label>
                            <select
                                className="ie-modal__input"
                                value={duration}
                                onChange={e => setDuration(Number(e.target.value))}
                            >
                                <option value={30}>30 min</option>
                                <option value={45}>45 min</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1.5 hours</option>
                                <option value={120}>2 hours</option>
                                <option value={180}>3 hours</option>
                                <option value={240}>4 hours</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="ie-modal__field">
                        <label className="ie-modal__label">Description (optional)</label>
                        <textarea
                            className="ie-modal__textarea"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Notes about this place..."
                            rows={2}
                        />
                    </div>

                    {(lat !== undefined && lng !== undefined) && (
                        <div className="ie-modal__field">
                            <label className="ie-modal__label">Coordinates</label>
                            <p className="ie-modal__hint">
                                {lat.toFixed(5)}, {lng.toFixed(5)}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="ie-modal__actions">
                        <button
                            type="button"
                            className="ie-modal__btn ie-modal__btn--secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ie-modal__btn ie-modal__btn--primary"
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Place'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
