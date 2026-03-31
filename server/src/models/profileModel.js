import pool from '../config/db.js';

export const profileModel = {
    async findById(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM profile WHERE user_id = ?',
            [userId]
        );
        return rows[0];
    },

    async create(profileData) {
        const { user_id, name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location } = profileData;
        const [result] = await pool.execute(
            `INSERT INTO profile 
            (user_id, name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location]
        );
        return result.insertId;
    },

    async update(userId, profileData) {
        const { name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location } = profileData;
        const [result] = await pool.execute(
            `UPDATE profile SET 
            name = ?, title = ?, bio = ?, avatar_url = ?, resume_url = ?,
            github_url = ?, linkedin_url = ?, twitter_url = ?, email = ?, phone = ?, location = ?
            WHERE user_id = ?`,
            [name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location, userId]
        );
        return result.affectedRows > 0;
    }
};