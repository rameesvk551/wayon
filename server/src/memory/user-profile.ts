import { cacheGet, cacheSet } from '../cache/redis.js';
import { CACHE_TTL } from '../config/env.js';

/**
 * User profile interface
 */
export interface UserProfile {
    id: string;
    passportCountry?: string;
    homeCity?: string;
    preferredCurrency?: string;
    travelPreferences?: {
        budgetLevel?: 'budget' | 'mid-range' | 'luxury';
        travelStyle?: 'adventure' | 'relaxation' | 'cultural' | 'mixed';
        accommodation?: 'hotel' | 'hostel' | 'resort' | 'apartment';
        dietaryRestrictions?: string[];
    };
    pastDestinations?: string[];
    wishlist?: string[];
    createdAt: number;
    updatedAt: number;
}

/**
 * Get or create user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
    const cached = await cacheGet<UserProfile>(`user-profile:${userId}`);
    if (cached) {
        return cached;
    }

    // Create new profile
    const profile: UserProfile = {
        id: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    await saveUserProfile(profile);
    return profile;
}

/**
 * Save user profile
 */
async function saveUserProfile(profile: UserProfile): Promise<void> {
    profile.updatedAt = Date.now();
    await cacheSet(
        `user-profile:${profile.id}`,
        profile,
        CACHE_TTL.conversation
    );
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<UserProfile> {
    const profile = await getUserProfile(userId);

    // Merge updates
    Object.assign(profile, updates);

    // Handle nested preferences
    if (updates.travelPreferences) {
        profile.travelPreferences = {
            ...profile.travelPreferences,
            ...updates.travelPreferences,
        };
    }

    await saveUserProfile(profile);
    return profile;
}

/**
 * Add destination to past destinations
 */
export async function addPastDestination(
    userId: string,
    destination: string
): Promise<void> {
    const profile = await getUserProfile(userId);

    if (!profile.pastDestinations) {
        profile.pastDestinations = [];
    }

    if (!profile.pastDestinations.includes(destination)) {
        profile.pastDestinations.push(destination);
        await saveUserProfile(profile);
    }
}

/**
 * Add destination to wishlist
 */
export async function addToWishlist(
    userId: string,
    destination: string
): Promise<void> {
    const profile = await getUserProfile(userId);

    if (!profile.wishlist) {
        profile.wishlist = [];
    }

    if (!profile.wishlist.includes(destination)) {
        profile.wishlist.push(destination);
        await saveUserProfile(profile);
    }
}

/**
 * Get profile context for LLM
 */
export async function getProfileContext(userId: string): Promise<string> {
    const profile = await getUserProfile(userId);

    const parts: string[] = [];

    if (profile.passportCountry) {
        parts.push(`Passport: ${profile.passportCountry}`);
    }

    if (profile.homeCity) {
        parts.push(`From: ${profile.homeCity}`);
    }

    if (profile.travelPreferences?.budgetLevel) {
        parts.push(`Budget: ${profile.travelPreferences.budgetLevel}`);
    }

    if (profile.travelPreferences?.travelStyle) {
        parts.push(`Style: ${profile.travelPreferences.travelStyle}`);
    }

    if (profile.pastDestinations?.length) {
        parts.push(`Past trips: ${profile.pastDestinations.join(', ')}`);
    }

    if (parts.length === 0) {
        return '';
    }

    return `[User context: ${parts.join(' | ')}]`;
}
