import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { initRedis, closeRedis } from './cache/redis.js';
import { initRetriever } from './rag/retriever.js';
import { chatHandler, streamChatHandler, healthHandler } from './api/chat.controller.js';

// Import tools to register them
import './tools/index.js';

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/health', healthHandler);
app.post('/api/chat', chatHandler);
app.post('/api/chat/stream', streamChatHandler);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        blocks: [
            {
                type: 'alert',
                level: 'error',
                text: 'An unexpected error occurred. Please try again.',
                title: 'Error',
            },
        ],
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Graceful shutdown
async function shutdown(): Promise<void> {
    console.log('\n🛑 Shutting down...');
    await closeRedis();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
async function start(): Promise<void> {
    console.log('🚀 Starting AI Trip Planner Server...\n');

    // Initialize services
    await initRedis();
    await initRetriever();

    // Start listening
    app.listen(env.PORT, () => {
        console.log(`\n✅ Server running on http://localhost:${env.PORT}`);
        console.log(`   Environment: ${env.NODE_ENV}`);
        console.log(`\n📡 Endpoints:`);
        console.log(`   POST /api/chat         - Main chat endpoint`);
        console.log(`   POST /api/chat/stream  - SSE streaming endpoint`);
        console.log(`   GET  /health           - Health check\n`);
    });
}

start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
