import { useItineraryEditorStore } from '../../store/useItineraryEditorStore';

export default function ReOptimizeButton() {
    const { recalculate, isRecalculating } = useItineraryEditorStore();

    return (
        <button
            className={`ie-reoptimize ${isRecalculating ? 'ie-reoptimize--loading' : ''}`}
            onClick={recalculate}
            disabled={isRecalculating}
            aria-label="Re-optimize itinerary"
        >
            <span className={`ie-reoptimize__icon ${isRecalculating ? 'ie-reoptimize__icon--spin' : ''}`}>
                ✨
            </span>
            <span className="ie-reoptimize__text">
                {isRecalculating ? 'Optimizing...' : 'Re-optimize with AI'}
            </span>
        </button>
    );
}
