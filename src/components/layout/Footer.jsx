import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaArrowUp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const footerLinks = [
        { to: '/', label: 'Home' },
        { to: '/projects', label: 'Projects' },
        { to: '/blog', label: 'Blog' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
        { to: '/resume', label: 'Resume' }
    ];

    const socialLinks = [
        { icon: FaGithub,  url:'https://github.com/wondma12', label: 'GitHub', color: '#333' },
        
        { icon: FaLinkedin, url: 'https://www.linkedin.com/in/haymanot-wondmagegn-b57502300/', label: 'LinkedIn', color: '#0077b5' },
      
        { icon: FaTwitter, url: 'https://x.com/HWondmageg23368', label: 'Twitter', color: '#1da1f2' },
       
        { icon: FaEnvelope, url: 'haymanotwondmagen3@gmail.com', label: 'Email', color: '#ea4335' }
    ];

    return (
        <footer className="footer-page">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-content">
                    {/* Brand Section */}
                    <motion.div 
                        className="footer-brand"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="footer-logo">Haymanot</h3>
                        <p className="footer-description">
                            Full Stack Developer creating amazing web experiences with modern technologies.
                        </p>
                        <div className="footer-email">
                            <FaEnvelope className="email-icon" />
                            <a href="haymanotwondmagegn3@gmail.com">haymanotwondmagegn3@gmail.com</a>
                        </div>
                    </motion.div>

                    {/* Quick Links Section */}
                    <motion.div 
                        className="footer-links"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-nav">
                            {footerLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="footer-link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Connect Section */}
                    <motion.div 
                        className="footer-connect"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="footer-title">Connect With Me</h4>
                        <div className="social-linkss">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                        whileHover={{ y: -5, scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={social.label}
                                    >
                                        <Icon size={40} />
                                        
                                    </motion.a>
                                );
                            })}
                        </div>
                        <div className="footer-note">
                            <p>Available for freelance opportunities</p>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>
                            &copy; {currentYear} Haymanot. All rights reserved.
                            <span className="heart-icon">
                                <FaHeart />
                            </span>
                            Crafted with passion
                        </p>
                    </div>
                    <button className="scroll-top" onClick={scrollToTop} title="Back to top">
                        <FaArrowUp />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;