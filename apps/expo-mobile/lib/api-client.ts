import axios from 'axios';
import Constants from 'expo-constants';

// Automatically detect the host machine's IP when running in Expo Go (LAN mode)
const getBaseUrl = () => {
    // If we have a manually defined local API URL (e.g. from .env), use it
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // In Expo Go, hostUri contains the machine's LAN IP
    if (Constants.expoConfig?.hostUri) {
        const host = Constants.expoConfig.hostUri.split(':')[0];
        return `http://${host}:4000/api`;
    }

    // Fallback for simulators or web
    return 'http://localhost:4000/api';
};

export const API_URL = getBaseUrl();

console.log('🎃 Pumpkin Mobile API URL:', API_URL);

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Add interceptor to log requests/responses for debugging
api.interceptors.request.use(request => {
    // console.log('Starting Request', request.method?.toUpperCase(), request.url);
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);
