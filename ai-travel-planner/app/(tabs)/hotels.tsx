import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHotelStore } from '../../store';
import {
    allAmenities,
    sortOptions,
    type SortOption,
} from '../../data/hotelListingData';
import { colors, spacing, shadows, fonts } from '../../theme';

export default function HotelsScreen() {
    const searchQuery = useHotelStore((s) => s.searchQuery);
    const setSearchQuery = useHotelStore((s) => s.setSearchQuery);
    const filters = useHotelStore((s) => s.filters);
    const setFilters = useHotelStore((s) => s.setFilters);
    const sortBy = useHotelStore((s) => s.sortBy);
    const setSortBy = useHotelStore((s) => s.setSortBy);
    const viewMode = useHotelStore((s) => s.viewMode);
    const setViewMode = useHotelStore((s) => s.setViewMode);
    const wishlist = useHotelStore((s) => s.wishlist);
    const toggleWishlist = useHotelStore((s) => s.toggleWishlist);
    const hotels = useHotelStore((s) => s.getDisplayedHotels());
    const hasMore = useHotelStore((s) => s.hasMore);
    const isLoading = useHotelStore((s) => s.isLoading);
    const loadMore = useHotelStore((s) => s.loadMore);
    const resetFilters = useHotelStore((s) => s.resetFilters);
    const activeFilterCount = useHotelStore((s) => s.getActiveFilterCount());

    const toggleAmenity = (amenity: string) => {
        if (filters.amenities.includes(amenity)) {
            setFilters({ amenities: filters.amenities.filter((item) => item !== amenity) });
            return;
        }
        setFilters({ amenities: [...filters.amenities, amenity] });
    };

    const popularAmenities = allAmenities.slice(0, 8);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Hotel Listings</Text>
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
                        placeholder="Search hotels, landmark, location..."
                        placeholderTextColor={colors.text.muted}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {sortOptions.map((option) => {
                        const active = sortBy === option.value;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[styles.sortChip, active && styles.sortChipActive]}
                                onPress={() => setSortBy(option.value as SortOption)}
                            >
                                <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {popularAmenities.map((amenity) => {
                        const active = filters.amenities.includes(amenity);
                        return (
                            <TouchableOpacity
                                key={amenity}
                                style={[styles.filterChip, active && styles.filterChipActive]}
                                onPress={() => toggleAmenity(amenity)}
                            >
                                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                    {amenity}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                        {hotels.length} hotels shown {activeFilterCount > 0 ? `(${activeFilterCount} filters)` : ''}
                    </Text>
                    <View style={styles.viewSwitcher}>
                        <TouchableOpacity
                            style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
                            onPress={() => setViewMode('list')}
                        >
                            <Ionicons name="list-outline" size={16} color={viewMode === 'list' ? colors.white : colors.text.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.viewButton, viewMode === 'map' && styles.viewButtonActive]}
                            onPress={() => setViewMode('map')}
                        >
                            <Ionicons name="map-outline" size={16} color={viewMode === 'map' ? colors.white : colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {viewMode === 'map' ? (
                    <View style={styles.mapModeContainer}>
                        {hotels.map((hotel) => (
                            <View key={hotel.id} style={styles.mapItem}>
                                <View style={styles.mapDot} />
                                <View style={styles.mapItemBody}>
                                    <Text style={styles.mapItemTitle}>{hotel.name}</Text>
                                    <Text style={styles.mapItemMeta}>
                                        {hotel.location} • {hotel.distance} • {hotel.coordinates.lat.toFixed(3)}, {hotel.coordinates.lng.toFixed(3)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    hotels.map((hotel) => (
                        <View key={hotel.id} style={styles.card}>
                            <Image source={{ uri: hotel.images[0] }} style={styles.cardImage} />
                            <TouchableOpacity
                                style={styles.wishlistButton}
                                onPress={() => toggleWishlist(hotel.id)}
                                hitSlop={10}
                            >
                                <Ionicons
                                    name={wishlist.has(hotel.id) ? 'heart' : 'heart-outline'}
                                    size={18}
                                    color={wishlist.has(hotel.id) ? '#EF4444' : colors.white}
                                />
                            </TouchableOpacity>
                            <View style={styles.cardBody}>
                                <View style={styles.titleRow}>
                                    <Text numberOfLines={1} style={styles.cardTitle}>
                                        {hotel.name}
                                    </Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#F59E0B" />
                                        <Text style={styles.ratingText}>{hotel.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.cardSubTitle}>
                                    {hotel.location} • {hotel.landmark} • {hotel.distance}
                                </Text>
                                <View style={styles.amenityRow}>
                                    {hotel.amenities.slice(0, 3).map((amenity) => (
                                        <Text key={amenity} style={styles.amenityPill}>
                                            {amenity}
                                        </Text>
                                    ))}
                                    {hotel.isAIRecommended ? <Text style={styles.aiPill}>AI Pick</Text> : null}
                                </View>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>{hotel.currency}{hotel.price}</Text>
                                    {hotel.originalPrice ? (
                                        <Text style={styles.oldPrice}>{hotel.currency}{hotel.originalPrice}</Text>
                                    ) : null}
                                    <Text style={styles.perNight}>/night</Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary.DEFAULT} style={styles.loader} />
                ) : null}

                {hasMore && !isLoading ? (
                    <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
                        <Text style={styles.loadMoreText}>Load More Hotels</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    viewSwitcher: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        overflow: 'hidden',
    },
    viewButton: {
        width: 36,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    viewButtonActive: {
        backgroundColor: colors.primary.DEFAULT,
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
    cardBody: {
        padding: 14,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    cardTitle: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: 10,
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    ratingText: {
        fontSize: 11,
        fontFamily: fonts.bodySemibold,
        color: '#B45309',
    },
    cardSubTitle: {
        marginTop: 6,
        fontSize: 12,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    amenityRow: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    amenityPill: {
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
    perNight: {
        fontSize: 12,
        color: colors.text.muted,
        fontFamily: fonts.body,
    },
    mapModeContainer: {
        borderRadius: 16,
        backgroundColor: colors.white,
        padding: 12,
        gap: 10,
        ...shadows.sm,
    },
    mapItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    mapDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary.DEFAULT,
        marginTop: 5,
    },
    mapItemBody: {
        flex: 1,
    },
    mapItemTitle: {
        color: colors.text.primary,
        fontFamily: fonts.bodySemibold,
        fontSize: 13,
    },
    mapItemMeta: {
        marginTop: 2,
        color: colors.text.muted,
        fontFamily: fonts.body,
        fontSize: 11,
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
