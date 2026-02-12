import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#F97316',
                tabBarInactiveTintColor: colors.text.muted,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },
                tabBarStyle: {
                    backgroundColor: '#F5F0E8',
                    borderTopWidth: 0,
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                    height: 88,
                    paddingBottom: 28,
                    paddingTop: 14,
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="globe-outline" size={size} color={focused ? colors.white : color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="tours"
                options={{
                    title: 'Tours',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="compass" size={size} color={focused ? colors.white : color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="hotels"
                options={{
                    title: 'Hotels',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="bed" size={size} color={focused ? colors.white : color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="visa"
                options={{
                    title: 'Visa',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="shield-checkmark-outline" size={size} color={focused ? colors.white : color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="planner"
                options={{
                    title: 'Planner',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="map" size={size} color={focused ? colors.white : color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="bot"
                options={{
                    title: 'Bot',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="chatbubble-ellipses" size={size} color={focused ? colors.white : color} />
                        </View>
                    ),
                }}
            />
            {/* Hidden tabs - still accessible but not shown in tab bar */}
            <Tabs.Screen
                name="trips"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="favorites"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="profile"
                options={{ href: null }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#F97316',
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
});
