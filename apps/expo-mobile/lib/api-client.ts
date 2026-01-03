import axios from 'axios';
import Constants from 'expo-constants';

// Automatically detect the host machine's IP when running in Expo Go (LAN mode)
const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
    if (Constants.expoConfig?.hostUri) {
        const host = Constants.expoConfig.hostUri.split(':')[0];
        return `http://${host}:4000/api`;
    }
    return 'http://localhost:4000/api';
};

export const API_URL = getBaseUrl();
console.log('🎃 Pumpkin Mobile API URL:', API_URL);

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

api.interceptors.request.use(request => {
    if (authToken) {
        request.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

// API Methods
export const ApiClient = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.access_token) {
            setAuthToken(response.data.access_token);
        }
        return response.data;
    },
    logout: () => {
        setAuthToken(null);
    },
    getDashboardStats: async () => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    },
    getContacts: async () => {
        const response = await api.get('/crm/contacts');
        return response.data;
    },
    getInvoices: async () => {
        const response = await api.get('/billing/invoices');
        return response.data;
    }
};
