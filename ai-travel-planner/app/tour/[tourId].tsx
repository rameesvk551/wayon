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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockTours } from '../../data/tourListingData';
import { colors, spacing, shadows, fonts } from '../../theme';

export default function TourDetailScreen() {
    const router = useRouter();
    const { tourId } = useLocalSearchParams<{ tourId: string }>();
    const tour = mockTours.find((item) => item.id === tourId);

    if (!tour) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>Tour not found</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Image source={{ uri: tour.images[0] }} style={styles.heroImage} />
                    <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{tour.name}</Text>
                    <Text style={styles.subtitle}>
                        {tour.location}, {tour.country} • {tour.duration}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaPill}>⭐ {tour.rating}</Text>
                        <Text style={styles.metaPill}>👥 Group {tour.groupSize}</Text>
                        <Text style={styles.metaPill}>🎯 {tour.category}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.paragraph}>{tour.description}</Text>

                    <Text style={styles.sectionTitle}>Highlights</Text>
                    {tour.highlights.map((item) => (
                        <Text key={item} style={styles.bullet}>
                            • {item}
                        </Text>
                    ))}

                    <Text style={styles.sectionTitle}>Included</Text>
                    {tour.included.map((item) => (
                        <Text key={item} style={styles.bullet}>
                            • {item}
                        </Text>
                    ))}

                    <View style={styles.bookingCard}>
                        <Text style={styles.bookingPrice}>
                            {tour.currency}{tour.price} <Text style={styles.bookingUnit}>per person</Text>
                        </Text>
                        <TouchableOpacity style={styles.bookingButton}>
                            <Text style={styles.bookingButtonText}>Book This Tour</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    hero: {
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: 270,
    },
    backIconButton: {
        position: 'absolute',
        top: 14,
        left: 14,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: spacing.lg,
    },
    title: {
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
        fontSize: 24,
    },
    subtitle: {
        marginTop: 4,
        color: colors.text.muted,
        fontFamily: fonts.body,
        fontSize: 13,
    },
    metaRow: {
        marginTop: spacing.md,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    metaPill: {
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        paddingHorizontal: 10,
        paddingVertical: 6,
        color: colors.text.secondary,
        fontFamily: fonts.bodySemibold,
        fontSize: 12,
    },
    sectionTitle: {
        marginTop: spacing.lg,
        marginBottom: 8,
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
        fontSize: 16,
    },
    paragraph: {
        color: colors.text.secondary,
        fontFamily: fonts.body,
        fontSize: 13,
        lineHeight: 20,
    },
    bullet: {
        marginBottom: 5,
        color: colors.text.secondary,
        fontFamily: fonts.body,
        fontSize: 13,
    },
    bookingCard: {
        marginTop: spacing.xl,
        borderRadius: 16,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        padding: 14,
        ...shadows.sm,
    },
    bookingPrice: {
        color: colors.primary.DEFAULT,
        fontSize: 28,
        fontFamily: fonts.bodyBold,
    },
    bookingUnit: {
        color: colors.text.muted,
        fontSize: 13,
        fontFamily: fonts.body,
    },
    bookingButton: {
        marginTop: 12,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookingButtonText: {
        color: colors.white,
        fontFamily: fonts.bodySemibold,
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyTitle: {
        color: colors.text.primary,
        fontFamily: fonts.bodyBold,
        fontSize: 18,
    },
    backButton: {
        marginTop: 12,
        borderRadius: 12,
        backgroundColor: colors.primary.DEFAULT,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    backButtonText: {
        color: colors.white,
        fontFamily: fonts.bodySemibold,
    },
    bottomSpacer: {
        height: 60,
    },
});
