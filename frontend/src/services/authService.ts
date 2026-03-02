import { tokenStorage } from '../utils/tokenStorage';
import { jwtDecode } from 'jwt-decode';
import apiClient from './apiClient';

interface LoginResponse {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        email: string;
        name: string;
        auth_provider: string;
    };
}

export const authService = {
    // Login with email and password
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post<LoginResponse>('/api/auth/login', {
                email,
                password,
            });

            const { access_token, user } = response.data;

            // Store token and user data
            tokenStorage.setToken(access_token);
            tokenStorage.setUser(user);

            return { success: true, user, token: access_token };
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    },

    // Signup with email, password, and name
    signup: async (email: string, password: string, name: string) => {
        try {
            const response = await apiClient.post<LoginResponse>('/api/auth/signup', {
                email,
                password,
                name,
            });

            const { access_token, user } = response.data;

            // Store token and user data
            tokenStorage.setToken(access_token);
            tokenStorage.setUser(user);

            return { success: true, user, token: access_token };
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(error.response?.data?.detail || 'Signup failed');
        }
    },

    // Sign out
    signOut: async () => {
        try {
            // Call backend logout endpoint (optional)
            try {
                await apiClient.post('/api/auth/logout');
            } catch (error) {
                // Ignore logout endpoint errors
                console.warn('Logout endpoint error (ignored):', error);
            }

            // Clear local storage
            tokenStorage.clearAll();
            return { success: true };
        } catch (error: any) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    // Get current session
    getCurrentSession: async () => {
        try {
            const token = tokenStorage.getToken();
            const user = tokenStorage.getUser();

            if (!token || !user) {
                return { isAuthenticated: false };
            }

            // Verify token is not expired
            try {
                const decoded: any = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp && decoded.exp < currentTime) {
                    // Token expired
                    tokenStorage.clearAll();
                    return { isAuthenticated: false };
                }

                return {
                    isAuthenticated: true,
                    token,
                    user,
                };
            } catch (error) {
                // Invalid token format
                tokenStorage.clearAll();
                return { isAuthenticated: false };
            }
        } catch (error) {
            return { isAuthenticated: false };
        }
    },

    // Refresh token (placeholder - implement if using refresh tokens)
    refreshSession: async () => {
        // For now, just return the current token
        // In future, implement refresh token flow
        const token = tokenStorage.getToken();
        if (!token) {
            throw new Error('No token to refresh');
        }
        return token;
    },
};
