import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTourStore } from '../../store';
import {
    tourCategories,
    tourSortOptions,
    type TourCategory,
    type TourSortOption,
} from '../../data/tourListingData';
import { colors, spacing, shadows, fonts } from '../../theme';

const durationFilters: Array<{ label: string; value: string }> = [
    { label: 'All', value: 'all' },
    { label: '1-3 days', value: '1-3' },
    { label: '4-7 days', value: '4-7' },
    { label: '7+ days', value: '7+' },
];

export default function ToursScreen() {
    const router = useRouter();

    const searchQuery = useTourStore((s) => s.searchQuery);
    const setSearchQuery = useTourStore((s) => s.setSearchQuery);
    const filters = useTourStore((s) => s.filters);
    const setFilters = useTourStore((s) => s.setFilters);
    const sortBy = useTourStore((s) => s.sortBy);
    const setSortBy = useTourStore((s) => s.setSortBy);
    const resetFilters = useTourStore((s) => s.resetFilters);
    const wishlist = useTourStore((s) => s.wishlist);
    const toggleWishlist = useTourStore((s) => s.toggleWishlist);
    const tours = useTourStore((s) => s.getDisplayedTours());
    const hasMore = useTourStore((s) => s.hasMore);
    const isLoading = useTourStore((s) => s.isLoading);
    const loadMore = useTourStore((s) => s.loadMore);
    const activeFilterCount = useTourStore((s) => s.getActiveFilterCount());

    const toggleCategory = (category: TourCategory) => {
        if (filters.categories.includes(category)) {
            setFilters({ categories: filters.categories.filter((item) => item !== category) });
            return;
        }
        setFilters({ categories: [...filters.categories, category] });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tour Listings</Text>
                    <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                        <Ionicons name="refresh-outline" size={16} color={colors.primary.DEFAULT} />
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchRow}>
                    <Ionicons name="search-outline" size={18} color={colors.text.muted} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                        placeholder="Search tours, location, country..."
                        placeholderTextColor={colors.text.muted}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {tourSortOptions.map((option) => {
                        const active = sortBy === option.value;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[styles.sortChip, active && styles.sortChipActive]}
                                onPress={() => setSortBy(option.value as TourSortOption)}
                            >
                                <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {durationFilters.map((option) => {
                        const active = filters.duration === option.value;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[styles.filterChip, active && styles.filterChipActive]}
                                onPress={() => setFilters({ duration: option.value })}
                            >
                                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {tourCategories.map((category) => {
                        const active = filters.categories.includes(category);
                        return (
                            <TouchableOpacity
                                key={category}
                                style={[styles.filterChip, active && styles.filterChipActive]}
                                onPress={() => toggleCategory(category)}
                            >
                                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                        {tours.length} tours shown {activeFilterCount > 0 ? `(${activeFilterCount} filters)` : ''}
                    </Text>
                </View>

                {tours.map((tour) => (
                    <TouchableOpacity
                        key={tour.id}
                        style={styles.card}
                        activeOpacity={0.92}
                        onPress={() => router.push(`/tour/${tour.id}` as never)}
                    >
                        <View>
                            <Image source={{ uri: tour.images[0] }} style={styles.cardImage} />
                            <TouchableOpacity
                                style={styles.wishlistButton}
                                onPress={() => toggleWishlist(tour.id)}
                                hitSlop={10}
                            >
                                <Ionicons
                                    name={wishlist.has(tour.id) ? 'heart' : 'heart-outline'}
                                    size={18}
                                    color={wishlist.has(tour.id) ? '#EF4444' : colors.white}
                                />
                            </TouchableOpacity>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={12} color="#F59E0B" />
                                <Text style={styles.ratingBadgeText}>
                                    {tour.rating} ({tour.reviewCount})
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardBody}>
                            <Text numberOfLines={1} style={styles.cardTitle}>
                                {tour.name}
                            </Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={14} color={colors.text.muted} />
                                <Text style={styles.locationText}>
                                    {tour.location}, {tour.country}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoPill}>{tour.duration}</Text>
                                <Text style={styles.infoPill}>Group {tour.groupSize}</Text>
                                {tour.isAIRecommended ? <Text style={styles.aiPill}>AI Pick</Text> : null}
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>{tour.currency}{tour.price}</Text>
                                {tour.originalPrice ? (
                                    <Text style={styles.oldPrice}>{tour.currency}{tour.originalPrice}</Text>
                                ) : null}
                                <Text style={styles.perText}>/person</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary.DEFAULT} style={styles.loader} />
                ) : null}

                {hasMore && !isLoading ? (
                    <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
                        <Text style={styles.loadMoreText}>Load More Tours</Text>
                    </TouchableOpacity>
                ) : null}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.bodyBold,
        color: colors.text.primary,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: colors.primary.subtle,
    },
    resetButtonText: {
        fontSize: 12,
        fontFamily: fonts.bodySemibold,
        color: colors.primary.DEFAULT,
    },
    searchRow: {
        marginTop: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontFamily: fonts.body,
        color: colors.text.primary,
        fontSize: 14,
    },
    row: {
        marginTop: spacing.md,
        gap: 8,
        paddingBottom: 2,
    },
    sortChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
    },
    sortChipActive: {
        backgroundColor: colors.secondary.DEFAULT,
        borderColor: colors.secondary.DEFAULT,
    },
    sortChipText: {
        fontFamily: fonts.bodySemibold,
        fontSize: 12,
        color: colors.text.secondary,
    },
    sortChipTextActive: {
        color: colors.white,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
    },
    filterChipActive: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    filterChipText: {
        fontFamily: fonts.bodySemibold,
        fontSize: 12,
        color: colors.text.secondary,
    },
    filterChipTextActive: {
        color: colors.white,
    },
    metaRow: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    metaText: {
        fontSize: 12,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    cardImage: {
        width: '100%',
        height: 190,
    },
    wishlistButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15,23,42,0.45)',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.62)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    ratingBadgeText: {
        fontSize: 11,
        color: colors.white,
        fontFamily: fonts.bodySemibold,
    },
    cardBody: {
        padding: 14,
    },
    cardTitle: {
        fontSize: 16,
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
    },
    locationRow: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    infoRow: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    infoPill: {
        borderRadius: 12,
        backgroundColor: colors.background.tertiary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 11,
        color: colors.text.secondary,
        fontFamily: fonts.bodyMedium,
    },
    aiPill: {
        borderRadius: 12,
        backgroundColor: '#DCFCE7',
        color: '#166534',
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 11,
        fontFamily: fonts.bodySemibold,
    },
    priceRow: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    price: {
        fontSize: 20,
        fontFamily: fonts.bodyBold,
        color: colors.primary.DEFAULT,
    },
    oldPrice: {
        fontSize: 13,
        color: colors.text.light,
        textDecorationLine: 'line-through',
        fontFamily: fonts.body,
    },
    perText: {
        fontSize: 12,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    loader: {
        marginVertical: spacing.sm,
    },
    loadMoreButton: {
        alignSelf: 'center',
        marginTop: spacing.sm,
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    loadMoreText: {
        color: colors.white,
        fontSize: 13,
        fontFamily: fonts.bodySemibold,
    },
    bottomSpacer: {
        height: 96,
    },
});
