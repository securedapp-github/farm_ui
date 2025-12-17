import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// User interface
export interface User {
    id: number;
    email: string;
    name: string;
    organization: string;
    location?: string;
    role: 'farmer' | 'processor' | 'distributor' | 'retailer';
    createdAt?: string;
}

// Auth context interface
interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    organization: string;
    role: string;
    location?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE = 'http://localhost:5000';

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('agritrace_token');
            const storedUser = localStorage.getItem('agritrace_user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.warn('localStorage access error:', error);
        }
        setIsLoading(false);
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token && data.user) {
                setUser(data.user);
                setToken(data.token);
                try {
                    localStorage.setItem('agritrace_token', data.token);
                    localStorage.setItem('agritrace_user', JSON.stringify(data.user));
                } catch (e) {
                    console.warn('Could not save to localStorage');
                }
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    // Register function
    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.user) {
                // Auto-login after registration
                return await login(data.email, data.password);
            } else {
                return { success: false, error: result.error || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        try {
            localStorage.removeItem('agritrace_token');
            localStorage.removeItem('agritrace_user');
        } catch (e) {
            console.warn('Could not clear localStorage');
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Helper to get auth token for API calls
export const getAuthToken = (): string | null => {
    return localStorage.getItem('agritrace_token');
};

export default AuthContext;
