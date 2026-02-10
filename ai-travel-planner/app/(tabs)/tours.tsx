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

const featuredTours = [
    {
        id: 't1',
        name: 'Bali Adventure',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        rating: 4.9,
        duration: '5 Days',
        price: '$899',
        location: 'Indonesia',
    },
    {
        id: 't2',
        name: 'Swiss Alps Trek',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',
        rating: 4.8,
        duration: '7 Days',
        price: '$1,299',
        location: 'Switzerland',
    },
    {
        id: 't3',
        name: 'Tokyo Culture Tour',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
        rating: 4.7,
        duration: '4 Days',
        price: '$750',
        location: 'Japan',
    },
    {
        id: 't4',
        name: 'Santorini Escape',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
        rating: 4.9,
        duration: '6 Days',
        price: '$1,100',
        location: 'Greece',
    },
];

const categories = ['All', 'Adventure', 'Cultural', 'Beach', 'Mountain', 'City'];

export default function ToursScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Discover Tours</Text>
                    <Text style={styles.subtitle}>Find your next adventure</Text>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.text.muted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search tours..."
                        placeholderTextColor={colors.text.muted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                activeCategory === cat && styles.categoryChipActive,
                            ]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    activeCategory === cat && styles.categoryTextActive,
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Tour Cards */}
                <View style={styles.toursGrid}>
                    {featuredTours.map((tour) => (
                        <TouchableOpacity key={tour.id} style={styles.tourCard} activeOpacity={0.85}>
                            <Image source={{ uri: tour.image }} style={styles.tourImage} />
                            <View style={styles.tourInfo}>
                                <Text style={styles.tourName}>{tour.name}</Text>
                                <View style={styles.tourMeta}>
                                    <Ionicons name="location-outline" size={14} color={colors.text.muted} />
                                    <Text style={styles.tourLocation}>{tour.location}</Text>
                                </View>
                                <View style={styles.tourFooter}>
                                    <View style={styles.ratingRow}>
                                        <Ionicons name="star" size={14} color="#F59E0B" />
                                        <Text style={styles.ratingText}>{tour.rating}</Text>
                                    </View>
                                    <Text style={styles.tourDuration}>{tour.duration}</Text>
                                    <Text style={styles.tourPrice}>{tour.price}</Text>
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
    categoriesContainer: {
        paddingHorizontal: spacing.lg,
        gap: 10,
        marginBottom: spacing.lg,
    },
    categoryChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#F0ECE3',
    },
    categoryChipActive: {
        backgroundColor: '#F97316',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.muted,
    },
    categoryTextActive: {
        color: '#fff',
    },
    toursGrid: {
        paddingHorizontal: spacing.lg,
        gap: 16,
    },
    tourCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.card,
    },
    tourImage: {
        width: '100%',
        height: 180,
    },
    tourInfo: {
        padding: 16,
    },
    tourName: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text.primary,
    },
    tourMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    tourLocation: {
        fontSize: 13,
        color: colors.text.muted,
    },
    tourFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text.primary,
    },
    tourDuration: {
        fontSize: 13,
        color: colors.text.muted,
        fontWeight: '500',
    },
    tourPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#F97316',
    },
});
