/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { MapInstruction } from '../types/ui-schema';

interface MapContextState {
    // Current map instruction from backend
    mapInstruction: MapInstruction | null;

    // Selected attraction ID (from either chat or map)
    selectedAttractionId: string | null;

    // Highlighted attraction ID (for visual feedback)
    highlightedAttractionId: string | null;

    // Actions
    setMapInstruction: (instruction: MapInstruction | null) => void;
    selectAttraction: (id: string | null) => void;
    highlightAttraction: (id: string | null) => void;
    clearMap: () => void;
}

const MapContext = createContext<MapContextState | null>(null);

interface MapProviderProps {
    children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
    const [mapInstruction, setMapInstructionState] = useState<MapInstruction | null>(null);
    const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);
    const [highlightedAttractionId, setHighlightedAttractionId] = useState<string | null>(null);

    const setMapInstruction = useCallback((instruction: MapInstruction | null) => {
        console.log('🗺️ Map instruction updated:', instruction?.location?.city);
        setMapInstructionState(instruction);
    }, []);

    const selectAttraction = useCallback((id: string | null) => {
        console.log('📍 Attraction selected:', id);
        setSelectedAttractionId(id);
        setHighlightedAttractionId(id);
    }, []);

    const highlightAttraction = useCallback((id: string | null) => {
        console.log('✨ Attraction highlighted:', id);
        setHighlightedAttractionId(id);
    }, []);

    const clearMap = useCallback(() => {
        console.log('🗺️ Map cleared');
        setMapInstructionState(null);
        setSelectedAttractionId(null);
        setHighlightedAttractionId(null);
    }, []);

    return (
        <MapContext.Provider
            value={{
                mapInstruction,
                selectedAttractionId,
                highlightedAttractionId,
                setMapInstruction,
                selectAttraction,
                highlightAttraction,
                clearMap,
            }}
        >
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = (): MapContextState => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
};

export default MapContext;
