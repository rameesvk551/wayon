export default function ItineraryEditorSkeleton() {
    return (
        <div className="ie-skeleton">
            <div className="ie-skeleton__header">
                <div className="ie-skeleton__bar ie-skeleton__bar--lg" />
                <div className="ie-skeleton__bar ie-skeleton__bar--sm" />
            </div>
            <div className="ie-skeleton__board">
                {[1, 2, 3].map(col => (
                    <div key={col} className="ie-skeleton__col">
                        <div className="ie-skeleton__col-header">
                            <div className="ie-skeleton__bar ie-skeleton__bar--md" />
                        </div>
                        {[1, 2, 3, 4].map(card => (
                            <div key={card} className="ie-skeleton__card">
                                <div className="ie-skeleton__bar ie-skeleton__bar--full" />
                                <div className="ie-skeleton__bar ie-skeleton__bar--half" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
