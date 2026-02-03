import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    // Mock login - replace with actual API call
                    const mockUser: User = {
                        id: '1',
                        email,
                        name: email.split('@')[0],
                        createdAt: new Date().toISOString(),
                    };
                    set({
                        user: mockUser,
                        token: 'mock-jwt-token',
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    set({ isLoading: false });
                    return false;
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true });
                try {
                    // Mock register - replace with actual API call
                    const mockUser: User = {
                        id: '1',
                        email,
                        name,
                        createdAt: new Date().toISOString(),
                    };
                    set({
                        user: mockUser,
                        token: 'mock-jwt-token',
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    set({ isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setUser: (user: User) => set({ user }),
            setToken: (token: string) => set({ token, isAuthenticated: true }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
