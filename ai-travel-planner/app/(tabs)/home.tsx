import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { destinations } from '../../data/destinations';
import { colors, spacing, shadows, fonts, gradients } from '../../theme';

const categoryOptions = ['All', 'Beach', 'Culture', 'Adventure', 'Luxury', 'Food'];

export default function DiscoverScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredDestinations = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return destinations.filter((item) => {
            const matchesSearch =
                query.length === 0 ||
                item.name.toLowerCase().includes(query) ||
                item.country.toLowerCase().includes(query) ||
                item.tags.some((tag) => tag.toLowerCase().includes(query));

            const matchesCategory =
                activeCategory === 'All' || item.tags.includes(activeCategory);

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const trending = filteredDestinations.slice(0, 4);
    const popular = filteredDestinations.slice(4);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <LinearGradient colors={gradients.primary} style={styles.hero}>
                    <Text style={styles.heroBadge}>AI Discovery</Text>
                    <Text style={styles.heroTitle}>Discover Your Next Destination</Text>
                    <Text style={styles.heroSubtitle}>
                        Explore tour listings, hotels, visa insights, and build your trip plan.
                    </Text>
                    <TouchableOpacity
                        style={styles.heroAction}
                        onPress={() => router.push('/(tabs)/planner')}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="sparkles-outline" size={18} color={colors.white} />
                        <Text style={styles.heroActionText}>Start Planning</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.searchRow}>
                    <Ionicons name="search-outline" size={20} color={colors.text.muted} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                        placeholder="Search destinations, tags, countries..."
                        placeholderTextColor={colors.text.muted}
                    />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsRow}
                >
                    {categoryOptions.map((category) => {
                        const active = activeCategory === category;
                        return (
                            <TouchableOpacity
                                key={category}
                                style={[styles.chip, active && styles.chipActive]}
                                onPress={() => setActiveCategory(category)}
                            >
                                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Trending Now</Text>
                    <Text style={styles.sectionMeta}>{trending.length} destinations</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
                    {trending.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.trendingCard} activeOpacity={0.92}>
                            <Image source={{ uri: item.image }} style={styles.trendingImage} />
                            <LinearGradient
                                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                                style={styles.trendingOverlay}
                            >
                                <Text style={styles.trendingName}>{item.name}</Text>
                                <Text style={styles.trendingCountry}>{item.country}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Destinations</Text>
                    <Text style={styles.sectionMeta}>{filteredDestinations.length} total</Text>
                </View>
                <View style={styles.grid}>
                    {(popular.length > 0 ? popular : filteredDestinations).map((item) => (
                        <TouchableOpacity key={item.id} style={styles.gridCard} activeOpacity={0.9}>
                            <Image source={{ uri: item.image }} style={styles.gridImage} />
                            <View style={styles.gridBody}>
                                <Text numberOfLines={1} style={styles.gridName}>
                                    {item.name}
                                </Text>
                                <Text style={styles.gridCountry}>{item.country}</Text>
                                <View style={styles.gridMetaRow}>
                                    <Ionicons name="star" size={13} color="#F59E0B" />
                                    <Text style={styles.gridMetaText}>
                                        {item.rating} ({item.reviewCount.toLocaleString()})
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
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
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },
    hero: {
        borderRadius: 22,
        padding: spacing.lg,
        ...shadows.md,
    },
    heroBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.24)',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: colors.white,
        fontFamily: fonts.bodySemibold,
        fontSize: 12,
        marginBottom: spacing.sm,
    },
    heroTitle: {
        color: colors.white,
        fontFamily: fonts.bodyBold,
        fontSize: 24,
        lineHeight: 30,
        marginBottom: spacing.sm,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontFamily: fonts.body,
        fontSize: 13,
        lineHeight: 18,
    },
    heroAction: {
        marginTop: spacing.md,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    heroActionText: {
        color: colors.white,
        fontFamily: fonts.bodySemibold,
        fontSize: 13,
    },
    searchRow: {
        marginTop: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        height: 50,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: colors.text.primary,
        fontFamily: fonts.body,
        fontSize: 14,
    },
    chipsRow: {
        marginTop: spacing.md,
        gap: 8,
        paddingBottom: 4,
    },
    chip: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    chipActive: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    chipText: {
        color: colors.text.secondary,
        fontFamily: fonts.bodySemibold,
        fontSize: 12,
    },
    chipTextActive: {
        color: colors.white,
    },
    sectionHeader: {
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
        fontSize: 20,
    },
    sectionMeta: {
        color: colors.text.muted,
        fontFamily: fonts.body,
        fontSize: 12,
    },
    trendingRow: {
        gap: 12,
        paddingBottom: 4,
    },
    trendingCard: {
        width: 240,
        height: 170,
        borderRadius: 18,
        overflow: 'hidden',
    },
    trendingImage: {
        width: '100%',
        height: '100%',
    },
    trendingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 14,
    },
    trendingName: {
        color: colors.white,
        fontFamily: fonts.bodyBold,
        fontSize: 16,
    },
    trendingCountry: {
        color: 'rgba(255,255,255,0.9)',
        fontFamily: fonts.body,
        fontSize: 12,
        marginTop: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    gridCard: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        ...shadows.sm,
    },
    gridImage: {
        width: '100%',
        height: 110,
    },
    gridBody: {
        padding: 10,
    },
    gridName: {
        fontSize: 14,
        color: colors.text.primary,
        fontFamily: fonts.bodySemibold,
    },
    gridCountry: {
        marginTop: 2,
        color: colors.text.muted,
        fontFamily: fonts.body,
        fontSize: 12,
    },
    gridMetaRow: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gridMetaText: {
        color: colors.text.secondary,
        fontFamily: fonts.body,
        fontSize: 11,
    },
    bottomSpacer: {
        height: 96,
    },
});
