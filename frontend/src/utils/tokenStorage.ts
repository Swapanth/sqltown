const TOKEN_KEY = 'cognito_id_token';
const REFRESH_TOKEN_KEY = 'cognito_refresh_token';
const USER_KEY = 'user_data';

export const tokenStorage = {
    // Store tokens securely
    setTokens: (idToken: string, refreshToken?: string) => {
        localStorage.setItem(TOKEN_KEY, idToken);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    },

    // Get ID token
    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Get refresh token
    getRefreshToken: (): string | null => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    // Store user data
    setUser: (userData: any) => {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    },

    // Get user data
    getUser: (): any | null => {
        const data = localStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    },

    // Clear all auth data
    clearAll: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Check if token exists
    hasToken: (): boolean => {
        return !!localStorage.getItem(TOKEN_KEY);
    },
};
