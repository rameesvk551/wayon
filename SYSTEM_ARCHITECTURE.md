# AI Trip Planner - System Architecture

> **Complete technical documentation of how the system works**

---

## 📊 High-Level System Overview

```mermaid
graph TB
    subgraph "Frontend (React Client)"
        UI[Chat Interface]
        Components[UI Components]
        Store[State Store]
    end
    
    subgraph "Backend (Express Server)"
        API[Chat Controller]
        AI[AI Layer]
        Tools[Tool Registry]
        Cache[Redis Cache]
        RAG[RAG System]
    end
    
    subgraph "External Services"
        Gemini[Google Gemini AI]
        Hotels[Hotel API]
        Flights[Flight API]
        Attractions[Attraction API]
        Weather[Weather API]
        Visa[Visa API]
    end
    
    UI --> API
    API --> AI
    AI --> Gemini
    AI --> Tools
    Tools --> Cache
    Cache --> Hotels
    Cache --> Flights
    Cache --> Attractions
    Cache --> Weather
    Cache --> Visa
    AI --> RAG
    API --> UI
    Components --> Store
    Store --> UI
```

---

## 🔄 Complete Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Client as React Client
    participant Server as Express Server
    participant Intent as Intent Router
    participant LLM as Gemini LLM
    participant Tools as Tool Registry
    participant Cache as Redis Cache
    participant APIs as External APIs
    
    User->>Client: Sends message
    Client->>Server: POST /api/chat
    Server->>Intent: Route user intent
    Intent->>LLM: Classify intent
    LLM-->>Intent: Return intent type
    Intent-->>Server: Intent + Entities
    
    Server->>LLM: Generate with tools
    LLM-->>Server: Tool calls needed
    
    loop For each tool call
        Server->>Tools: Execute tool
        Tools->>Cache: Check cache
        alt Cache hit
            Cache-->>Tools: Return cached data
        else Cache miss
            Tools->>APIs: Fetch from API
            APIs-->>Tools: API response
            Tools->>Cache: Store in cache
        end
        Tools-->>Server: Tool result
    end
    
    Server->>LLM: Continue with results
    LLM-->>Server: Final response
    Server->>Server: Compose UI blocks
    Server-->>Client: UIResponse (blocks)
    Client->>Client: Render blocks
    Client-->>User: Display result
```

---

## 🧠 AI Processing Pipeline

### Intent Classification

```mermaid
flowchart LR
    A[User Message] --> B[Gemini Flash Model]
    B --> C{Intent Classification}
    C --> D[itinerary_generation]
    C --> E[flight_search]
    C --> F[hotel_search]
    C --> G[attraction_discovery]
    C --> H[weather_check]
    C --> I[visa_check]
    C --> J[tour_search]
    C --> K[transport_search]
    C --> L[general_question]
```

### Intent to Tools Mapping

| Intent | Tools Called | Description |
|--------|--------------|-------------|
| `itinerary_generation` | All tools (parallel) | Full trip planning |
| `flight_search` | `search_flights` | Find flight options |
| `hotel_search` | `search_hotels` | Find accommodations |
| `attraction_discovery` | `discover_attractions` | Find things to do |
| `weather_check` | `get_weather` | Weather forecast |
| `visa_check` | `check_visa` | Visa requirements |
| `tour_search` | `search_tours` | Find guided tours |
| `transport_search` | `search_transport` | Local transportation |

---

## ✈️ Flight Search Flow

```mermaid
flowchart TB
    subgraph "User Request"
        A[User: "Find flights to Paris"]
    end
    
    subgraph "Intent Processing"
        B[Intent: flight_search]
        C[Entities: destination=Paris]
    end
    
    subgraph "Tool Execution"
        D[search_flights tool]
        E{Check Redis Cache}
        F[Cache Hit] --> G[Return cached flights]
        H[Cache Miss] --> I[Call Flight API]
        I --> J[Store in Redis 5min TTL]
        J --> K[Return flight data]
    end
    
    subgraph "Response Composition"
        L[composeFlightResponse]
        M[Generate Card Blocks]
        N["UI: Flight cards with<br/>airline, price, duration"]
    end
    
    A --> B --> D
    D --> E
    E -->|hit| F
    E -->|miss| H
    G --> L
    K --> L
    L --> M --> N
