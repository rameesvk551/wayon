import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, fonts, gradients } from '../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: 10, paddingHorizontal: 16 };
            case 'lg':
                return { paddingVertical: 18, paddingHorizontal: 32 };
            default:
                return { paddingVertical: 14, paddingHorizontal: 24 };
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'sm':
                return 14;
            case 'lg':
                return 18;
            default:
                return 16;
        }
    };

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                style={[styles.buttonBase, style]}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={isDisabled ? [colors.text.light, colors.text.light] : gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradient, getSizeStyles()]}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            {icon}
                            <Text style={[styles.textPrimary, { fontSize: getTextSize() }, textStyle]}>
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.buttonBase,
                variant === 'secondary' && styles.secondary,
                variant === 'outline' && styles.outline,
                variant === 'ghost' && styles.ghost,
                getSizeStyles(),
                isDisabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.primary.DEFAULT : '#fff'} />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            variant === 'outline' && styles.textOutline,
                            variant === 'ghost' && styles.textGhost,
                            { fontSize: getTextSize() },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        borderRadius: borderRadius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    gradient: {
        borderRadius: borderRadius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    secondary: {
        backgroundColor: colors.secondary.DEFAULT,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary.DEFAULT,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        color: colors.white,
        fontFamily: fonts.bodySemibold,
    },
    textPrimary: {
        color: colors.white,
        fontFamily: fonts.bodyBold,
    },
    textOutline: {
        color: colors.primary.DEFAULT,
    },
    textGhost: {
        color: colors.text.primary,
    },
});
