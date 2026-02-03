import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface InputProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    label?: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    icon?: string;
    style?: ViewStyle;
    multiline?: boolean;
    numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
    placeholder,
    value,
    onChangeText,
    label,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    icon,
    style,
    multiline = false,
    numberOfLines = 1,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {icon && (
                    <Ionicons
                        name={icon as any}
                        size={20}
                        color={isFocused ? colors.primary.DEFAULT : colors.text.muted}
                        style={styles.icon}
                    />
                )}

                <RNTextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.text.light}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[
                        styles.input,
                        multiline && { textAlignVertical: 'top', minHeight: numberOfLines * 24 },
                    ]}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.text.muted}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: colors.background.tertiary,
        paddingHorizontal: spacing.md,
    },
    inputFocused: {
        borderColor: colors.primary.DEFAULT,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 2,
    },
    inputError: {
        borderColor: colors.secondary.DEFAULT,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        fontSize: fontSize.base,
        color: colors.text.primary,
    },
    eyeIcon: {
        padding: spacing.xs,
    },
    error: {
        fontSize: fontSize.xs,
        color: colors.secondary.DEFAULT,
        marginTop: spacing.xs,
    },
});
