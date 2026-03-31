import pool from '../config/db.js';

export const profileController = {
    async getProfile(req, res) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM profile WHERE user_id = ?',
                [req.user.id]
            );
            
            res.json({ success: true, data: rows[0] || null });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Failed to fetch profile' });
        }
    },

    async updateProfile(req, res) {
        try {
            const { name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location } = req.body;
            
            const [existing] = await pool.execute(
                'SELECT id FROM profile WHERE user_id = ?',
                [req.user.id]
            );
            
            if (existing.length === 0) {
                await pool.execute(
                    `INSERT INTO profile (user_id, name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [req.user.id, name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location]
                );
            } else {
                await pool.execute(
                    `UPDATE profile SET 
                     name = ?, title = ?, bio = ?, avatar_url = ?, resume_url = ?,
                     github_url = ?, linkedin_url = ?, twitter_url = ?, email = ?, phone = ?, location = ?
                     WHERE user_id = ?`,
                    [name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location, req.user.id]
                );
            }
            
            res.json({ success: true, message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Failed to update profile' });
        }
    }
};