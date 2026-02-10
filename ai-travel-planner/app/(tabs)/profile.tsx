import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore, useTripStore } from '../../store';
import { colors, spacing, shadows, fonts } from '../../theme';

const menuItems = [
    { id: 'edit', label: 'Edit Profile', icon: 'person-outline', route: null },
    { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', toggle: true },
    { id: 'currency', label: 'Currency', icon: 'cash-outline', value: 'USD' },
    { id: 'language', label: 'Language', icon: 'language-outline', value: 'English' },
    { id: 'payment', label: 'Payment Methods', icon: 'card-outline', route: null },
    { id: 'privacy', label: 'Privacy & Security', icon: 'shield-checkmark-outline', route: null },
    { id: 'help', label: 'Help & Support', icon: 'help-circle-outline', route: null },
    { id: 'about', label: 'About', icon: 'information-circle-outline', route: null },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { trips } = useTripStore();
    const [notifications, setNotifications] = React.useState(true);

    // Calculate dynamic stats from trips
    const stats = useMemo(() => {
        const tripCount = trips.length;
        // Extract unique countries from destinations
        const countries = new Set(
            trips.map(trip => trip.destination.split(',').pop()?.trim()).filter(Boolean)
        );
        // Count cities (destinations)
        const cities = new Set(trips.map(trip => trip.destination));

        return {
            trips: tripCount,
            countries: countries.size,
            cities: cities.size,
        };
    }, [trips]);

    const handleLogout = () => {
        logout();
        router.replace('/onboarding');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* User Card */}
                <View style={styles.userCard}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={40} color={colors.primary.DEFAULT} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.name || 'Traveler'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'hello@travel.ai'}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={18} color={colors.primary.DEFAULT} />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.trips}</Text>
                        <Text style={styles.statLabel}>Trips</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.countries}</Text>
                        <Text style={styles.statLabel}>Countries</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.cities}</Text>
                        <Text style={styles.statLabel}>Cities</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index === menuItems.length - 1 && styles.menuItemLast,
                            ]}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={styles.menuIconContainer}>
                                    <Ionicons name={item.icon as any} size={22} color={colors.primary.DEFAULT} />
                                </View>
                                <Text style={styles.menuItemLabel}>{item.label}</Text>
                            </View>
                            {item.toggle ? (
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: colors.background.tertiary, true: colors.primary.light }}
                                    thumbColor={notifications ? colors.primary.DEFAULT : colors.text.light}
                                />
                            ) : item.value ? (
                                <View style={styles.menuItemRight}>
                                    <Text style={styles.menuItemValue}>{item.value}</Text>
                                    <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
                                </View>
                            ) : (
                                <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={colors.secondary.DEFAULT} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.version}>Version 1.0.0</Text>

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
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.bodyBold,
        color: colors.text.primary,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginHorizontal: spacing.xl,
        padding: 16,
        borderRadius: 16,
        ...shadows.sm,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary.subtle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    userName: {
        fontSize: 18,
        fontFamily: fonts.bodyBold,
        color: colors.text.primary,
    },
    userEmail: {
        fontSize: 14,
        color: colors.text.muted,
        marginTop: 2,
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary.subtle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginHorizontal: spacing.xl,
        marginTop: 12,
        padding: 20,
        borderRadius: 16,
        ...shadows.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontFamily: fonts.bodyBold,
        color: colors.primary.DEFAULT,
    },
    statLabel: {
        fontSize: 13,
        color: colors.text.muted,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.background.tertiary,
    },
    menuContainer: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.xl,
        marginTop: spacing.lg,
        borderRadius: 16,
        ...shadows.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    menuItemLast: {
        borderBottomWidth: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary.subtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    menuItemLabel: {
        fontSize: 15,
        fontFamily: fonts.bodyMedium,
        color: colors.text.primary,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    menuItemValue: {
        fontSize: 14,
        color: colors.text.muted,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary.light + '20',
        marginHorizontal: spacing.xl,
        marginTop: spacing.lg,
        padding: 14,
        borderRadius: 16,
        gap: spacing.sm,
    },
    logoutText: {
        fontSize: 15,
        fontFamily: fonts.bodySemibold,
        color: colors.secondary.DEFAULT,
    },
    version: {
        textAlign: 'center',
        fontSize: 13,
        color: colors.text.light,
        marginTop: spacing.lg,
    },
});
