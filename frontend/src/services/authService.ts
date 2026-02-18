import { signOut, fetchAuthSession, fetchUserAttributes, signInWithRedirect } from 'aws-amplify/auth';
import { tokenStorage } from '../utils/tokenStorage';
import { jwtDecode } from 'jwt-decode';

export const authService = {
    // Login with Cognito Hosted UI (OAuth2 + PKCE)
    signInWithHostedUI: async () => {
        try {
            await signInWithRedirect();
        } catch (error: any) {
            console.error('Hosted UI sign in error:', error);
            throw error;
        }
    },

    // Signup with Cognito Hosted UI (redirects to signup page)
    signUpWithHostedUI: async () => {
        try {
            // Redirect to Hosted UI with signup parameter
            await signInWithRedirect({
                provider: {
                    custom: 'COGNITO'
                }
            });
        } catch (error: any) {
            console.error('Hosted UI signup error:', error);
            throw error;
        }
    },

    // Google OAuth Login
    signInWithGoogle: async () => {
        try {
            await signInWithRedirect({ provider: 'Google' });
        } catch (error: any) {
            console.error('Google sign in error:', error);
            throw error;
        }
    },

    // Handle OAuth callback
    handleOAuthCallback: async () => {
        try {
            const session = await fetchAuthSession();

            if (session.tokens) {
                const idToken = session.tokens.idToken?.toString() || '';
                const refreshToken = undefined;

                const decoded: any = jwtDecode(idToken);
                const userAttributes = await fetchUserAttributes();

                const userData = {
                    sub: decoded.sub,
                    email: userAttributes.email || decoded.email,
                    name: userAttributes.name || decoded.name,
                    emailVerified: decoded.email_verified,
                    provider: decoded.identities?.[0]?.providerName || 'Cognito',
                };

                tokenStorage.setTokens(idToken, refreshToken);
                tokenStorage.setUser(userData);

                return { success: true, user: userData, token: idToken };
            }
            return { success: false };
        } catch (error: any) {
            console.error('OAuth callback error:', error);
            throw error;
        }
    },

    // Sign out
    signOut: async () => {
        try {
            await signOut();
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
            const session = await fetchAuthSession();
            if (session.tokens) {
                return {
                    isAuthenticated: true,
                    token: session.tokens.idToken?.toString() || '',
                    user: tokenStorage.getUser(),
                };
            }
            return { isAuthenticated: false };
        } catch (error) {
            return { isAuthenticated: false };
        }
    },

    // Refresh token
    refreshSession: async () => {
        try {
            const session = await fetchAuthSession({ forceRefresh: true });
            if (session.tokens) {
                const idToken = session.tokens.idToken?.toString() || '';
                const refreshToken = undefined;
                tokenStorage.setTokens(idToken, refreshToken);
                return idToken;
            }
        } catch (error: any) {
            console.error('Token refresh error:', error);
            throw error;
        }
    },
};
