import Redis from 'ioredis';
import { env, CACHE_TTL } from '../config/env.js';

// Redis client with error handling
let redis: Redis | null = null;

export async function initRedis(): Promise<void> {
    try {
        redis = new Redis(env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });

        await redis.connect();
        console.log('✅ Redis connected successfully');
    } catch (error) {
        console.warn('⚠️ Redis connection failed, using in-memory fallback');
        redis = null;
    }
}

// In-memory fallback cache
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

function cleanMemoryCache(): void {
    const now = Date.now();
    for (const [key, entry] of memoryCache.entries()) {
        if (entry.expiresAt < now) {
            memoryCache.delete(key);
        }
    }
}

// Periodic cleanup every 5 minutes
setInterval(cleanMemoryCache, 5 * 60 * 1000);

/**
 * Get cached value by key
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
    try {
        if (redis) {
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        }

        // In-memory fallback
        const entry = memoryCache.get(key);
        if (entry && entry.expiresAt > Date.now()) {
            return JSON.parse(entry.value);
        }
        return null;
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
}

/**
 * Set cached value with TTL
 */
export async function cacheSet<T>(
    key: string,
    value: T,
    ttlSeconds: number = CACHE_TTL.hotels
): Promise<void> {
    try {
        const serialized = JSON.stringify(value);

        if (redis) {
            await redis.setex(key, ttlSeconds, serialized);
        } else {
            // In-memory fallback
            memoryCache.set(key, {
                value: serialized,
                expiresAt: Date.now() + ttlSeconds * 1000,
            });
        }
    } catch (error) {
        console.error('Cache set error:', error);
    }
}

/**
 * Delete cached value
 */
export async function cacheDelete(key: string): Promise<void> {
    try {
        if (redis) {
            await redis.del(key);
        } else {
            memoryCache.delete(key);
        }
    } catch (error) {
        console.error('Cache delete error:', error);
    }
}

/**
 * Generate cache key with prefix
 */
export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}:${JSON.stringify(params[key])}`)
        .join('|');
    return `trip-planner:${prefix}:${sortedParams}`;
}

/**
 * Cached fetch wrapper - checks cache first, fetches if not found
 */
export async function cachedFetch<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number
): Promise<T> {
    // Try cache first
    const cached = await cacheGet<T>(cacheKey);
    if (cached !== null) {
        return cached;
    }

    // Fetch and cache
    const result = await fetchFn();
    await cacheSet(cacheKey, result, ttlSeconds);
    return result;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}
