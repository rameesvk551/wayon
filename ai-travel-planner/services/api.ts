import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../store';
import type { ApiResponse, Trip, User, TripWizardData } from '../types';

// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired, logout user
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (name: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    googleAuth: async (idToken: string): Promise<ApiResponse<{ user: User; token: string }>> => {
        const response = await api.post('/auth/google', { idToken });
        return response.data;
    },

    getProfile: async (): Promise<ApiResponse<User>> => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
};

// Trip API
export const tripApi = {
    generate: async (wizardData: TripWizardData): Promise<ApiResponse<Trip>> => {
        const response = await api.post('/trip/generate', wizardData);
        return response.data;
    },

    list: async (): Promise<ApiResponse<Trip[]>> => {
        const response = await api.get('/trip/list');
        return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Trip>> => {
        const response = await api.get(`/trip/${id}`);
        return response.data;
    },

    update: async (id: string, updates: Partial<Trip>): Promise<ApiResponse<Trip>> => {
        const response = await api.put(`/trip/${id}`, updates);
        return response.data;
    },

    delete: async (id: string): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/trip/${id}`);
        return response.data;
    },
};

// Chat API
export const chatApi = {
    sendMessage: async (message: string, tripId?: string): Promise<ApiResponse<{
        response: string;
        suggestions?: string[];
    }>> => {
        const response = await api.post('/chat', { message, tripId });
        return response.data;
    },
};

// Export default api instance for custom requests
export default api;
