import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const userController = {
    async getAllUsers(req, res) {
        try {
            // Only select non-sensitive fields, exclude password_hash
            const [rows] = await pool.execute(
                'SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
            );
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ message: 'Failed to fetch users' });
        }
    },

    async getUserById(req, res) {
        try {
            // Only select non-sensitive fields, exclude password_hash
            const [rows] = await pool.execute(
                'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?',
                [req.params.id]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ success: true, data: rows[0] });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({ message: 'Failed to fetch user' });
        }
    },

    async updateUserRole(req, res) {
        try {
            const { role } = req.body;
            
            if (!['user', 'admin'].includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            
            const [result] = await pool.execute(
                'UPDATE users SET role = ? WHERE id = ?',
                [role, req.params.id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ success: true, message: 'User role updated successfully' });
        } catch (error) {
            console.error('Update user role error:', error);
            res.status(500).json({ message: 'Failed to update user role' });
        }
    },

    async deleteUser(req, res) {
        try {
            if (parseInt(req.params.id) === req.user.id) {
                return res.status(400).json({ message: 'Cannot delete your own account' });
            }
            
            const [result] = await pool.execute(
                'DELETE FROM users WHERE id = ?',
                [req.params.id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ message: 'Failed to delete user' });
        }
    },

    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            
            const [rows] = await pool.execute(
                'SELECT password_hash FROM users WHERE id = ?',
                [req.user.id]
            );
            
            const user = rows[0];
            
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(newPassword, salt);
            
            await pool.execute(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                [password_hash, req.user.id]
            );
            
            res.json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            console.error('Update password error:', error);
            res.status(500).json({ message: 'Failed to update password' });
        }
    }
};