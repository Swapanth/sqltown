import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../utils/tokenStorage';

interface User {
    sub: string;
    email?: string;
    name?: string;
    emailVerified?: boolean | string;
    provider?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    signup: () => Promise<void>;
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

    const login = async () => {
        await authService.signInWithHostedUI();
    };

    const loginWithGoogle = async () => {
        await authService.signInWithGoogle();
    };

    const signup = async () => {
        await authService.signUpWithHostedUI();
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
        loginWithGoogle,
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
