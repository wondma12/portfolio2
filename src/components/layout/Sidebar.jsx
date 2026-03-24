import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaHome, FaUser, FaProjectDiagram, FaBlog, FaEnvelope, FaFileAlt,
    FaTimes, FaGithub, FaLinkedin, FaTwitter
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    
    const navItems = [
        { path: '/', label: 'Home', icon: FaHome, color: '#18b8c8' },
        { path: '/about', label: 'About', icon: FaUser, color: '#0fa69c' },
        { path: '/projects', label: 'Projects', icon: FaProjectDiagram, color: '#10b981' },
        { path: '/blog', label: 'Blog', icon: FaBlog, color: '#f59e0b' },
        { path: '/contact', label: 'Contact', icon: FaEnvelope, color: '#8b5cf6' },
        { path: '/resume', label: 'Resume', icon: FaFileAlt, color: '#ec489a' }
    ];
    
    const socialLinks = [
        { icon: FaGithub, url: 'https://github.com', label: 'GitHub' },
        { icon: FaLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter' }
    ];
    
    const isActive = (path) => {
        return location.pathname === path;
    };
    
    const sidebarVariants = {
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };
    
    const overlayVariants = {
        open: { opacity: 1, visibility: "visible" },
        closed: { opacity: 0, visibility: "hidden" }
    };
    
    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="sidebar-overlay"
                        variants={overlayVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>
            
            {/* Sidebar */}
            <motion.div 
                className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
                variants={sidebarVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
            >
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon">H</div>
                        <div className="logo-text">aymanot</div>
                    </div>
                    <motion.button 
                        className="sidebar-close"
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaTimes />
                    </motion.button>
                </div>
                
                <div className="sidebar-content">
                    <nav className="sidebar-nav">
                        <ul className="nav-list">
                            {navItems.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <motion.li 
                                        key={item.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={onClose}
                                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                        >
                                            <div className="nav-icon-wrapper" style={{ backgroundColor: `${item.color}20` }}>
                                                <IconComponent className="nav-icon" style={{ color: item.color }} />
                                            </div>
                                            <span className="nav-label">{item.label}</span>
                                            {isActive(item.path) && (
                                                <motion.div 
                                                    className="nav-active-indicator"
                                                    layoutId="sidebarActiveIndicator"
                                                    transition={{ type: "spring", duration: 0.5 }}
                                                />
                                            )}
                                        </Link>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </nav>
                    
                    <div className="sidebar-footer">
                        <div className="sidebar-divider"></div>
                        <div className="sidebar-social">
                            <h4 className="social-title">Connect with me</h4>
                            <div className="social-links">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <motion.a
                                            key={social.label}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            whileHover={{ y: -3, scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                        >
                                            <IconComponent />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="sidebar-version">
                            <span>v2.0.0</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;