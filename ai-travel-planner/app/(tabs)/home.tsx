import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DestinationCard, CategoryChip, Card } from '../../components/ui';
import { useAuthStore, useTripStore } from '../../store';
import { colors, fontSize, spacing, borderRadius, shadows } from '../../theme';

// Mock data - Rich destinations
const categories = [
    { id: '1', label: 'All', icon: 'grid-outline' },
    { id: '2', label: 'Adventure', icon: 'compass-outline' },
    { id: '3', label: 'Beach', icon: 'sunny-outline' },
    { id: '4', label: 'Culture', icon: 'business-outline' },
    { id: '5', label: 'Food', icon: 'restaurant-outline' },
    { id: '6', label: 'Nature', icon: 'leaf-outline' },
];

const allDestinations = [
    {
        id: '1',
        name: 'Venice Grand Canal',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400',
        rating: 4.8,
        price: '$139/person',
        category: 'Culture',
    },
    {
        id: '2',
        name: 'Tahitian Island',
        country: 'French Polynesia',
        image: 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=400',
        rating: 4.9,
        price: '$249/person',
        category: 'Beach',
    },
    {
        id: '3',
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
        rating: 4.7,
        price: '$199/person',
        category: 'Beach',
    },
    {
        id: '4',
        name: 'Swiss Alps',
        country: 'Switzerland',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
        rating: 4.9,
        price: '$299/person',
        category: 'Adventure',
    },
    {
        id: '5',
        name: 'Kyoto Temples',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
        rating: 4.8,
        price: '$179/person',
        category: 'Culture',
    },
    {
        id: '6',
        name: 'Maldives Resort',
        country: 'Maldives',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400',
        rating: 4.9,
        price: '$399/person',
        category: 'Beach',
    },
    {
        id: '7',
        name: 'Machu Picchu',
        country: 'Peru',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400',
        rating: 4.9,
        price: '$259/person',
        category: 'Adventure',
    },
    {
        id: '8',
        name: 'Bangkok Street Food',
        country: 'Thailand',
        image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400',
        rating: 4.6,
        price: '$89/person',
        category: 'Food',
    },
    {
        id: '9',
        name: 'Amazon Rainforest',
        country: 'Brazil',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400',
        rating: 4.7,
        price: '$319/person',
        category: 'Nature',
    },
    {
        id: '10',
        name: 'Tuscany Vineyards',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400',
        rating: 4.8,
        price: '$189/person',
        category: 'Food',
    },
];

