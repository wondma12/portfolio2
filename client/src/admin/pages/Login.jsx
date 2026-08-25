import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaArrowLeft, FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        
        try {
            const result = await login(data.email, data.password);
            
            if (result.success) {
                toast.success('Welcome back! Redirecting to dashboard...');
                setTimeout(() => navigate('/admin'), 1000);
            } else {
                toast.error(result.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');
        if (emailInput && passwordInput) {
            emailInput.value = 'admin@portfolio.com';
            passwordInput.value = 'admin123';
            // Trigger React Hook Form update
            const event = new Event('input', { bubbles: true });
            emailInput.dispatchEvent(event);
            passwordInput.dispatchEvent(event);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <motion.div 
                    className="login-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Logo Section */}
                    <div className="login-logo">
                        <motion.div 
                            className="logo-icon"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <FaUserShield />
                        </motion.div>
                    </div>
                    
                    <div className="login-header">
                        <h1 className="login-title">Admin Login</h1>
                        <p className="login-subtitle">Access your dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <div className="form-group">
                            <div className="input-icon">
                                <FaEnvelope />
                            </div>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                type="email"
                                placeholder="admin@portfolio.com"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="input-icon">
                                <FaLock />
                            </div>
                            <input
                                {...register('password', { 
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                            />
                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.password && (
                                <span className="error-message">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="btn-loader">
                                    <div className="spinner"></div>
                                    <span>Authenticating...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <FaArrowRight className="btn-icon" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    {/* <div className="demo-credentials">
                        <div className="demo-header">
                            <span>🔐</span>
                            <h4>Demo Credentials</h4>
                        </div>
                        <div className="demo-content">
                            <div className="demo-item">
                                <span className="demo-label">Email:</span>
                                <code>admin@portfolio.com</code>
                            </div>
                            <div className="demo-item">
                                <span className="demo-label">Password:</span>
                                <code>admin123</code>
                            </div>
                        </div>
                        <button 
                            type="button"
                            className="demo-fill-btn"
                            onClick={fillDemoCredentials}
                        >
                            Auto-fill demo credentials
                        </button>
                    </div> */}

                    {/* Footer */}
                    <div className="login-footer">
                        <Link to="/" className="back-link">
                            <FaArrowLeft /> Back to Homepage
                        </Link>
                        {/* <div className="social-links">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <FiGithub />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FiLinkedin />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FiTwitter />
                            </a>
                        </div> */}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;