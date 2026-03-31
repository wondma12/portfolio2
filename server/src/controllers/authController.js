import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { config } from '../config/env.js';

export const authController = {
    async register(req, res) {
        try {
            console.log('Register request body:', req.body);
            
            const { username, email, password } = req.body;
            
            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please provide all required fields: username, email, password' 
                });
            }
            
            if (password.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Password must be at least 6 characters' 
                });
            }
            
            // Check if user exists
            const [existingUsers] = await pool.execute(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username]
            );
            
            if (existingUsers.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User with this email or username already exists' 
                });
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Create user
            const [result] = await pool.execute(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, 'user']
            );
            
            const userId = result.insertId;
            
            // Create token
            const token = jwt.sign(
                { id: userId, email, role: 'user' },
                config.jwtSecret,
                { expiresIn: config.jwtExpire }
            );
            
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: userId,
                    username,
                    email,
                    role: 'user'
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error during registration',
                error: error.message 
            });
        }
    },
    
    async login(req, res) {
        try {
            console.log('Login request received');
            console.log('Request body:', req.body);
            console.log('Request headers:', req.headers);
            
            const { email, password } = req.body;
            
            // Validate input
            if (!email || !password) {
                console.log('Missing email or password');
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please provide email and password' 
                });
            }
            
            console.log(`Attempting login for email: ${email}`);
            
            // Check user exists
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            
            if (users.length === 0) {
                console.log('User not found:', email);
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }
            
            const user = users[0];
            console.log('User found:', user.username);
            
            // Verify password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            console.log('Password match:', isMatch);
            
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }
            
            // Create token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: config.jwtExpire }
            );
            
            console.log('Login successful for:', email);
            
            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error during login',
                error: error.message 
            });
        }
    },
    
    async getMe(req, res) {
        try {
            const [users] = await pool.execute(
                'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
                [req.user.id]
            );
            
            if (users.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            
            res.json({ 
                success: true, 
                user: users[0] 
            });
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error' 
            });
        }
    }
};