const nearbyDestinations = [
    {
        id: '1',
        name: 'Piazza del Campo',
        country: 'Italy',
        rating: 4.4,
        price: '$83/person',
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
    },
    {
        id: '2',
        name: 'Leaning Tower of Pisa',
        country: 'Italy',
        rating: 4.4,
        price: '$83/person',
        image: 'https://images.unsplash.com/photo-1544944379-c962cec84ab8?w=400',
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { trips } = useTripStore();
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter destinations based on search and category
    const filteredDestinations = useMemo(() => {
        let filtered = allDestinations;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (dest) =>
                    dest.name.toLowerCase().includes(query) ||
                    dest.country.toLowerCase().includes(query)
            );
        }

        // Filter by category (skip for 'All')
        if (selectedCategory !== '1') {
            const categoryName = categories.find(c => c.id === selectedCategory)?.label;
            if (categoryName) {
                filtered = filtered.filter(dest => dest.category === categoryName);
            }
        }

        return filtered;
    }, [searchQuery, selectedCategory]);

    // Get upcoming trips count
    const upcomingTripsCount = trips.filter(t => t.status === 'upcoming' || t.status === 'planned').length;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hi, {user?.name || 'Traveler'} 👋</Text>
                        <Text style={styles.subtitle}>
                            {upcomingTripsCount > 0
                                ? `You have ${upcomingTripsCount} upcoming trips`
                                : 'Where do you want to explore?'}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={48} color={colors.primary.DEFAULT} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color={colors.text.muted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search destinations..."
                        placeholderTextColor={colors.text.muted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.text.muted} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((cat) => (
                        <CategoryChip
                            key={cat.id}
                            label={cat.label}
                            icon={cat.icon}
                            selected={selectedCategory === cat.id}
                            onPress={() => setSelectedCategory(cat.id)}
                        />
                    ))}
                </ScrollView>

                {/* Popular Destinations */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {searchQuery ? `Results for "${searchQuery}"` : 'Popular Destinations'}
                        </Text>
                        {!searchQuery && (
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {filteredDestinations.length === 0 ? (
                        <View style={styles.noResults}>
                            <Ionicons name="search-outline" size={48} color={colors.text.light} />
                            <Text style={styles.noResultsText}>No destinations found</Text>
                        </View>
                    ) : (
                        <FlatList
                            horizontal
                            data={filteredDestinations}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.destinationsContent}
                            renderItem={({ item }) => (
                                <DestinationCard
                                    name={item.name}
                                    country={item.country}
                                    image={item.image}
                                    rating={item.rating}
                                    price={item.price}
                                    onPress={() => router.push('/(tabs)/planner')}
                                    style={{ marginRight: spacing.md }}
                                />
                            )}
                        />
                    )}
                </View>

                {/* AI Trip Planner Card */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.aiCard}
                        onPress={() => router.push('/(tabs)/planner')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.aiCardContent}>
                            <View style={styles.aiIconContainer}>
                                <Ionicons name="sparkles" size={28} color={colors.white} />
                            </View>
                            <View style={styles.aiTextContainer}>
                                <Text style={styles.aiCardTitle}>AI Trip Planner</Text>
                                <Text style={styles.aiCardSubtitle}>
                                    Get personalized itineraries powered by AI
                                </Text>
                            </View>
                            <Ionicons name="arrow-forward" size={24} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Nearby Destinations */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Nearby Destinations</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {nearbyDestinations.map((dest) => (
                        <Card key={dest.id} style={styles.nearbyCard} onPress={() => { }}>
                            <View style={styles.nearbyContent}>
                                <Image source={{ uri: dest.image }} style={styles.nearbyImage} />
                                <View style={styles.nearbyInfo}>
                                    <Text style={styles.nearbyName}>{dest.name}</Text>
                                    <View style={styles.nearbyMeta}>
                                        <Ionicons name="location" size={14} color={colors.text.muted} />
                                        <Text style={styles.nearbyCountry}>{dest.country}</Text>
                                        <Ionicons name="star" size={14} color="#FCD34D" />
                                        <Text style={styles.nearbyRating}>{dest.rating}</Text>
                                    </View>
                                    <Text style={styles.nearbyPrice}>{dest.price}</Text>
                                </View>
                                <TouchableOpacity style={styles.favoriteButton}>
                                    <Ionicons name="heart-outline" size={24} color={colors.secondary.DEFAULT} />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
    },
    greeting: {
        fontSize: fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: fontSize.base,
        color: colors.text.muted,
        marginTop: 4,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginHorizontal: spacing.xl,
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        ...shadows.sm,
    },
    searchPlaceholder: {
        color: colors.text.muted,
        fontSize: fontSize.base,
    },
    searchInput: {
        flex: 1,
        fontSize: fontSize.base,
        color: colors.text.primary,
        paddingVertical: 0,
    },
    noResults: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    noResultsText: {
        marginTop: spacing.sm,
        fontSize: fontSize.base,
        color: colors.text.muted,
    },
    categoriesContainer: {
        marginTop: spacing.lg,
    },
    categoriesContent: {
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
    },
    section: {
        marginTop: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: '700',
        color: colors.text.primary,
    },
    seeAll: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.primary.DEFAULT,
    },
    destinationsContent: {
        paddingHorizontal: spacing.xl,
    },
    aiCard: {
        marginHorizontal: spacing.xl,
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.lg,
    },
    aiCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.md,
    },
    aiIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiTextContainer: {
        flex: 1,
    },
    aiCardTitle: {
        fontSize: fontSize.lg,
        fontWeight: '700',
        color: colors.white,
    },
    aiCardSubtitle: {
        fontSize: fontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    nearbyCard: {
        marginHorizontal: spacing.xl,
        marginBottom: spacing.md,
        padding: spacing.sm,
    },
    nearbyContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nearbyImage: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.md,
    },
    nearbyInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    nearbyName: {
        fontSize: fontSize.base,
        fontWeight: '600',
        color: colors.text.primary,
    },
    nearbyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    nearbyCountry: {
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginRight: spacing.sm,
    },
    nearbyRating: {
        fontSize: fontSize.sm,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    nearbyPrice: {
        fontSize: fontSize.base,
        fontWeight: '700',
        color: colors.primary.dark,
        marginTop: 4,
    },
    favoriteButton: {
        padding: spacing.sm,
    },
});
