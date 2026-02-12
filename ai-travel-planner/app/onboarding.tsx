import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui';
import { colors, fontSize, spacing, fonts, gradients } from '../theme';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    colors: readonly [string, string];
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'wayon.ai',
        subtitle: 'Discover the World',
        description:
            'Explore amazing destinations around the world with personalized AI-powered recommendations.',
        icon: 'airplane',
        colors: gradients.primary,
    },
    {
        id: '2',
        title: 'Journey',
        subtitle: 'Plan Your Adventure',
        description:
            'Let wayon.ai create the perfect itinerary tailored to your interests, budget, and travel style.',
        icon: 'map',
        colors: gradients.accent,
    },
    {
        id: '3',
        title: 'Traveler',
        subtitle: 'Start Your Trip',
        description:
            'From flights to hotels, experience seamless travel planning all in one place with wayon.ai.',
        icon: 'compass',
        colors: gradients.primary,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/login');
    };

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
        <View style={styles.slide}>
            <LinearGradient
                colors={item.colors}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name={item.icon as any} size={80} color="rgba(255,255,255,0.9)" />
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {slides.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.8, 1.4, 0.8],
                    extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.4, 1, 0.4],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                transform: [{ scale }],
                                opacity,
                                backgroundColor:
                                    index === currentIndex ? colors.primary.DEFAULT : colors.text.light,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />

            {renderDots()}

            <View style={styles.buttonContainer}>
                <Button
                    title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    onPress={handleNext}
                    size="lg"
                    icon={
                        <Ionicons
                            name={currentIndex === slides.length - 1 ? 'rocket' : 'arrow-forward'}
                            size={20}
                            color={colors.white}
                        />
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 10,
    },
    skipText: {
        fontSize: fontSize.base,
        color: colors.text.muted,
        fontWeight: '500',
    },
    slide: {
        width,
        alignItems: 'center',
    },
    gradient: {
        width: width,
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontFamily: fonts.displayBold,
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: fontSize.xl,
        fontFamily: fonts.bodySemibold,
        color: colors.primary.DEFAULT,
        marginTop: spacing.sm,
    },
    description: {
        fontSize: fontSize.base,
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: spacing.lg,
        lineHeight: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    buttonContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
});
