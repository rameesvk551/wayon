import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, shadows, fonts } from '../../theme';

const featuredHotels = [
    {
        id: 'h1',
        name: 'The Grand Palace',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
        rating: 4.9,
        location: 'Paris, France',
        price: '$320',
        priceUnit: '/night',
        amenities: ['WiFi', 'Pool', 'Spa'],
    },
    {
        id: 'h2',
        name: 'Ocean Breeze Resort',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
        rating: 4.8,
        location: 'Maldives',
        price: '$480',
        priceUnit: '/night',
        amenities: ['Beach', 'Pool', 'Dining'],
    },
    {
        id: 'h3',
        name: 'Mountain Lodge',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
        rating: 4.7,
        location: 'Swiss Alps',
        price: '$250',
        priceUnit: '/night',
        amenities: ['WiFi', 'Skiing', 'Spa'],
    },
    {
        id: 'h4',
        name: 'Urban Boutique Hotel',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
        rating: 4.6,
        location: 'Tokyo, Japan',
        price: '$180',
        priceUnit: '/night',
        amenities: ['WiFi', 'Gym', 'Bar'],
    },
];

const filters = ['All', 'Luxury', 'Resort', 'Boutique', 'Budget'];

export default function HotelsScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Hotels</Text>
                    <Text style={styles.subtitle}>Find the perfect stay</Text>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.text.muted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search hotels..."
                        placeholderTextColor={colors.text.muted}
                        value={search}
                        onChangeText={setSearch}
                    />
                    <TouchableOpacity>
                        <Ionicons name="options-outline" size={20} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterChip,
                                activeFilter === f && styles.filterChipActive,
                            ]}
                            onPress={() => setActiveFilter(f)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === f && styles.filterTextActive,
                                ]}
                            >
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Hotel Cards */}
                <View style={styles.hotelsList}>
                    {featuredHotels.map((hotel) => (
                        <TouchableOpacity key={hotel.id} style={styles.hotelCard} activeOpacity={0.85}>
                            <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                            <View style={styles.hotelInfo}>
                                <View style={styles.hotelHeader}>
                                    <Text style={styles.hotelName}>{hotel.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#fff" />
                                        <Text style={styles.ratingText}>{hotel.rating}</Text>
                                    </View>
                                </View>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location-outline" size={14} color={colors.text.muted} />
                                    <Text style={styles.locationText}>{hotel.location}</Text>
                                </View>
                                <View style={styles.amenitiesRow}>
                                    {hotel.amenities.map((a) => (
                                        <View key={a} style={styles.amenityTag}>
                                            <Text style={styles.amenityText}>{a}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>{hotel.price}</Text>
                                    <Text style={styles.priceUnit}>{hotel.priceUnit}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF7',
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: 15,
        color: colors.text.muted,
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0ECE3',
        marginHorizontal: spacing.lg,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: spacing.md,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: colors.text.primary,
    },
    filtersContainer: {
        paddingHorizontal: spacing.lg,
        gap: 10,
        marginBottom: spacing.lg,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#F0ECE3',
    },
    filterChipActive: {
        backgroundColor: '#F97316',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.muted,
    },
    filterTextActive: {
        color: '#fff',
    },
    hotelsList: {
        paddingHorizontal: spacing.lg,
        gap: 16,
    },
    hotelCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.card,
    },
    hotelImage: {
        width: '100%',
        height: 180,
    },
    hotelInfo: {
        padding: 16,
    },
    hotelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hotelName: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text.primary,
        flex: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F97316',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    locationText: {
        fontSize: 13,
        color: colors.text.muted,
    },
    amenitiesRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },
    amenityTag: {
        backgroundColor: '#F0ECE3',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    amenityText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.text.muted,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: '800',
        color: '#F97316',
    },
    priceUnit: {
        fontSize: 13,
        color: colors.text.muted,
        marginLeft: 2,
    },
});
