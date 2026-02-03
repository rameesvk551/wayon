import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, shadows } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
    if (onPress) {
        return (
            <TouchableOpacity
                style={[styles.card, style]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.card, style]}>{children}</View>;
};

// Destination Card Component
interface DestinationCardProps {
    image: string;
    name: string;
    country: string;
    rating: number;
    price?: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
    image,
    name,
    country,
    rating,
    price,
    onPress,
    style,
}) => {
    return (
        <TouchableOpacity
            style={[styles.destinationCard, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Image source={{ uri: image }} style={styles.destinationImage} />
            <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FCD34D" />
                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
            <View style={styles.destinationInfo}>
                <Text style={styles.destinationName} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.destinationCountry}>{country}</Text>
                {price && (
                    <Text style={styles.destinationPrice}>
                        From <Text style={styles.priceValue}>{price}</Text>
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Category Chip Component
interface CategoryChipProps {
    label: string;
    icon?: string;
    selected?: boolean;
    onPress?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
    label,
    icon,
    selected = false,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {icon && (
                <Ionicons
                    name={icon as any}
                    size={16}
                    color={selected ? colors.white : colors.primary.DEFAULT}
                />
            )}
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.md,
    },
    destinationCard: {
        width: 180,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.md,
    },
    destinationImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    ratingBadge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    ratingText: {
        color: colors.white,
        fontSize: fontSize.xs,
        fontWeight: '600',
    },
    destinationInfo: {
        padding: spacing.sm,
    },
    destinationName: {
        fontSize: fontSize.base,
        fontWeight: '700',
        color: colors.text.primary,
    },
    destinationCountry: {
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginTop: 2,
    },
    destinationPrice: {
        fontSize: fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    priceValue: {
        fontSize: fontSize.base,
        fontWeight: '700',
        color: colors.primary.dark,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1.5,
        borderColor: colors.primary.DEFAULT,
        backgroundColor: colors.white,
        gap: spacing.xs,
    },
    chipSelected: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    chipText: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.primary.DEFAULT,
    },
    chipTextSelected: {
        color: colors.white,
    },
});
