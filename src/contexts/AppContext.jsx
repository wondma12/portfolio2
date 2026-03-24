import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { darkMode } = useTheme();
    
    useEffect(() => {
        // Initialize app
        setLoading(false);
    }, []);
    
    const value = {
        loading,
        sidebarOpen,
        setSidebarOpen,
        isAuthenticated,
        user,
        darkMode
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};