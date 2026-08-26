import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaMoon, FaSun, FaUser, FaSignOutAlt, FaSignInAlt, FaUserShield } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Home', icon: '' },
        { path: '/about', label: 'About', icon: '' },
        { path: '/projects', label: 'Projects', icon: '' },
        { path: '/blog', label: 'Blog', icon: '' },
        { path: '/contact', label: 'Contact', icon: '' },
        { path: '/resume', label: 'Resume', icon: '' }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    const closeMobileMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    <motion.div 
                        className="logo-wrapper"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="logo-text">H</span>
                        <span className="logo-full">aymanot</span>
                    </motion.div>
                </Link>

                {/* Desktop Menu */}
                <div className="navbar-menu">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span className="nav-label">{link.label}</span>
                            {isActive(link.path) && (
                                <motion.div 
                                    className="nav-indicator"
                                    layoutId="activeIndicator"
                                    transition={{ type: "spring", duration: 0.5 }}
                                />
                            )}
                        </Link>
                    ))}
                    
                    <div className="navbar-actions">
                        {user && (
                            <Link to="/admin" className="nav-link admin-link">
                                <FaUserShield />
                                <span>Admin</span>
                            </Link>
                        )}
                    
                        
                        {user ? (
                            <motion.button
                                onClick={logout}
                                className="logout-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </motion.button>
                        ) : (
                            <Link to="/admin/login">
                                {/* <motion.button
                                    className="login-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaSignInAlt />
                                    <span>Login</span>
                                </motion.button> */}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="mobile-actions">
                    <motion.button
                        onClick={toggleDarkMode}
                        className="mobile-theme-toggle"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </motion.button>
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mobile-menu-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            className="mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mobile-menu-content">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="mobile-nav-icon">{link.icon}</span>
                                        <span className="mobile-nav-label">{link.label}</span>
                                    </Link>
                                ))}
                                
                                {user && (
                                    <Link
                                        to="/admin"
                                        className="mobile-nav-link admin-link"
                                        onClick={closeMobileMenu}
                                    >
                                        <FaUserShield />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}
                                
                                <div className="mobile-auth">
                                    {user ? (
                                        <button
                                            onClick={() => {
                                                logout();
                                                closeMobileMenu();
                                            }}
                                            className="mobile-logout-btn"
                                        >
                                            <FaSignOutAlt />
                                            <span>Logout</span>
                                        </button>
                                    ) : (
                                        <Link
                                            to="/admin/login"
                                            className="mobile-login-btn"
                                            onClick={closeMobileMenu}
                                        >
                                            <FaSignInAlt />
                                            <span>Login</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;