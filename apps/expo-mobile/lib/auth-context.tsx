import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from './api-client';
import { router } from 'expo-router';

type User = {
    email: string;
    name: string;
    accessToken: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false,
    signIn: async () => { },
    signOut: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const data = await ApiClient.login(email, password);

            // Construct user object (API returns user object inside or we assume from email)
            const newUser = {
                email,
                name: data.user?.firstName ? `${data.user.firstName} ${data.user.lastName}` : 'Pumpkin User',
                accessToken: data.access_token,
            };

            setUser(newUser);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = () => {
        ApiClient.logout();
        setUser(null);
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
