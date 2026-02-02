# 🌍 AI Trip Planner

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)

**AI Trip Planner** is a next-generation travel planning application that leverages the power of Artificial Intelligence to create personalized, premium travel experiences. Built with a modern tech stack, it offers a map-first discovery interface, dynamic itineraries, and a sleek, user-friendly design.

---

## ✨ Features

- **🧠 AI-Powered Itineraries**: Generate complete trip plans based on your preferences, budget, and interests.
- **🗺️ Map-First Discovery**: Explore destinations interactively with smart filtering and clustering.
- **🎨 Premium UI/UX**: Enjoy a glassmorphism-inspired design with smooth animations and responsive layouts.
- **📅 Dynamic Timeline**: Visualize your trip day-by-day with an intuitive timeline view.
- **🏨 Integrated Booking**: (Mock) Seamless integration for hotels, flights, and attractions.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd ai-trip-planning
    ```

2.  **Navigate to the client directory**
    ```bash
    cd client
    ```

3.  **Install dependencies**
    ```bash
    npm install
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
ai-trip-planning/
├── client/                 # Frontend application code
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── atoms/      # Basic building blocks
│   │   │   │   ├── Avatar.tsx      # User/Entity profile image component
│   │   │   │   ├── Badge.tsx       # Status or category label
│   │   │   │   ├── Button.tsx      # Interactive button component
│   │   │   │   ├── Chip.tsx        # Compact element for tags/filters
│   │   │   │   ├── Divider.tsx     # Visual separator
│   │   │   │   ├── IconButton.tsx  # Icon-only button
│   │   │   │   ├── Tooltip.tsx     # Hover info popup
│   │   │   │   └── index.ts        # Barrel export file
│   │   │   ├── molecules/  # Simple combinations of atoms
│   │   │   │   ├── ChatBubble.tsx      # AI/User chat message bubble
│   │   │   │   ├── CityMarker.tsx      # Map marker for cities
│   │   │   │   ├── DestinationCard.tsx # Card displaying destination info
│   │   │   │   ├── PriceTag.tsx        # Styled price display
│   │   │   │   ├── RatingStars.tsx     # Star rating component
│   │   │   │   ├── SuggestionChip.tsx  # Quick action suggestion
│   │   │   │   ├── TransportBadge.tsx  # Transport mode indicator
│   │   │   │   ├── TripCard.tsx        # Summary card for a trip
│   │   │   │   └── index.ts            # Barrel export file
│   │   │   └── organisms/  # Complex UI sections
│   │   │   │   ├── ChatPanel.tsx       # AI chat interface area
│   │   │   │   ├── DayTimeline.tsx     # Daily itinerary visualizer
│   │   │   │   ├── ItineraryPanel.tsx  # Full trip itinerary view
│   │   │   │   ├── MapPanel.tsx        # Interactive map container
│   │   │   │   ├── RouteOverview.tsx   # Trip route summary
│   │   │   │   ├── Sidebar.tsx         # Main navigation sidebar
│   │   │   │   ├── TripHeader.tsx      # Trip title and meta controls
│   │   │   │   └── index.ts            # Barrel export file
│   │   ├── pages/          # Application routes
│   │   │   ├── HomePage.tsx        # Landing/Welcome page
│   │   │   ├── ItineraryPage.tsx   # Detailed trip plan view
│   │   │   ├── TripBuilderPage.tsx # Main planning interface
│   │   │   └── index.ts            # Barrel export file
│   │   ├── store/          # State management
│   │   │   └── tripStore.ts    # Zustand store for trip data
│   │   ├── types/          # TypeScript definitions
│   │   │   └── index.ts        # Shared type interfaces
│   │   ├── data/           # Mock data for prototyping
│   │   │   ├── chatMessages.ts # Sample chat history
│   │   │   ├── destinations.ts # List of mock destinations
│   │   │   ├── itinerary.ts    # Mock full itinerary
│   │   │   └── trips.ts        # List of user's trips
│   │   ├── assets/         # Static media files
│   │   │   └── react.svg       # React logo
│   │   ├── App.tsx         # Main app component & routing
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles (Tailwind)
│   ├── public/             
│   ├── index.html          # HTML entry point
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.ts  # Tailwind configuration
│   └── package.json        # Dependencies & scripts
└── README.md               # You are here!
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
