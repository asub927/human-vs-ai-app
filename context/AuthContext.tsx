'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (provider: string) => void;
    logout: () => void;
    setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load token from local storage on mount
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setTokenState(storedToken);
            fetchUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async (authToken: string) => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // If token is invalid, clear it
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = (provider: string) => {
        // Redirect to backend OAuth endpoint
        window.location.href = `${API_URL}/auth/${provider}`;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setTokenState(null);
        setUser(null);
        router.push('/login');
    };

    const setToken = (newToken: string) => {
        localStorage.setItem('authToken', newToken);
        setTokenState(newToken);
        fetchUser(newToken);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
