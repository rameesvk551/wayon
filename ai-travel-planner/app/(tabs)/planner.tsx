import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, CategoryChip } from '../../components/ui';
import { useTripStore } from '../../store';
import { colors, fontSize, spacing, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

// Wizard step configuration
const steps = [
    { id: 0, title: 'Destination', subtitle: 'Where to?' },
    { id: 1, title: 'Duration', subtitle: 'How long?' },
    { id: 2, title: 'Companions', subtitle: 'Who with?' },
    { id: 3, title: 'Budget', subtitle: 'How much?' },
    { id: 4, title: 'Style', subtitle: 'Travel style?' },
    { id: 5, title: 'Interests', subtitle: 'What to do?' },
];

const durations = [
    { id: 'weekend', label: 'Weekend', days: '2-3 days', icon: 'flash-outline' },
    { id: '1-week', label: '1 Week', days: '7 days', icon: 'calendar-outline' },
    { id: '2-weeks', label: '2 Weeks', days: '14 days', icon: 'calendar' },
    { id: 'month', label: 'Month+', days: '30+ days', icon: 'time-outline' },
];

const companions = [
    { id: 'solo', label: 'Solo', icon: 'person-outline', desc: 'Just me' },
    { id: 'couple', label: 'Couple', icon: 'heart-outline', desc: 'Romantic getaway' },
    { id: 'family', label: 'Family', icon: 'people-outline', desc: 'With kids' },
    { id: 'friends', label: 'Friends', icon: 'happy-outline', desc: 'Group trip' },
];

const travelStyles = [
    { id: 'budget', label: 'Budget', icon: 'wallet-outline', color: '#22C55E' },
    { id: 'mid-range', label: 'Mid-Range', icon: 'card-outline', color: '#3B82F6' },
    { id: 'luxury', label: 'Luxury', icon: 'diamond-outline', color: '#A855F7' },
    { id: 'adventure', label: 'Adventure', icon: 'compass-outline', color: '#F97316' },
];

const interests = [
    { id: 'adventure', label: 'Adventure', icon: 'rocket-outline' },
    { id: 'culture', label: 'Culture', icon: 'library-outline' },
    { id: 'food', label: 'Food & Drink', icon: 'restaurant-outline' },
    { id: 'nature', label: 'Nature', icon: 'leaf-outline' },
    { id: 'nightlife', label: 'Nightlife', icon: 'moon-outline' },
    { id: 'shopping', label: 'Shopping', icon: 'bag-outline' },
    { id: 'photography', label: 'Photography', icon: 'camera-outline' },
    { id: 'wellness', label: 'Wellness', icon: 'fitness-outline' },
    { id: 'history', label: 'History', icon: 'time-outline' },
    { id: 'beach', label: 'Beach', icon: 'sunny-outline' },
];

const popularDestinations = [
    { id: '1', name: 'Paris, France', emoji: '🗼' },
    { id: '2', name: 'Tokyo, Japan', emoji: '🗾' },
    { id: '3', name: 'Bali, Indonesia', emoji: '🏝️' },
    { id: '4', name: 'Dubai, UAE', emoji: '🏙️' },
    { id: '5', name: 'New York, USA', emoji: '🗽' },
];

export default function PlannerScreen() {
    const router = useRouter();
    const {
        wizardData,
        currentStep,
        totalSteps,
        setDestination,
        setDuration,
        setCompanions,
        setBudget,
        setTravelStyle,
        toggleInterest,
        nextStep,
        prevStep,
        generateTrip,
        isGenerating,
    } = useTripStore();

    const [destinationInput, setDestinationInput] = useState(wizardData.destination || '');
    const [budgetInput, setBudgetInput] = useState(wizardData.budget?.toString() || '');

    const handleDestinationChange = (text: string) => {
        setDestinationInput(text);
        setDestination(text);
    };

    const handleBudgetChange = (text: string) => {
        setBudgetInput(text);
        const num = parseInt(text, 10);
        if (!isNaN(num)) setBudget(num);
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return !!wizardData.destination;
            case 1: return !!wizardData.duration;
            case 2: return !!wizardData.companions;
            case 3: return !!wizardData.budget;
            case 4: return !!wizardData.travelStyle;
            case 5: return wizardData.interests.length >= 2;
            default: return false;
        }
    };

    const handleNext = async () => {
        if (currentStep < totalSteps - 1) {
            nextStep();
        } else {
            // Generate trip
            const trip = await generateTrip();
            if (trip) {
                router.push('/(tabs)/trips');
            }
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View style={styles.stepContent}>
                        {/* Search Input */}
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={22} color={colors.text.muted} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search destinations..."
                                placeholderTextColor={colors.text.light}
                                value={destinationInput}
                                onChangeText={handleDestinationChange}
                            />
                        </View>

                        {/* Popular Destinations */}
                        <Text style={styles.sectionLabel}>Popular Destinations</Text>
                        <View style={styles.chipsGrid}>
                            {popularDestinations.map((dest) => (
                                <TouchableOpacity
                                    key={dest.id}
                                    style={[
                                        styles.destinationChip,
                                        wizardData.destination === dest.name && styles.destinationChipSelected,
                                    ]}
                                    onPress={() => {
                                        setDestinationInput(dest.name);
                                        setDestination(dest.name);
                                    }}
                                >
                                    <Text style={styles.chipEmoji}>{dest.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.chipLabel,
                                            wizardData.destination === dest.name && styles.chipLabelSelected,
                                        ]}
                                    >
                                        {dest.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 1:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.optionsGrid}>
                            {durations.map((dur) => (
                                <TouchableOpacity
                                    key={dur.id}
                                    style={[
                                        styles.optionCard,
                                        wizardData.duration === dur.id && styles.optionCardSelected,
                                    ]}
                                    onPress={() => setDuration(dur.id)}
                                >
                                    <Ionicons
                                        name={dur.icon as any}
                                        size={32}
                                        color={wizardData.duration === dur.id ? colors.white : colors.primary.DEFAULT}
                                    />
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            wizardData.duration === dur.id && styles.optionLabelSelected,
                                        ]}
                                    >
                                        {dur.label}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.optionDesc,
                                            wizardData.duration === dur.id && styles.optionDescSelected,
                                        ]}
                                    >
                                        {dur.days}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.optionsGrid}>
                            {companions.map((comp) => (
                                <TouchableOpacity
                                    key={comp.id}
                                    style={[
                                        styles.optionCard,
                                        wizardData.companions === comp.id && styles.optionCardSelected,
                                    ]}
                                    onPress={() => setCompanions(comp.id as any)}
                                >
                                    <Ionicons
                                        name={comp.icon as any}
                                        size={32}
                                        color={wizardData.companions === comp.id ? colors.white : colors.primary.DEFAULT}
                                    />
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            wizardData.companions === comp.id && styles.optionLabelSelected,
                                        ]}
                                    >
                                        {comp.label}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.optionDesc,
                                            wizardData.companions === comp.id && styles.optionDescSelected,
                                        ]}
                                    >
                                        {comp.desc}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 3:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.budgetContainer}>
                            <Text style={styles.budgetLabel}>Total Budget (USD)</Text>
                            <View style={styles.budgetInputContainer}>
                                <Text style={styles.currencySymbol}>$</Text>
                                <TextInput
                                    style={styles.budgetInput}
                                    placeholder="1000"
                                    placeholderTextColor={colors.text.light}
                                    value={budgetInput}
                                    onChangeText={handleBudgetChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.budgetPresets}>
                                {[500, 1000, 2000, 5000].map((amount) => (
                                    <TouchableOpacity
                                        key={amount}
                                        style={[
                                            styles.budgetPreset,
                                            wizardData.budget === amount && styles.budgetPresetSelected,
                                        ]}
                                        onPress={() => {
                                            setBudgetInput(amount.toString());
                                            setBudget(amount);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.budgetPresetText,
                                                wizardData.budget === amount && styles.budgetPresetTextSelected,
                                            ]}
                                        >
                                            ${amount}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                );

            case 4:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.optionsGrid}>
                            {travelStyles.map((style) => (
                                <TouchableOpacity
                                    key={style.id}
                                    style={[
                                        styles.optionCard,
                                        wizardData.travelStyle === style.id && {
                                            ...styles.optionCardSelected,
                                            backgroundColor: style.color,
                                        },
                                    ]}
                                    onPress={() => setTravelStyle(style.id as any)}
                                >
                                    <Ionicons
                                        name={style.icon as any}
                                        size={32}
                                        color={wizardData.travelStyle === style.id ? colors.white : style.color}
                                    />
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            wizardData.travelStyle === style.id && styles.optionLabelSelected,
                                        ]}
                                    >
                                        {style.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 5:
                return (
                    <View style={styles.stepContent}>
                        <Text style={styles.sectionLabel}>
                            Select at least 2 interests ({wizardData.interests.length} selected)
                        </Text>
                        <View style={styles.interestsGrid}>
                            {interests.map((interest) => (
                                <TouchableOpacity
                                    key={interest.id}
                                    style={[
                                        styles.interestChip,
                                        wizardData.interests.includes(interest.id) && styles.interestChipSelected,
                                    ]}
                                    onPress={() => toggleInterest(interest.id)}
                                >
                                    <Ionicons
                                        name={interest.icon as any}
                                        size={18}
                                        color={
                                            wizardData.interests.includes(interest.id)
                                                ? colors.white
                                                : colors.primary.DEFAULT
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.interestLabel,
                                            wizardData.interests.includes(interest.id) && styles.interestLabelSelected,
                                        ]}
                                    >
                                        {interest.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#00C9A7', '#0D9488']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity onPress={() => currentStep > 0 && prevStep()}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={currentStep > 0 ? colors.white : 'transparent'}
                    />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{steps[currentStep].title}</Text>
                    <Text style={styles.headerSubtitle}>{steps[currentStep].subtitle}</Text>
                </View>
                <View style={{ width: 24 }} />
            </LinearGradient>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((currentStep + 1) / totalSteps) * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    Step {currentStep + 1} of {totalSteps}
                </Text>
            </View>

            {/* Step Content */}
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {renderStepContent()}
            </ScrollView>

            {/* Navigation */}
            <View style={styles.footer}>
                <Button
                    title={currentStep === totalSteps - 1 ? 'Generate Trip' : 'Continue'}
                    onPress={handleNext}
                    disabled={!canProceed()}
                    loading={isGenerating}
                    size="lg"
                    icon={
                        <Ionicons
                            name={currentStep === totalSteps - 1 ? 'sparkles' : 'arrow-forward'}
                            size={20}
                            color={colors.white}
                        />
                    }
                />
            </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontSize['2xl'],
        fontWeight: '700',
        color: colors.white,
    },
    headerSubtitle: {
        fontSize: fontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    progressContainer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.background.tertiary,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 3,
    },
    progressText: {
        fontSize: fontSize.xs,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    scrollContent: {
        flex: 1,
    },
    stepContent: {
        padding: spacing.xl,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: fontSize.base,
        color: colors.text.primary,
        paddingVertical: spacing.sm,
    },
    sectionLabel: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.text.muted,
        marginBottom: spacing.md,
    },
    chipsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    destinationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.background.tertiary,
        gap: spacing.xs,
    },
    destinationChipSelected: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    chipEmoji: {
        fontSize: 18,
    },
    chipLabel: {
        fontSize: fontSize.sm,
        fontWeight: '500',
        color: colors.text.secondary,
    },
    chipLabelSelected: {
        color: colors.white,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    optionCard: {
        width: (width - spacing.xl * 2 - spacing.md) / 2,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        ...shadows.sm,
    },
    optionCardSelected: {
        backgroundColor: colors.primary.DEFAULT,
    },
    optionLabel: {
        fontSize: fontSize.base,
        fontWeight: '700',
        color: colors.text.primary,
        marginTop: spacing.sm,
    },
    optionLabelSelected: {
        color: colors.white,
    },
    optionDesc: {
        fontSize: fontSize.xs,
        color: colors.text.muted,
        marginTop: 2,
    },
    optionDescSelected: {
        color: 'rgba(255,255,255,0.8)',
    },
    budgetContainer: {
        alignItems: 'center',
    },
    budgetLabel: {
        fontSize: fontSize.base,
        fontWeight: '600',
        color: colors.text.secondary,
        marginBottom: spacing.lg,
    },
    budgetInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        ...shadows.md,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
    },
    budgetInput: {
        fontSize: 40,
        fontWeight: '700',
        color: colors.text.primary,
        minWidth: 120,
        textAlign: 'center',
    },
    budgetPresets: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.xl,
    },
    budgetPreset: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.background.tertiary,
    },
    budgetPresetSelected: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    budgetPresetText: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    budgetPresetTextSelected: {
        color: colors.white,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    interestChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.primary.DEFAULT,
        gap: spacing.xs,
    },
    interestChipSelected: {
        backgroundColor: colors.primary.DEFAULT,
    },
    interestLabel: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.primary.DEFAULT,
    },
    interestLabelSelected: {
        color: colors.white,
    },
    footer: {
        padding: spacing.xl,
        paddingBottom: spacing.xxl,
        backgroundColor: colors.white,
        ...shadows.lg,
    },
});