```

### Flight Data Structure

```typescript
interface FlightData {
    id: string;
    airline: string;           // "Emirates"
    flightNumber: string;      // "EK-512"
    departure: string;         // "10:30 AM"
    arrival: string;           // "4:00 PM"
    duration: string;          // "5h 30m"
    price: string;             // "$450"
    stops: number;             // 0
    aircraft: string;          // "Boeing 777-300ER"
    class: string;             // "Economy"
}
```

---

## 🏨 Hotel Search Flow

```mermaid
flowchart TB
    subgraph "User Request"
        A[User: "Hotels in Tokyo"]
    end
    
    subgraph "Tool Execution"
        B[search_hotels tool]
        C[Parameters: destination, dates, guests]
        D{Redis Cache Check}
        E[API Call or Fallback Data]
    end
    
    subgraph "Response Processing"
        F[composeHotelResponse]
        G["Generate Card blocks with:<br/>• Hotel name & rating<br/>• Price per night<br/>• Amenities list<br/>• Book Now action"]
    end
    
    A --> B --> C --> D
    D --> E --> F --> G
```

### Hotel Data Structure

```typescript
interface HotelData {
    id: string;
    name: string;              // "Grand Hyatt Tokyo"
    location: string;          // "Shinjuku District"
    rating: number;            // 4.8
    price: string;             // "$320/night"
    image: string;             // URL
    amenities: string[];       // ["WiFi", "Pool", "Spa"]
    description: string;
}
```

---

## 🏛️ Attraction Discovery Flow

```mermaid
flowchart TB
    subgraph "Request"
        A[User: "Things to do in Bali"]
    end
    
    subgraph "Processing"
        B[discover_attractions tool]
        C["Extract: destination, category"]
        D[Destination-specific fallback data]
        E["Filter by category (if provided)"]
    end
    
    subgraph "Response"
        F[composeAttractionResponse]
        G["Card blocks for each attraction:<br/>• Name & category<br/>• Rating & duration<br/>• Price (if applicable)<br/>• Image"]
    end
    
    A --> B --> C --> D --> E --> F --> G
```

### Supported Destinations

| Destination | Sample Attractions |
|-------------|-------------------|
| Thailand | Grand Palace, Floating Markets |
| Delhi | India Gate, Red Fort, Qutub Minar |
| Mumbai | Gateway of India, Marine Drive |
| Goa | Baga Beach, Scuba Diving |
| Jaipur | Amber Fort, Hawa Mahal |
| Japan | Fushimi Inari, Tokyo Skytree |
| Default | City Walking Tour, Old Town District |

---

## 🌤️ Weather Check Flow

```mermaid
flowchart LR
    A[User query] --> B[get_weather tool]
    B --> C[Location extraction]
    C --> D{Redis Cache<br/>TTL: 30min}
    D -->|hit| E[Cached weather]
    D -->|miss| F[Weather API]
    F --> G[Cache result]
    G --> E
    E --> H[composeWeatherResponse]
    H --> I["UI Blocks:<br/>• Current temp card<br/>• 5-day forecast<br/>• Packing tips alert"]
