import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const OAuthCallbackPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            const result = await authService.handleOAuthCallback();
            if (result && result.success) {
                navigate('/dashboard');
            } else {
                setError('Authentication failed or incomplete.');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err: any) {
            console.error('Callback error:', err);
            setError('Authentication failed. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                <div className="mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing authentication...</h2>
                <p className="text-gray-600">Please wait</p>
            </div>
        </div>
    );
};
