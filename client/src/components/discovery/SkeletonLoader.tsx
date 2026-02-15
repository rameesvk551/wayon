const SkeletonCard: React.FC = () => (
    <div className="skeleton-card">
        <div className="skeleton-card__img shimmer" />
        <div className="skeleton-card__body">
            <div className="shimmer" style={{ width: '70%', height: 16, borderRadius: 8 }} />
            <div className="shimmer" style={{ width: '40%', height: 12, borderRadius: 6, marginTop: 8 }} />
            <div className="shimmer" style={{ width: '90%', height: 12, borderRadius: 6, marginTop: 8 }} />
            <div className="shimmer" style={{ width: '60%', height: 12, borderRadius: 6, marginTop: 4 }} />
        </div>
    </div>
);

const SkeletonDestination: React.FC = () => (
    <div className="skeleton-dest shimmer" />
);

export const SkeletonAttractionList: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <div className="skeleton-list">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

export const SkeletonDestinationRow: React.FC<{ count?: number }> = ({ count = 4 }) => (
    <div className="skeleton-dest-row">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonDestination key={i} />
        ))}
    </div>
);

export default SkeletonCard;
