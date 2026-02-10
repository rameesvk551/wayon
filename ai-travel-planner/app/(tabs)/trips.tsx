import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { useTripStore } from '../../store';
import { Card } from '../../components/ui';
import { colors, spacing, shadows, fonts } from '../../theme';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'upcoming':
            return colors.primary.DEFAULT;
        case 'planned':
            return colors.accent.DEFAULT;
        case 'completed':
            return colors.text.muted;
        default:
            return colors.text.secondary;
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'upcoming':
            return 'Upcoming';
        case 'planned':
            return 'Planned';
        case 'completed':
            return 'Completed';
        default:
            return status;
    }
};

const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

const getDaysDiff = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

export default function TripsScreen() {
    const router = useRouter();
    const { trips } = useTripStore();
    const [activeTab, setActiveTab] = React.useState<'all' | 'upcoming' | 'completed'>('all');

    const displayTrips = trips.filter((trip) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'upcoming') return trip.status === 'upcoming' || trip.status === 'planned';
        return trip.status === 'completed';
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Trips</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add" size={20} color={colors.white} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {['all', 'upcoming', 'completed'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab as any)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Trips List */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {displayTrips.map((trip) => (
                    <TouchableOpacity key={trip.id} activeOpacity={0.9}>
                        <Card style={styles.tripCard}>
                            <Image
                                source={{ uri: trip.image || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400` }}
                                style={styles.tripImage}
                            />
                            <View style={styles.statusBadge}>
                                <View
                                    style={[
                                        styles.statusDot,
                                        { backgroundColor: getStatusColor(trip.status) },
                                    ]}
                                />
                                <Text
                                    style={[styles.statusText, { color: getStatusColor(trip.status) }]}
                                >
                                    {getStatusLabel(trip.status)}
                                </Text>
                            </View>
                            <View style={styles.tripInfo}>
                                <Text style={styles.tripDestination}>{trip.destination}</Text>
                                <View style={styles.tripMeta}>
                                    <Ionicons name="calendar-outline" size={14} color={colors.text.muted} />
                                    <Text style={styles.tripDates}>{formatDate(trip.startDate, trip.endDate)}</Text>
                                </View>
                                <View style={styles.tripDetails}>
                                    <View style={styles.tripDetail}>
                                        <Ionicons name="time-outline" size={16} color={colors.primary.DEFAULT} />
                                        <Text style={styles.tripDetailText}>{getDaysDiff(trip.startDate, trip.endDate)} days</Text>
                                    </View>
                                    <View style={styles.tripDetail}>
                                        <Ionicons name="wallet-outline" size={16} color={colors.primary.DEFAULT} />
                                        <Text style={styles.tripDetailText}>${trip.budget.toLocaleString()}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                {displayTrips.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="briefcase-outline" size={64} color={colors.text.light} />
                        <Text style={styles.emptyTitle}>No trips yet</Text>
                        <Text style={styles.emptySubtitle}>Start planning your next adventure!</Text>
                    </View>
                )}

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.bodyBold,
        color: colors.text.primary,
    },
    addBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: spacing.xl,
        gap: 8,
        marginBottom: spacing.lg,
    },
    tab: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: colors.background.secondary,
    },
    tabActive: {
        backgroundColor: colors.primary.DEFAULT,
    },
    tabText: {
        fontSize: 14,
        fontFamily: fonts.bodySemibold,
        color: colors.text.muted,
    },
    tabTextActive: {
        color: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },
    tripCard: {
        marginBottom: 16,
        padding: 0,
        overflow: 'hidden',
        borderRadius: 16,
    },
    tripImage: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontFamily: fonts.bodySemibold,
    },
    tripInfo: {
        padding: 16,
    },
    tripDestination: {
        fontSize: 18,
        fontFamily: fonts.bodyBold,
        color: colors.text.primary,
    },
    tripMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    tripDates: {
        fontSize: 13,
        color: colors.text.muted,
    },
    tripDetails: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 12,
    },
    tripDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tripDetailText: {
        fontSize: 14,
        fontFamily: fonts.bodySemibold,
        color: colors.text.secondary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: fonts.bodySemibold,
        color: colors.text.secondary,
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 13,
        color: colors.text.muted,
        marginTop: 4,
    },
});
