import { useItineraryEditorStore } from '../../store/useItineraryEditorStore';
import { useEffect } from 'react';

export default function VersionHistoryDrawer() {
    const {
        isVersionDrawerOpen,
        setVersionDrawerOpen,
        versions,
        loadVersions,
        restoreVersion,
        isLoading
    } = useItineraryEditorStore();

    useEffect(() => {
        if (isVersionDrawerOpen) loadVersions();
    }, [isVersionDrawerOpen]);

    if (!isVersionDrawerOpen) return null;

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleString('en-US', {
                month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        } catch { return dateStr; }
    };

    const getChangedByIcon = (by: string) => {
        if (by === 'ai') return '🤖';
        if (by === 'system') return '⚙️';
        return '👤';
    };

    return (
        <>
            <div className="ie-drawer-overlay" onClick={() => setVersionDrawerOpen(false)} />
            <div className="ie-drawer">
                <div className="ie-drawer__header">
                    <h3 className="ie-drawer__title">Version History</h3>
                    <button
                        className="ie-drawer__close"
                        onClick={() => setVersionDrawerOpen(false)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="ie-drawer__list">
                    {versions.length === 0 ? (
                        <div className="ie-drawer__empty">
                            <p>No versions yet</p>
                        </div>
                    ) : (
                        versions.map((v) => (
                            <div key={v._id} className="ie-drawer__item">
                                <div className="ie-drawer__item-info">
                                    <span className="ie-drawer__item-icon">{getChangedByIcon(v.changedBy)}</span>
                                    <div>
                                        <p className="ie-drawer__item-desc">{v.changeDescription}</p>
                                        <p className="ie-drawer__item-meta">
                                            v{v.version} · {formatDate(v.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="ie-drawer__restore-btn"
                                    onClick={() => restoreVersion(v.version)}
                                    disabled={isLoading}
                                >
                                    Restore
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
