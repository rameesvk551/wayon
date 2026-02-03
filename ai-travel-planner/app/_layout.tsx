import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store';
import { colors } from '../theme';

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated, token } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Simulate checking auth state
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inTabsGroup = segments[0] === '(tabs)';

        if (!isAuthenticated && inTabsGroup) {
            // Redirect to onboarding if not authenticated
            router.replace('/onboarding');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to home if authenticated
            router.replace('/(tabs)/home');
        }
    }, [isAuthenticated, segments, isReady]);

    if (!isReady) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.DEFAULT,
    },
});
