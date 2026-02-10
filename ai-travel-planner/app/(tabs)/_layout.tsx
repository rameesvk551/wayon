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
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.white,
                tabBarInactiveTintColor: colors.text.muted,
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
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="home" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="planner"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="grid" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="trips"
                options={{
                    title: 'My Trips',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="briefcase" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="heart" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
                            <Ionicons name="person" size={size} color={color} />
                        </View>
                    ),
                }}
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
