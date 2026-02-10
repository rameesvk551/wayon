import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, fonts } from '../../theme';

// Mock favorites
const mockFavorites = [
    {
        id: '1',
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
        rating: 4.9,
        type: 'destination',
    },
    {
        id: '2',
        name: 'The Ritz Paris',
        country: 'Paris, France',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        rating: 4.8,
        type: 'hotel',
    },
    {
        id: '3',
        name: 'Venice Grand Canal',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400',
        rating: 4.7,
        type: 'destination',
    },
    {
        id: '4',
        name: 'Mount Fuji Tour',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400',
        rating: 4.9,
        type: 'activity',
    },
];

export default function FavoritesScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Favorites</Text>
                    <Text style={styles.subtitle}>{mockFavorites.length} saved items</Text>
                </View>

                {mockFavorites.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="heart-outline" size={48} color={colors.text.light} />
                        <Text style={styles.emptyTitle}>No favorites yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Save destinations, hotels, or activities to see them here.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {mockFavorites.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.favoriteCard} activeOpacity={0.9}>
                                <Image source={{ uri: item.image }} style={styles.favoriteImage} />
                                <TouchableOpacity style={styles.heartButton}>
                                    <Ionicons name="heart" size={20} color={colors.error.DEFAULT} />
                                </TouchableOpacity>
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={12} color="#FCD34D" />
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                </View>
                                <View style={styles.favoriteInfo}>
                                    <Text style={styles.favoriteName} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <View style={styles.locationRow}>
                                        <Ionicons name="location-outline" size={12} color={colors.text.muted} />
                                        <Text style={styles.favoriteCountry}>{item.country}</Text>
                                    </View>
                                    <Text style={styles.typeBadge}>
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

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
    content: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.bodyBold,
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: 14,
        color: colors.text.muted,
        marginTop: 4,
        fontFamily: fonts.body,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    favoriteCard: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        ...shadows.md,
    },
    favoriteImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        color: colors.white,
        fontSize: 11,
        fontFamily: fonts.bodySemibold,
    },
    favoriteInfo: {
        padding: 12,
    },
    favoriteName: {
        fontSize: 14,
        fontFamily: fonts.bodyBold,
        color: colors.text.primary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    favoriteCountry: {
        fontSize: 12,
        color: colors.text.muted,
    },
    typeBadge: {
        marginTop: 8,
        alignSelf: 'flex-start',
        backgroundColor: colors.primary.subtle,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 10,
        fontFamily: fonts.bodySemibold,
        color: colors.primary.hover,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        marginTop: 16,
        fontSize: 18,
        fontFamily: fonts.bodySemibold,
        color: colors.text.secondary,
    },
    emptySubtitle: {
        marginTop: 6,
        fontSize: 13,
        color: colors.text.muted,
        textAlign: 'center',
        fontFamily: fonts.body,
    },
});
