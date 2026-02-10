import React, { useMemo, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, shadows, fonts, gradients } from '../../theme';
import { useAuthStore } from '../../store';

const exploreCities = [
    {
        id: 'c1',
        name: 'Mount Bromo',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80',
        rating: 4.9,
        location: 'Thailand',
        price: '$890',
        priceUnit: '/person',
        isFavorite: true,
    },
    {
        id: 'c2',
        name: 'Koh Phi Phi',
        image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=400&q=80',
        rating: 4.8,
        location: 'Thailand',
        price: '$950',
        priceUnit: '/person',
        isFavorite: false,
    },
    {
        id: 'c3',
        name: 'Bali Beach',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        rating: 4.7,
        location: 'Indonesia',
        price: '$799',
        priceUnit: '/person',
        isFavorite: false,
    },
    {
        id: 'c4',
        name: 'Santorini',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
        rating: 4.9,
        location: 'Greece',
        price: '$1,199',
        priceUnit: '/person',
        isFavorite: true,
    },
];

const categoryChips = [
    { id: '1', label: 'Mountain', icon: '⛰️' },
    { id: '2', label: 'Beach', icon: '🏖️' },
    { id: '3', label: 'Park', icon: '🌲' },
    { id: '4', label: 'City', icon: '🏙️' },
    { id: '5', label: 'Desert', icon: '🏜️' },
];

const exploreTabs = ['All', 'Popular', 'Recommended', 'Most Viewed', 'Recent'];

