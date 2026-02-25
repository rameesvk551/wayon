import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowDownAZ, TrendingUp, Grid3X3, List, Globe2, Loader2 } from 'lucide-react';
import CountryPicker from '../components/visa/CountryPicker';
import CountryCard from '../components/visa/CountryCard';
import CountryDetailModal from '../components/visa/CountryDetailModal';
import type { Country } from '../data/countries';
import { visaStatusConfig } from '../data/visaData';
import type { VisaInfo, VisaStatus } from '../data/visaData';
import { getCountryByCode, regions as allRegions } from '../data/countries';
import { getVisaMap } from '../api/visaApi';

type SortMode = 'alpha' | 'popular';
type ViewMode = 'list' | 'grid';

const visaTabOrder: VisaStatus[] = ['visa-free', 'evisa', 'visa-on-arrival', 'visa-required'];

const VisaExplorerPage: React.FC = () => {
    const [passport, setPassport] = useState<Country | null>(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<VisaStatus | 'all'>('all');
    const [activeRegion, setActiveRegion] = useState('All Regions');
    const [sortMode, setSortMode] = useState<SortMode>('alpha');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedVisa, setSelectedVisa] = useState<VisaInfo | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Live API state
    const [visaData, setVisaData] = useState<VisaInfo[]>([]);
    const [stats, setStats] = useState<{
        total: number;
        visaFree: number;
        evisa: number;
        visaOnArrival: number;
        visaRequired: number;
    } | null>(null);
    const [isLoadingMap, setIsLoadingMap] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    // Fetch visa map when passport is selected and dashboard shown
    useEffect(() => {
        if (!passport || !showDashboard) return;

        let cancelled = false;
        setIsLoadingMap(true);
        setMapError(null);

        getVisaMap(passport.code)
            .then(data => {
                if (cancelled) return;
                setVisaData(data.results);
                setStats({
                    total: data.total,
                    ...data.stats,
                });
            })
            .catch(err => {
                if (cancelled) return;
                setMapError(err?.message || 'Failed to load visa data');
                setVisaData([]);
                setStats(null);
            })
            .finally(() => {
                if (!cancelled) setIsLoadingMap(false);
            });

        return () => { cancelled = true; };
    }, [passport, showDashboard]);

    const filteredData = useMemo(() => {
        let data = visaData;

        // Filter by tab
        if (activeTab !== 'all') {
            data = data.filter(d => d.status === activeTab);
        }

        // Filter by region
        if (activeRegion !== 'All Regions') {
            data = data.filter(d => {
                const country = getCountryByCode(d.to);
                return country?.region === activeRegion;
            });
        }

        // Filter by search
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(d => {
                const country = getCountryByCode(d.to);
                return country?.name.toLowerCase().includes(q) || d.to.toLowerCase().includes(q);
            });
        }

        // Sort
        data = [...data].sort((a, b) => {
            const countryA = getCountryByCode(a.to);
            const countryB = getCountryByCode(b.to);
            if (!countryA || !countryB) return 0;
            if (sortMode === 'alpha') return countryA.name.localeCompare(countryB.name);
            return (countryB.popular ? 1 : 0) - (countryA.popular ? 1 : 0) || countryA.name.localeCompare(countryB.name);
        });

        return data;
    }, [visaData, activeTab, activeRegion, search, sortMode]);

    const handleExplore = () => {
        if (!passport) return;
        setShowDashboard(true);
    };

    const handleCountryClick = useCallback((visa: VisaInfo) => {
        setSelectedVisa(visa);
        setModalOpen(true);
    }, []);

    const handleChangePassport = () => {
        setShowDashboard(false);
        setActiveTab('all');
        setSearch('');
        setActiveRegion('All Regions');
        setVisaData([]);
        setStats(null);
    };

    if (!showDashboard) {
        return (
            <div className="visa-explorer-page">
                <motion.div
                    className="visa-explorer-entry"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="visa-explorer-hero">
                        <motion.div
                            className="visa-explorer-icon"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        >
                            🌍
                        </motion.div>
                        <h1 className="visa-explorer-title">Where Can I Go?</h1>
                        <p className="visa-explorer-subtitle">
                            Discover which countries welcome your passport — visa-free, eVisa, or on arrival.
                        </p>
                    </div>

                    <motion.div
                        className="visa-explorer-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <CountryPicker
                            label="Select your passport"
                            value={passport}
                            onChange={setPassport}
                            placeholder="Choose your nationality"
                        />

                        <motion.button
                            className="visa-check-btn"
                            onClick={handleExplore}
                            disabled={!passport}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                        >
                            <Globe2 size={18} />
                            Explore Destinations
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="visa-explorer-page">
            <motion.div
                className="visa-explorer-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Passport Header */}
                <div className="visa-explorer-passport-header">
                    <div className="visa-explorer-passport-info">
                        <span className="visa-explorer-passport-flag">{passport!.flag}</span>
                        <div>
                            <h2 className="visa-explorer-passport-name">{passport!.name} Passport</h2>
                            <span className="visa-explorer-passport-count">
                                {isLoadingMap ? 'Loading...' : `${stats?.total || 0} destinations available`}
                            </span>
                        </div>
                    </div>
                    <button className="visa-change-passport-btn" onClick={handleChangePassport} type="button">
                        Change
                    </button>
                </div>

                {/* Loading State */}
                {isLoadingMap && (
                    <motion.div
                        className="visa-explorer-loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px 20px',
                            gap: '16px',
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                            <Loader2 size={32} style={{ color: '#6366f1' }} />
                        </motion.div>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Fetching visa data for {passport!.name} passport...
                        </p>
                    </motion.div>
                )}

                {/* Error State */}
                {mapError && !isLoadingMap && (
                    <motion.div
                        className="visa-explorer-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ padding: '40px 20px', textAlign: 'center' }}
                    >
                        <span style={{ fontSize: '48px' }}>⚠️</span>
                        <p style={{ color: '#ef4444', marginTop: '12px' }}>{mapError}</p>
                        <button
                            className="visa-explorer-reset-btn"
                            onClick={() => {
                                setShowDashboard(false);
                                setTimeout(() => setShowDashboard(true), 100);
                            }}
                            type="button"
                            style={{ marginTop: '12px' }}
                        >
                            Retry
                        </button>
                    </motion.div>
                )}

                {/* Dashboard Content — only when loaded */}
                {!isLoadingMap && !mapError && (
                    <>
                        {/* Stats Bar */}
                        {stats && (
                            <motion.div
                                className="visa-stats-bar"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {[
                                    { status: 'visa-free' as VisaStatus, count: stats.visaFree },
                                    { status: 'evisa' as VisaStatus, count: stats.evisa },
                                    { status: 'visa-on-arrival' as VisaStatus, count: stats.visaOnArrival },
                                    { status: 'visa-required' as VisaStatus, count: stats.visaRequired },
                                ].map(({ status, count }) => (
                                    <div
                                        key={status}
                                        className="visa-stat-item"
                                        style={{ borderColor: visaStatusConfig[status].border }}
                                    >
                                        <span className="visa-stat-count" style={{ color: visaStatusConfig[status].color }}>
                                            {count}
                                        </span>
                                        <span className="visa-stat-label">{visaStatusConfig[status].label}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Tabs */}
                        <div className="visa-tabs-container">
                            <div className="visa-tabs">
                                <button
                                    className={`visa-tab ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                    type="button"
                                >
                                    All ({stats?.total})
                                </button>
                                {visaTabOrder.map((status) => {
                                    const config = visaStatusConfig[status];
                                    const count = status === 'visa-free' ? stats?.visaFree
                                        : status === 'evisa' ? stats?.evisa
                                            : status === 'visa-on-arrival' ? stats?.visaOnArrival
                                                : stats?.visaRequired;
                                    return (
                                        <button
                                            key={status}
                                            className={`visa-tab ${activeTab === status ? 'active' : ''}`}
                                            onClick={() => setActiveTab(status)}
                                            style={activeTab === status ? { color: config.color, borderColor: config.color } : {}}
                                            type="button"
                                        >
                                            {config.emoji} {config.label} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Search & Controls */}
                        <div className="visa-explorer-controls">
                            <div className="visa-explorer-search">
                                <Search size={16} className="visa-explorer-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="visa-explorer-search-input"
                                />
                            </div>

                            <div className="visa-explorer-toolbar">
                                {/* Region Chips */}
                                <div className="visa-explorer-regions">
                                    {allRegions.map((region) => (
                                        <button
                                            key={region}
                                            className={`visa-region-chip ${activeRegion === region ? 'active' : ''}`}
                                            onClick={() => setActiveRegion(region)}
                                            type="button"
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>

                                <div className="visa-explorer-sort-view">
                                    {/* Sort Toggle */}
                                    <button
                                        className={`visa-sort-btn ${sortMode === 'alpha' ? 'active' : ''}`}
                                        onClick={() => setSortMode(sortMode === 'alpha' ? 'popular' : 'alpha')}
                                        title={sortMode === 'alpha' ? 'Sorted A-Z' : 'Sorted by Popular'}
                                        type="button"
                                    >
                                        {sortMode === 'alpha' ? <ArrowDownAZ size={16} /> : <TrendingUp size={16} />}
                                    </button>

                                    {/* View Toggle */}
                                    <div className="visa-view-toggle">
                                        <button
                                            className={`visa-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                            onClick={() => setViewMode('list')}
                                            type="button"
                                        >
                                            <List size={16} />
                                        </button>
                                        <button
                                            className={`visa-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                            onClick={() => setViewMode('grid')}
                                            type="button"
                                        >
                                            <Grid3X3 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className={`visa-explorer-results visa-explorer-results--${viewMode}`}>
                            <AnimatePresence mode="wait">
                                {filteredData.length > 0 ? (
                                    filteredData.map((visa, i) => (
                                        <CountryCard
                                            key={`${visa.from}-${visa.to}`}
                                            visaInfo={visa}
                                            viewMode={viewMode}
                                            onClick={() => handleCountryClick(visa)}
                                            index={i}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        className="visa-explorer-empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <span className="visa-explorer-empty-icon">🔍</span>
                                        <p>No destinations found matching your criteria</p>
                                        <button
                                            className="visa-explorer-reset-btn"
                                            onClick={() => { setSearch(''); setActiveTab('all'); setActiveRegion('All Regions'); }}
                                            type="button"
                                        >
                                            Reset Filters
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Detail Modal */}
            <CountryDetailModal
                visaInfo={selectedVisa}
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedVisa(null); }}
            />
        </div>
    );
};

export default VisaExplorerPage;
