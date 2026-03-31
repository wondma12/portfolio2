import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await api.get('/auth/me');
            const safeUser = {
                id: response.data.user.id,
                username: response.data.user.username,
                email: response.data.user.email,
                role: response.data.user.role,
                created_at: response.data.user.created_at
            };
            setUser(safeUser);
        } catch (error) {
            console.error('Load user error:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('Sending login request to:', api.defaults.baseURL + '/auth/login');
            
            const response = await api.post('/auth/login', { email, password });
            console.log('Login response:', response.data);
            
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            
            const safeUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };
            setUser(safeUser);
            
            return { success: true, user: safeUser };
        } catch (error) {
            console.error('Login error details:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                return { 
                    success: false, 
                    message: error.response.data?.message || 'Login failed' 
                };
            } else if (error.request) {
                console.error('No response received');
                return { 
                    success: false, 
                    message: 'Cannot connect to server. Please check if backend is running.' 
                };
            } else {
                console.error('Error:', error.message);
                return { 
                    success: false, 
                    message: 'An error occurred. Please try again.' 
                };
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};