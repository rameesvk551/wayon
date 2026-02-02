import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, ChatPanel, MapPanel } from '../components/organisms';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState(1);

    const handleViewItinerary = () => {
        navigate('/itinerary/trip-1');
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Center: Chat Panel */}
            <ChatPanel onTripCreated={handleViewItinerary} />

            {/* Right: Map Panel */}
            <div className="w-[45%] h-full">
                <MapPanel
                    selectedDay={selectedDay}
                    onDaySelect={setSelectedDay}
                />
            </div>
        </div>
    );
};

export default HomePage;
