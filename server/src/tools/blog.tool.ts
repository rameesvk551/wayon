import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * Fallback blog data when service is unavailable
 */
const FALLBACK_BLOGS = [
    {
        id: 'blog-1',
        title: 'Top 10 Travel Tips for First-Time Travelers',
        slug: 'travel-tips-first-time',
        excerpt: 'Essential tips every new traveler should know before their first trip abroad.',
        category: 'Travel Tips',
        author: 'Travel Expert',
        publishedAt: new Date().toISOString(),
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
    },
    {
        id: 'blog-2',
        title: 'Best Budget Destinations for 2024',
        slug: 'budget-destinations-2024',
        excerpt: 'Discover amazing places you can visit without breaking the bank.',
        category: 'Budget Travel',
        author: 'Budget Traveler',
        publishedAt: new Date().toISOString(),
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
    },
    {
        id: 'blog-3',
        title: 'How to Pack Light for Any Trip',
        slug: 'pack-light-tips',
        excerpt: 'Master the art of minimalist packing with these proven strategies.',
        category: 'Packing',
        author: 'Minimalist Explorer',
        publishedAt: new Date().toISOString(),
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400',
    },
];

/**
 * Blog search tool for travel content
 */
export const blogTool: Tool = {
    name: 'get_travel_articles',
    description: 'Get relevant travel blog articles and tips for a destination or topic',
    parameters: {
        topic: {
            type: 'string',
            description: 'Topic or destination to find articles about (e.g., "Thailand", "budget travel", "packing tips")',
        },
        category: {
            type: 'string',
            description: 'Blog category to filter by',
            enum: ['Travel Tips', 'Destinations', 'Budget Travel', 'Packing', 'Food & Culture'],
        },
        limit: {
            type: 'number',
            description: 'Maximum number of articles to return',
        },
    },
    required: ['topic'],

    async execute(params): Promise<ToolResult> {
        const { topic, category, limit = 5 } = params as {
            topic: string;
            category?: string;
            limit?: number;
        };

        const cacheKey = generateCacheKey('blogs', {
            topic: topic.toLowerCase(),
            category,
            limit,
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Build query string
                    const queryParams = new URLSearchParams({
                        limit: String(limit),
                    });

                    // Try to fetch featured blogs from blog service
                    const result = await fetchFromService<{
                        blogs?: Array<unknown>;
                        posts?: Array<unknown>;
                    }>(
                        SERVICE_URLS.blog,
                        `/api/blog/featured?${queryParams.toString()}`
                    );

                    if (result.success && (result.data?.blogs || result.data?.posts)) {
                        const articles = result.data.blogs || result.data.posts || [];
                        return {
                            success: true,
                            data: {
                                topic,
                                articles: articles.slice(0, limit),
                            },
                            source: 'api' as const,
                        };
                    }

                    // Use fallback data
                    let filteredBlogs = FALLBACK_BLOGS;
                    if (category) {
                        filteredBlogs = filteredBlogs.filter(
                            (blog) => blog.category.toLowerCase() === category.toLowerCase()
                        );
                    }

                    return {
                        success: true,
                        data: {
                            topic,
                            articles: filteredBlogs.slice(0, limit),
                        },
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.attractions // Reuse attractions TTL (1 hour)
            );

            return data as ToolResult;
        } catch (error) {
            // Return fallback on any error
            return {
                success: true,
                data: {
                    topic,
                    articles: FALLBACK_BLOGS.slice(0, limit as number),
                },
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(blogTool);
