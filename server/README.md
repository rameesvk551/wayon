# AI Trip Planner - Backend Server

Schema-driven AI backend that orchestrates travel microservices and returns strict UI schema JSON.

## Architecture

```
Client UI
   ↓
POST /api/chat
   ↓
Intent Classifier (Gemini Flash - cheap)
   ↓
Tool Router
   ↓
Microservices + RAG
   ↓
LLM Reasoning (Gemini Pro)
   ↓
UI Schema Composer
   ↓
Zod Validator
   ↓
Frontend
```

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### 3. Start the Server

```bash
npm run dev
```

Server runs on `http://localhost:4000`

## API Endpoints

### `POST /api/chat`

Main chat endpoint for AI travel assistance.

**Request:**
```json
{
  "message": "Can I travel to Thailand tomorrow?",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "blocks": [
    { "type": "title", "text": "Thailand Travel Info", "level": 1 },
    { "type": "alert", "level": "info", "text": "Visa on arrival available" },
    { "type": "list", "items": [...] }
  ],
  "session_id": "generated-or-provided-session-id"
}
```

### `POST /api/chat/stream`

SSE streaming endpoint for progressive rendering.

### `GET /health`

Health check endpoint.

## Features

### Intent Classification
Uses cheap Gemini Flash model to classify intents:
- `itinerary_generation`
- `visa_check`
- `hotel_search`
- `flight_search`
- `attraction_discovery`
- `weather_check`
- `tour_search`
- `transport_search`
- `general_question`

### Tool Calling
7 microservice tools with fallback data:
- Visa check
- Hotel search
- Flight search
- Attraction discovery
- Weather forecast
- Tour search
- Transport info

### RAG System
Semantic search over travel regulations for:
- Visa requirements
- Entry rules
- Passport validity
- Government advisories

### Caching
Redis caching (with in-memory fallback):
- Visa checks: 24 hours
- Weather: 30 minutes
- Hotels/Flights: 5 minutes

### UI Schema
Strict schema validation with 10 block types:
- `title`, `text`, `card`, `list`
- `timeline`, `map`, `alert`, `image`
- `actions`, `divider`

## Project Structure

```
server/
├── src/
│   ├── api/
│   │   └── chat.controller.ts    # Main chat endpoint
│   ├── ai/
│   │   ├── llm-client.ts         # Gemini AI client
│   │   ├── system-prompt.ts      # AI behavior rules
│   │   ├── intent-router.ts      # Intent classification
│   │   ├── response-composer.ts  # Build UI blocks
│   │   └── schema-enforcer.ts    # Validation & fixes
│   ├── tools/
│   │   ├── visa.tool.ts          # Visa service
│   │   ├── hotel.tool.ts         # Hotel service
│   │   ├── flight.tool.ts        # Flight service
│   │   ├── attraction.tool.ts    # Attractions service
│   │   ├── weather.tool.ts       # Weather service
│   │   ├── transport.tool.ts     # Transport service
│   │   └── tour.tool.ts          # Tours service
│   ├── rag/
│   │   ├── loader.ts             # Document loader
│   │   ├── embeddings.ts         # Gemini embeddings
│   │   └── retriever.ts          # Semantic search
│   ├── memory/
│   │   ├── conversation.ts       # Chat history
│   │   └── user-profile.ts       # User preferences
│   ├── cache/
│   │   └── redis.ts              # Redis with fallback
│   ├── schema/
│   │   └── ui-schema.zod.ts      # Zod validation
│   ├── config/
│   │   └── env.ts                # Environment config
│   └── server.ts                 # Express entry point
├── .env.example
├── package.json
└── tsconfig.json
```

## Microservice URLs

Configure in `.env`:
```env
WEATHER_SERVICE_URL=http://localhost:4001
HOTEL_SERVICE_URL=http://localhost:4002
VISA_SERVICE_URL=http://localhost:4003
FLIGHT_SERVICE_URL=http://localhost:4005
```

If services are unavailable, fallback dummy data is used.

## Cost Optimization

| Operation | Model | Est. Cost |
|-----------|-------|-----------|
| Intent Classification | Gemini Flash | ~$0.0001/req |
| Response Generation | Gemini Pro | ~$0.001/req |
| Embeddings | text-embedding-004 | ~$0.00001/doc |

Caching reduces API calls by ~60% for repeated queries.

## License

MIT
