import { useItineraryEditorStore } from '../../store/useItineraryEditorStore';

export default function AutosaveIndicator() {
    const { saveStatus } = useItineraryEditorStore();

    if (saveStatus === 'idle') return null;

    const config = {
        saving: { icon: '⏳', text: 'Saving...', className: 'ie-autosave--saving' },
        saved: { icon: '✓', text: 'All changes saved', className: 'ie-autosave--saved' },
        error: { icon: '⚠', text: 'Save failed', className: 'ie-autosave--error' },
    };

    const current = config[saveStatus as keyof typeof config];
    if (!current) return null;

    return (
        <div className={`ie-autosave ${current.className}`}>
            <span className="ie-autosave__icon">{current.icon}</span>
            <span className="ie-autosave__text">{current.text}</span>
        </div>
    );
}
