import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { Button, Input } from '../../components/ui';
import { useAuthStore } from '../../store';
import { colors, fontSize, spacing, borderRadius, fonts, gradients } from '../../theme';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be 6+ characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        const success = await login(email, password);
        if (success) {
            router.replace('/(tabs)/home');
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        router.replace('/(tabs)/home');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <LinearGradient
                    colors={gradients.primary}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="airplane" size={32} color={colors.primary.DEFAULT} />
                        </View>
                        <Text style={styles.headerTitle}>Welcome Back</Text>
                        <Text style={styles.headerSubtitle}>Sign in to wayon.ai</Text>
                    </View>
                </LinearGradient>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        icon="mail-outline"
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon="lock-closed-outline"
                        error={errors.password}
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={isLoading}
                        size="lg"
                        style={styles.loginButton}
                    />

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Buttons */}
                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: spacing.xl,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        alignItems: 'center',
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: fonts.bodyBold,
        color: colors.white,
    },
    headerSubtitle: {
        fontSize: fontSize.base,
        color: 'rgba(255,255,255,0.8)',
        marginTop: spacing.xs,
    },
    formContainer: {
        flex: 1,
        padding: spacing.xl,
        paddingTop: spacing.xxl,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing.lg,
    },
    forgotPasswordText: {
        color: colors.primary.DEFAULT,
        fontSize: fontSize.sm,
        fontFamily: fonts.bodyMedium,
    },
    loginButton: {
        marginTop: spacing.sm,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.background.tertiary,
    },
    dividerText: {
        marginHorizontal: spacing.md,
        color: colors.text.muted,
        fontSize: fontSize.sm,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.background.tertiary,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xxl,
    },
    signupText: {
        color: colors.text.secondary,
        fontSize: fontSize.base,
    },
    signupLink: {
        color: colors.primary.DEFAULT,
        fontSize: fontSize.base,
        fontFamily: fonts.bodyBold,
    },
});
