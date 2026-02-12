import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { countries, getCountryByCode, regions, type Country } from '../../data/countries';
import {
    getVisaDataByPassport,
    getVisaInfo,
    getVisaStats,
    visaStatusConfig,
    type VisaInfo,
    type VisaStatus,
} from '../../data/visaData';
import { colors, spacing, shadows, fonts } from '../../theme';

type VisaTab = 'checker' | 'explorer';

interface CountrySelectProps {
    label: string;
    value: Country | null;
    onChange: (country: Country) => void;
    excludeCode?: string;
}

function CountrySelect({ label, value, onChange, excludeCode }: CountrySelectProps) {
    const [visible, setVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [activeRegion, setActiveRegion] = useState<string>('All Regions');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return countries.filter((country) => {
            if (excludeCode && country.code === excludeCode) return false;
            const regionMatch = activeRegion === 'All Regions' || country.region === activeRegion;
            const searchMatch =
                q.length === 0 ||
                country.name.toLowerCase().includes(q) ||
                country.code.toLowerCase().includes(q);
            return regionMatch && searchMatch;
        });
    }, [query, activeRegion, excludeCode]);

    return (
        <View>
            <Text style={styles.selectLabel}>{label}</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => setVisible(true)}>
                <Text style={styles.selectButtonText}>
                    {value ? `${value.flag} ${value.name}` : `Select ${label.toLowerCase()}`}
                </Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.text.muted} />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Ionicons name="close-outline" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalSearchRow}>
                            <Ionicons name="search-outline" size={16} color={colors.text.muted} />
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                style={styles.modalSearchInput}
                                placeholder="Search country..."
                                placeholderTextColor={colors.text.muted}
                            />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionRow}>
                            {regions.map((region) => {
                                const active = activeRegion === region;
                                return (
                                    <TouchableOpacity
                                        key={region}
                                        style={[styles.regionChip, active && styles.regionChipActive]}
                                        onPress={() => setActiveRegion(region)}
                                    >
                                        <Text style={[styles.regionChipText, active && styles.regionChipTextActive]}>
                                            {region}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <ScrollView style={styles.countryList}>
                            {filtered.map((country) => (
                                <TouchableOpacity
                                    key={country.code}
                                    style={styles.countryRow}
                                    onPress={() => {
                                        onChange(country);
                                        setVisible(false);
                                        setQuery('');
                                    }}
                                >
                                    <Text style={styles.countryFlag}>{country.flag}</Text>
                                    <View style={styles.countryRowBody}>
                                        <Text style={styles.countryName}>{country.name}</Text>
                                        <Text style={styles.countryMeta}>{country.code} • {country.region}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default function VisaScreen() {
    const [activeTab, setActiveTab] = useState<VisaTab>('checker');

    // Checker state
    const [fromCountry, setFromCountry] = useState<Country | null>(null);
    const [toCountry, setToCountry] = useState<Country | null>(null);
    const [result, setResult] = useState<VisaInfo | null>(null);
    const [checkerError, setCheckerError] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<Array<{ from: Country; to: Country }>>([]);

    // Explorer state
    const [passportCountry, setPassportCountry] = useState<Country | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStatus, setActiveStatus] = useState<VisaStatus | 'all'>('all');
    const [activeRegion, setActiveRegion] = useState<string>('All Regions');

    const explorerData = useMemo(
        () => (passportCountry ? getVisaDataByPassport(passportCountry.code) : []),
        [passportCountry]
    );
    const explorerStats = useMemo(
        () => (passportCountry ? getVisaStats(passportCountry.code) : null),
        [passportCountry]
    );

    const explorerFiltered = useMemo(() => {
        let data = explorerData;
        if (activeStatus !== 'all') {
            data = data.filter((item) => item.status === activeStatus);
        }
        if (activeRegion !== 'All Regions') {
            data = data.filter((item) => getCountryByCode(item.to)?.region === activeRegion);
        }
        const query = searchQuery.trim().toLowerCase();
        if (query.length > 0) {
            data = data.filter((item) => {
                const destination = getCountryByCode(item.to);
                return Boolean(
                    destination &&
                    (destination.name.toLowerCase().includes(query) ||
                        destination.code.toLowerCase().includes(query))
                );
            });
        }
        return data;
    }, [explorerData, activeStatus, activeRegion, searchQuery]);

    const handleCheckVisa = () => {
        if (!fromCountry || !toCountry) return;
        const visa = getVisaInfo(fromCountry.code, toCountry.code);
        if (!visa) {
            setCheckerError(
                `No visa data found for ${fromCountry.name} to ${toCountry.name}.`
            );
            setResult(null);
            return;
        }
        setCheckerError(null);
        setResult(visa);
        setRecentSearches((prev) => {
            const deduped = prev.filter(
                (item) => !(item.from.code === fromCountry.code && item.to.code === toCountry.code)
            );
            return [{ from: fromCountry, to: toCountry }, ...deduped].slice(0, 5);
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
                <View style={styles.tabSwitch}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'checker' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('checker')}
                    >
                        <Text style={[styles.tabButtonText, activeTab === 'checker' && styles.tabButtonTextActive]}>
                            Checker
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'explorer' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('explorer')}
                    >
                        <Text style={[styles.tabButtonText, activeTab === 'explorer' && styles.tabButtonTextActive]}>
                            Explorer
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'checker' ? (
                    <View style={styles.section}>
                        <Text style={styles.title}>Visa Requirement Checker</Text>
                        <Text style={styles.subtitle}>
                            Select your citizenship and destination to get exact visa requirements.
                        </Text>

                        <CountrySelect
                            label="Citizenship"
                            value={fromCountry}
                            onChange={setFromCountry}
                            excludeCode={toCountry?.code}
                        />
                        <CountrySelect
                            label="Destination"
                            value={toCountry}
                            onChange={setToCountry}
                            excludeCode={fromCountry?.code}
                        />

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                (!fromCountry || !toCountry) && styles.actionButtonDisabled,
                            ]}
                            onPress={handleCheckVisa}
                            disabled={!fromCountry || !toCountry}
                        >
                            <Ionicons name="sparkles-outline" size={16} color={colors.white} />
                            <Text style={styles.actionButtonText}>Check Visa</Text>
                        </TouchableOpacity>

                        {checkerError ? <Text style={styles.errorText}>{checkerError}</Text> : null}

                        {result ? (
                            <View style={styles.resultCard}>
                                <View style={styles.resultHeader}>
                                    <Text style={styles.resultRoute}>
                                        {fromCountry?.flag} {fromCountry?.name} → {toCountry?.flag} {toCountry?.name}
                                    </Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: visaStatusConfig[result.status].bg },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusBadgeText,
                                                { color: visaStatusConfig[result.status].color },
                                            ]}
                                        >
                                            {visaStatusConfig[result.status].label}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.resultMetaRow}>
                                    <Text style={styles.resultMeta}>Max stay: {result.maxStay}</Text>
                                    <Text style={styles.resultMeta}>Process: {result.processingTime}</Text>
                                    <Text style={styles.resultMeta}>Cost: {result.cost}</Text>
                                </View>
                                <Text style={styles.resultHeading}>Required Documents</Text>
                                {result.documents.map((doc) => (
                                    <Text key={doc} style={styles.resultBullet}>• {doc}</Text>
                                ))}
                                <Text style={styles.resultHeading}>Next Steps</Text>
                                {result.nextSteps.map((step) => (
                                    <Text key={step} style={styles.resultBullet}>• {step}</Text>
                                ))}
                            </View>
                        ) : null}

                        {recentSearches.length > 0 ? (
                            <View style={styles.recentSection}>
                                <Text style={styles.recentTitle}>Recent Checks</Text>
                                {recentSearches.map((item) => (
                                    <TouchableOpacity
                                        key={`${item.from.code}-${item.to.code}`}
                                        style={styles.recentItem}
                                        onPress={() => {
                                            setFromCountry(item.from);
                                            setToCountry(item.to);
                                        }}
                                    >
                                        <Text style={styles.recentItemText}>
                                            {item.from.flag} {item.from.name} → {item.to.flag} {item.to.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null}
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.title}>Visa Explorer</Text>
                        <Text style={styles.subtitle}>
                            Explore where your passport can travel visa-free, eVisa, or on-arrival.
                        </Text>

                        <CountrySelect label="Passport Country" value={passportCountry} onChange={setPassportCountry} />

                        {passportCountry && explorerStats ? (
                            <>
                                <View style={styles.statsGrid}>
                                    <View style={styles.statCard}>
                                        <Text style={styles.statValue}>{explorerStats.total}</Text>
                                        <Text style={styles.statLabel}>Total</Text>
                                    </View>
                                    <View style={styles.statCard}>
                                        <Text style={[styles.statValue, { color: visaStatusConfig['visa-free'].color }]}>
                                            {explorerStats.visaFree}
                                        </Text>
                                        <Text style={styles.statLabel}>Visa Free</Text>
                                    </View>
                                    <View style={styles.statCard}>
                                        <Text style={[styles.statValue, { color: visaStatusConfig.evisa.color }]}>
                                            {explorerStats.evisa}
                                        </Text>
                                        <Text style={styles.statLabel}>eVisa</Text>
                                    </View>
                                    <View style={styles.statCard}>
                                        <Text style={[styles.statValue, { color: visaStatusConfig['visa-on-arrival'].color }]}>
                                            {explorerStats.visaOnArrival}
                                        </Text>
                                        <Text style={styles.statLabel}>On Arrival</Text>
                                    </View>
                                </View>

                                <View style={styles.searchRow}>
                                    <Ionicons name="search-outline" size={16} color={colors.text.muted} />
                                    <TextInput
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        style={styles.searchInput}
                                        placeholder="Search destination country..."
                                        placeholderTextColor={colors.text.muted}
                                    />
                                </View>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                                    {(['all', 'visa-free', 'evisa', 'visa-on-arrival', 'visa-required'] as const).map((status) => {
                                        const active = activeStatus === status;
                                        const label = status === 'all' ? 'All' : visaStatusConfig[status].label;
                                        return (
                                            <TouchableOpacity
                                                key={status}
                                                style={[styles.filterChip, active && styles.filterChipActive]}
                                                onPress={() => setActiveStatus(status)}
                                            >
                                                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                                    {label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                                    {regions.map((region) => {
                                        const active = activeRegion === region;
                                        return (
                                            <TouchableOpacity
                                                key={region}
                                                style={[styles.filterChip, active && styles.filterChipActive]}
                                                onPress={() => setActiveRegion(region)}
                                            >
                                                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                                    {region}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>

                                <View style={styles.explorerList}>
                                    {explorerFiltered.map((item) => {
                                        const destination = getCountryByCode(item.to);
                                        if (!destination) return null;
                                        const config = visaStatusConfig[item.status];
                                        return (
                                            <View key={`${item.from}-${item.to}`} style={styles.explorerItem}>
                                                <Text style={styles.explorerFlag}>{destination.flag}</Text>
                                                <View style={styles.explorerBody}>
                                                    <Text style={styles.explorerName}>{destination.name}</Text>
                                                    <Text style={styles.explorerMeta}>
                                                        {destination.region} • {item.maxStay} • {item.cost}
                                                    </Text>
                                                </View>
                                                <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                                                    <Text style={[styles.statusBadgeText, { color: config.color }]}>
                                                        {config.label}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                    {explorerFiltered.length === 0 ? (
                                        <Text style={styles.emptyText}>No destinations found for these filters.</Text>
                                    ) : null}
                                </View>
                            </>
                        ) : null}
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    page: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },
    tabSwitch: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.white,
        padding: 4,
        flexDirection: 'row',
    },
    tabButton: {
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    tabButtonActive: {
        backgroundColor: colors.primary.DEFAULT,
    },
    tabButtonText: {
        fontSize: 13,
        color: colors.text.secondary,
        fontFamily: fonts.bodySemibold,
    },
    tabButtonTextActive: {
        color: colors.white,
    },
    section: {
        marginTop: spacing.lg,
    },
    title: {
        fontSize: 24,
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 13,
        color: colors.text.muted,
        fontFamily: fonts.body,
        lineHeight: 18,
    },
    selectLabel: {
        marginTop: spacing.md,
        marginBottom: 6,
        fontSize: 12,
        color: colors.text.secondary,
        fontFamily: fonts.bodySemibold,
    },
    selectButton: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectButtonText: {
        color: colors.text.primary,
        fontFamily: fonts.body,
        fontSize: 14,
    },
    actionButton: {
        marginTop: spacing.lg,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    actionButtonText: {
        color: colors.white,
        fontSize: 13,
        fontFamily: fonts.bodySemibold,
    },
    errorText: {
        marginTop: spacing.sm,
        color: colors.error.DEFAULT,
        fontFamily: fonts.body,
        fontSize: 12,
    },
    resultCard: {
        marginTop: spacing.lg,
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        padding: 12,
        ...shadows.sm,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    resultRoute: {
        flex: 1,
        color: colors.text.primary,
        fontFamily: fonts.bodySemibold,
        fontSize: 13,
    },
    statusBadge: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusBadgeText: {
        fontSize: 11,
        fontFamily: fonts.bodySemibold,
    },
    resultMetaRow: {
        marginTop: 8,
        gap: 4,
    },
    resultMeta: {
        color: colors.text.secondary,
        fontSize: 12,
        fontFamily: fonts.body,
    },
    resultHeading: {
        marginTop: 10,
        fontSize: 12,
        color: colors.text.primary,
        fontFamily: fonts.bodySemibold,
    },
    resultBullet: {
        marginTop: 4,
        fontSize: 12,
        color: colors.text.secondary,
        fontFamily: fonts.body,
    },
    recentSection: {
        marginTop: spacing.lg,
    },
    recentTitle: {
        fontSize: 13,
        color: colors.text.primary,
        fontFamily: fonts.bodySemibold,
        marginBottom: 8,
    },
    recentItem: {
        borderRadius: 10,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 6,
    },
    recentItemText: {
        color: colors.text.secondary,
        fontFamily: fonts.body,
        fontSize: 12,
    },
    statsGrid: {
        marginTop: spacing.md,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statCard: {
        width: '48%',
        borderRadius: 12,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        padding: 10,
    },
    statValue: {
        fontSize: 20,
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
    },
    statLabel: {
        marginTop: 2,
        fontSize: 12,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    searchRow: {
        marginTop: spacing.md,
        height: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: colors.text.primary,
        fontFamily: fonts.body,
        fontSize: 13,
    },
    filterRow: {
        marginTop: spacing.sm,
        gap: 8,
        paddingBottom: 2,
    },
    filterChip: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    filterChipActive: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    filterChipText: {
        fontSize: 12,
        color: colors.text.secondary,
        fontFamily: fonts.bodySemibold,
    },
    filterChipTextActive: {
        color: colors.white,
    },
    explorerList: {
        marginTop: spacing.md,
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        overflow: 'hidden',
    },
    explorerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    explorerFlag: {
        fontSize: 20,
    },
    explorerBody: {
        flex: 1,
    },
    explorerName: {
        fontSize: 13,
        color: colors.text.primary,
        fontFamily: fonts.bodySemibold,
    },
    explorerMeta: {
        marginTop: 2,
        fontSize: 11,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    emptyText: {
        padding: 16,
        textAlign: 'center',
        color: colors.text.muted,
        fontFamily: fonts.body,
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.5)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        maxHeight: '82%',
        backgroundColor: colors.background.DEFAULT,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 18,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 17,
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
    },
    modalSearchRow: {
        height: 42,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalSearchInput: {
        flex: 1,
        color: colors.text.primary,
        fontFamily: fonts.body,
        fontSize: 13,
    },
    regionRow: {
        marginTop: 10,
        gap: 8,
        paddingBottom: 2,
    },
    regionChip: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    regionChipActive: {
        backgroundColor: colors.secondary.DEFAULT,
        borderColor: colors.secondary.DEFAULT,
    },
    regionChipText: {
        fontSize: 12,
        color: colors.text.secondary,
        fontFamily: fonts.bodySemibold,
    },
    regionChipTextActive: {
        color: colors.white,
    },
    countryList: {
        marginTop: 10,
    },
    countryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: colors.border.light,
        marginBottom: 6,
    },
    countryFlag: {
        fontSize: 18,
    },
    countryRowBody: {
        flex: 1,
    },
    countryName: {
        fontSize: 13,
        color: colors.text.primary,
        fontFamily: fonts.bodySemibold,
    },
    countryMeta: {
        marginTop: 2,
        fontSize: 11,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    bottomSpacer: {
        height: 96,
    },
});