const popularCategories = [
    { id: 'cat1', name: 'Flights', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80' },
    { id: 'cat2', name: 'Hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80' },
    { id: 'cat3', name: 'Transports', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&q=80' },
    { id: 'cat4', name: 'Events', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80' },
];

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [activeTab, setActiveTab] = useState('Popular');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCities = useMemo(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return exploreCities.filter(
                (city) =>
                    city.name.toLowerCase().includes(query) ||
                    city.location.toLowerCase().includes(query)
            );
        }
        return exploreCities;
    }, [searchQuery]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#FFF9F5', '#FFFFFF']} style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.avatarWrap}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }}
                                    style={styles.avatar}
                                />
                            </View>
                            <View>
                                <Text style={styles.welcomeText}>Welcome Back</Text>
                                <Text style={styles.userName}>{user?.name || 'Traveler'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
                            <Text style={styles.notificationIcon}>🔔</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <View style={styles.searchBar}>
                            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                placeholder="Discover a city"
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchInput}
                            />
                        </View>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryChips}
                    >
                        {categoryChips.map((chip) => {
                            const isActive = selectedCategory === chip.id;
                            return (
                                <TouchableOpacity
                                    key={chip.id}
                                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                                    onPress={() => setSelectedCategory(chip.id)}
                                    activeOpacity={0.85}
                                >
                                    <Text style={styles.categoryChipIcon}>{chip.icon}</Text>
                                    <Text style={[styles.categoryChipLabel, isActive && styles.categoryChipLabelActive]}>
                                        {chip.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Explore Cities</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.exploreTabs}
                        >
                            {exploreTabs.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <TouchableOpacity
                                        key={tab}
                                        style={styles.exploreTab}
                                        onPress={() => setActiveTab(tab)}
                                    >
                                        <Text style={[styles.exploreTabText, isActive && styles.exploreTabTextActive]}>
                                            {tab}
                                        </Text>
                                        {isActive ? <View style={styles.exploreDot} /> : null}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.cityGrid}>
                            {filteredCities.map((city) => (
                                <View key={city.id} style={styles.cityCard}>
                                    <View style={styles.cityImageWrap}>
                                        <Image source={{ uri: city.image }} style={styles.cityImage} />
                                        <TouchableOpacity style={styles.cityFavorite}>
                                            <Ionicons
                                                name="heart"
                                                size={16}
                                                color={city.isFavorite ? '#FF6B6B' : '#FFFFFF'}
                                            />
                                        </TouchableOpacity>
                                        <View style={styles.cityRating}>
                                            <Ionicons name="star" size={12} color="#FFD700" />
                                            <Text style={styles.cityRatingText}>{city.rating}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cityInfo}>
                                        <Text style={styles.cityName} numberOfLines={1}>
                                            {city.name}
                                        </Text>
                                        <View style={styles.cityLocation}>
                                            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                                            <Text style={styles.cityLocationText}>{city.location}</Text>
                                        </View>
                                        <View style={styles.cityPrice}>
                                            <Text style={styles.cityPriceValue}>{city.price}</Text>
                                            <Text style={styles.cityPriceUnit}>{city.priceUnit}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Popular Categories</Text>
                        <View style={styles.popularCategories}>
                            {popularCategories.map((cat) => (
                                <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.9}>
                                    <View style={styles.categoryIconCircle}>
                                        <Image source={{ uri: cat.image }} style={styles.categoryIconImage} />
                                    </View>
                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.aiCard}
                            onPress={() => router.push('/(tabs)/planner')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient colors={gradients.home} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.aiCardGradient}>
                                <View style={styles.aiIcon}>
                                    <Ionicons name="sparkles" size={24} color={colors.white} />
                                </View>
                                <View style={styles.aiContent}>
                                    <Text style={styles.aiTitle}>AI Trip Planner</Text>
                                    <Text style={styles.aiSubtitle}>Get personalized itineraries powered by AI</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF9F5',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    avatarWrap: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#F97316',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    welcomeText: {
        fontSize: 12,
        color: '#F97316',
        fontFamily: fonts.bodyMedium,
    },
    userName: {
        fontSize: 18,
        color: '#1A1A1A',
        fontFamily: fonts.bodyBold,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF5EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationIcon: {
        fontSize: 20,
    },
    searchContainer: {
        marginBottom: spacing.lg,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: 14,
        paddingHorizontal: 18,
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        fontFamily: fonts.body,
    },
    categoryChips: {
        paddingBottom: 8,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    categoryChipActive: {
        backgroundColor: '#F97316',
        borderColor: '#F97316',
        ...shadows.sm,
    },
    categoryChipIcon: {
        fontSize: 16,
    },
    categoryChipLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: fonts.bodyMedium,
    },
    categoryChipLabelActive: {
        color: colors.white,
        fontFamily: fonts.bodySemibold,
    },
    section: {
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#1A1A1A',
        fontFamily: fonts.bodyBold,
        marginBottom: spacing.md,
    },
    exploreTabs: {
        paddingBottom: spacing.sm,
        gap: 6,
    },
    exploreTab: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        alignItems: 'center',
    },
    exploreTabText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontFamily: fonts.bodyMedium,
    },
    exploreTabTextActive: {
        color: '#1A1A1A',
        fontFamily: fonts.bodySemibold,
    },
    exploreDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#F97316',
        marginTop: 4,
    },
    cityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cityCard: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        ...shadows.md,
    },
    cityImageWrap: {
        position: 'relative',
        height: 130,
    },
    cityImage: {
        width: '100%',
        height: '100%',
    },
    cityFavorite: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    cityRating: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 8,
    },
    cityRatingText: {
        color: colors.white,
        fontSize: 12,
        fontFamily: fonts.bodySemibold,
    },
    cityInfo: {
        padding: 14,
    },
    cityName: {
        fontSize: 15,
        color: '#1A1A1A',
        fontFamily: fonts.bodySemibold,
        marginBottom: 6,
    },
    cityLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    cityLocationText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: fonts.body,
    },
    cityPrice: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
    },
    cityPriceValue: {
        fontSize: 16,
        fontFamily: fonts.bodyBold,
        color: '#F97316',
    },
    cityPriceUnit: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: fonts.body,
    },
    popularCategories: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    categoryItem: {
        flex: 1,
        alignItems: 'center',
        gap: 10,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderRadius: 16,
        ...shadows.sm,
    },
    categoryIconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        backgroundColor: '#E8F4FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryIconImage: {
        width: '100%',
        height: '100%',
    },
    categoryName: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: fonts.bodyMedium,
    },
    aiCard: {
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.lg,
    },
    aiCardGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 20,
    },
    aiIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiContent: {
        flex: 1,
    },
    aiTitle: {
        fontSize: 17,
        color: colors.white,
        fontFamily: fonts.bodyBold,
        marginBottom: 4,
    },
    aiSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        fontFamily: fonts.body,
    },
});
