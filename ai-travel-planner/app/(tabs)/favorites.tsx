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
import { Card } from '../../components/ui';
import { colors, fontSize, spacing, borderRadius, shadows } from '../../theme';

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
            <View style={styles.header}>
                <Text style={styles.title}>Favorites</Text>
                <Text style={styles.subtitle}>{mockFavorites.length} saved items</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                <View style={styles.grid}>
                    {mockFavorites.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.favoriteCard} activeOpacity={0.9}>
                            <Image source={{ uri: item.image }} style={styles.favoriteImage} />
                            <TouchableOpacity style={styles.heartButton}>
                                <Ionicons name="heart" size={24} color={colors.secondary.DEFAULT} />
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
                                    <Ionicons name="location" size={12} color={colors.text.muted} />
                                    <Text style={styles.favoriteCountry}>{item.country}</Text>
                                </View>
                                <View style={styles.typeBadge}>
                                    <Text style={styles.typeText}>
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
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
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
    },
    title: {
        fontSize: fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginTop: 2,
    },
    content: {
        flex: 1,
        paddingTop: spacing.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    favoriteCard: {
        width: '47%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
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
        top: spacing.sm,
        right: spacing.sm,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        gap: 2,
    },
    ratingText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '600',
    },
    favoriteInfo: {
        padding: spacing.sm,
    },
    favoriteName: {
        fontSize: fontSize.base,
        fontWeight: '700',
        color: colors.text.primary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 2,
    },
    favoriteCountry: {
        fontSize: fontSize.xs,
        color: colors.text.muted,
    },
    typeBadge: {
        marginTop: spacing.xs,
        alignSelf: 'flex-start',
        backgroundColor: colors.primary.subtle,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.primary.dark,
    },
});