```

### Weather Data Structure

```typescript
interface WeatherData {
    location: string;
    current: {
        temp: string;          // "28°C"
        condition: string;     // "Sunny"
    };
    forecast: Array<{
        date: string;          // "Mon, Jan 21"
        high: string;          // "30°C"
        low: string;           // "24°C"
        condition: string;     // "Partly Cloudy"
    }>;
}
```

---

## 📋 Visa Check Flow

```mermaid
flowchart TB
    subgraph "Input"
        A[User: "Do I need visa for Thailand?"]
        B["Extract: nationality, destination"]
    end
    
    subgraph "Processing"
        C[check_visa tool]
        D{RAG System}
        E[Travel regulations docs]
        F[Visa requirement lookup]
    end
    
    subgraph "Response"
        G[composeVisaResponse]
        H["Alert blocks:<br/>• Success/Warning level<br/>• Visa type info"]
        I["List block:<br/>• Required documents"]
        J["Alert block:<br/>• Additional warnings"]
    end
    
    A --> B --> C
    C --> D --> E
    D --> F --> G
    G --> H --> I --> J
```

### Visa Response Types

| Visa Status | Alert Level | Example |
|-------------|-------------|---------|
| Visa Free | `success` | "No visa required!" |
| Visa on Arrival | `success` | "VOA available for 15-30 days" |
| E-Visa Required | `warning` | "Apply online before travel" |
| Embassy Visa | `warning` | "Visit embassy in advance" |

---

## 📅 Itinerary Generation Flow

```mermaid
flowchart TB
    subgraph "Request"
        A["User: Plan a trip to Paris<br/>for 5 days"]
    end
    
    subgraph "Parallel Tool Execution"
        B[check_visa]
        C[get_weather]
        D[search_flights]
        E[search_hotels]
        F[discover_attractions]
        G[search_tours]
        H[search_transport]
    end
    
    subgraph "Response Composition"
        I[composeItineraryResponse]
        J["1. Visa Alert"]
        K["2. Weather Overview"]
        L["3. Flight Options"]
        M["4. Hotel Recommendations"]
        N["5. Daily Timeline"]
    end
    
    A --> B & C & D & E & F & G & H
    B & C & D & E & F & G & H --> I
    I --> J --> K --> L --> M --> N
```

### Itinerary UI Structure

```mermaid
flowchart TB
    subgraph "Itinerary Response Blocks"
        A[Title Block: Trip Overview]
        B[Visa Alert Block]
        C[Weather Card Block]
        D[Flight Cards]
        E[Hotel Card]
        F["Timeline Block: Day 1"]
        G["Timeline Block: Day 2"]
        H["Timeline Block: Day N..."]
    end
    
    A --> B --> C --> D --> E --> F --> G --> H
```

---

## 💾 Caching Architecture

```mermaid
flowchart TB
    subgraph "Cache Configuration"
        A[Redis Cache]
        B["flights: 5 min TTL"]
        C["hotels: 15 min TTL"]
        D["weather: 30 min TTL"]
        E["attractions: 1 hour TTL"]
        F["visa: 24 hours TTL"]
    end
    
    subgraph "Cache Flow"
        G[Tool Request]
        H{Cache Lookup}
        I[Cache Hit] --> J[Return Cached Data]
        K[Cache Miss] --> L[API Call]
        L --> M[Store in Cache]
        M --> N[Return Fresh Data]
    end
    
    A --> B & C & D & E & F
    G --> H
    H -->|exists| I
    H -->|missing| K
```

### Cache Key Generation

```typescript
// Example cache keys
"flights:delhi:paris:2024-03-15:economy"
"hotels:tokyo:2024-03-10:2024-03-15:2"
"weather:bali"
"attractions:thailand:temple"
"visa:indian:thailand"
```

---

## 📱 UI Block Types

```mermaid
flowchart LR
    subgraph "Block Types"
        A[title] --> A1["Headers H1-H6"]
        B[text] --> B1["Markdown content"]
        C[card] --> C1["Rich info display"]
        D[timeline] --> D1["Day-by-day items"]
        E[list] --> E1["Bulleted items"]
        F[alert] --> F1["Info/Warning/Error"]
    end
