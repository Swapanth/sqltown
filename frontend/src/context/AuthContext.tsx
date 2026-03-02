import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../utils/tokenStorage';

interface User {
    id: string;
    email: string;
    name: string;
    auth_provider: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state on mount
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            const session = await authService.getCurrentSession();
            if (session && session.isAuthenticated && session.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const result = await authService.login(email, password);
            if (result.success && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            const result = await authService.signup(email, password, name);
            if (result.success && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const logout = async () => {
        await authService.signOut();
        setUser(null);
        setIsAuthenticated(false);
    };

    const getToken = () => {
        return tokenStorage.getToken();
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        getToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
