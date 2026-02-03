import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate after animation
        const timer = setTimeout(onFinish, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={['#00C9A7', '#0D9488', '#115E59']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View style={styles.iconCircle}>
                    <Ionicons name="airplane" size={48} color={colors.primary.DEFAULT} />
                </View>
                <Text style={styles.title}>TravelAI</Text>
                <Text style={styles.subtitle}>Your AI Travel Companion</Text>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={styles.footerText}>Powered by AI</Text>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 40,
        fontWeight: '800',
        color: colors.white,
        marginTop: 24,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: fontSize.lg,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 60,
    },
    footerText: {
        fontSize: fontSize.sm,
        color: 'rgba(255,255,255,0.6)',
    },
});

export default SplashScreen;