```

### Block Type Reference

| Type | Use Case | Key Properties |
|------|----------|----------------|
| `title` | Section headers | `text`, `level` |
| `text` | Markdown content | `content`, `format` |
| `card` | Hotels, Flights | `title`, `subtitle`, `meta`, `badge`, `actions` |
| `timeline` | Itinerary days | `title`, `items[]` with time/icon/status |
| `list` | Requirements | `title`, `items[]` with text/icon |
| `alert` | Warnings/Info | `level`, `title`, `text` |

---

## 🔧 Tool Registry Architecture

```mermaid
classDiagram
    class Tool {
        +string name
        +string description
        +object parameters
        +string[] required
        +execute(params) ToolResult
    }
    
    class ToolRegistry {
        -Map~string, Tool~ tools
        +register(tool)
        +get(name) Tool
        +getAll() Tool[]
    }
    
    class FlightTool {
        +name: "search_flights"
        +execute(origin, dest, date)
    }
    
    class HotelTool {
        +name: "search_hotels"
        +execute(destination, dates)
    }
    
    class AttractionTool {
        +name: "discover_attractions"
        +execute(destination, category)
    }
    
    class WeatherTool {
        +name: "get_weather"
        +execute(location)
    }
    
    class VisaTool {
        +name: "check_visa"
        +execute(nationality, dest)
    }
    
    ToolRegistry --> Tool
    Tool <|-- FlightTool
    Tool <|-- HotelTool
    Tool <|-- AttractionTool
    Tool <|-- WeatherTool
    Tool <|-- VisaTool
```

---

## 📁 Project Structure

```
ai-trip-planning/
├── client/                    # React Frontend
│   └── src/
│       ├── components/        # UI Components
│       │   ├── atoms/         # Basic elements
│       │   ├── molecules/     # Composite elements
│       │   └── organisms/     # Complex layouts
│       ├── pages/             # Page components
│       ├── store/             # State management
│       ├── types/             # TypeScript types
│       └── data/              # Mock data
│
└── server/                    # Express Backend
    └── src/
        ├── api/               # API Controllers
        │   └── chat.controller.ts
        ├── ai/                # AI Layer
        │   ├── llm-client.ts      # Gemini integration
        │   ├── intent-router.ts   # Intent classification
        │   ├── response-composer.ts
        │   └── system-prompt.ts
        ├── tools/             # Service Tools
        │   ├── flight.tool.ts
        │   ├── hotel.tool.ts
        │   ├── attraction.tool.ts
        │   ├── weather.tool.ts
        │   ├── visa.tool.ts
        │   ├── tour.tool.ts
        │   └── transport.tool.ts
        ├── cache/             # Redis Caching
        │   └── redis.ts
        ├── rag/               # RAG System
        │   ├── embeddings.ts
        │   ├── loader.ts
        │   └── retriever.ts
        ├── schema/            # UI Schema
        │   └── ui-schema.zod.ts
        └── server.ts          # Entry point
```

---

## 🚀 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Main chat endpoint |
| `/api/chat/stream` | POST | SSE streaming endpoint |
| `/health` | GET | Health check |

### Chat Request/Response

```typescript
// Request
interface ChatRequest {
    message: string;
    conversationHistory?: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
}

// Response
interface UIResponse {
    blocks: UIBlock[];
}
```

---

## 🎯 Summary

The AI Trip Planner works through a pipeline:

1. **User sends message** → Frontend React app
2. **Intent classification** → Gemini AI determines what user wants
3. **Tool selection** → System picks appropriate tools (flight, hotel, etc.)
4. **Parallel execution** → Tools fetch data with Redis caching
5. **Response composition** → Tool results → UI blocks
6. **Rendering** → Frontend displays cards, timelines, alerts

**Key Features:**
- 🧠 AI-powered intent understanding
- ⚡ Redis caching for performance
- 🔄 Fallback data when APIs unavailable
- 📊 Schema-driven UI rendering
- 🎨 Rich visual components
