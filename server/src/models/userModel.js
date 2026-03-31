import pool from '../config/db.js';

export const userModel = {
    async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(userData) {
        const { username, email, password_hash, role = 'user' } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, role]
        );
        return result.insertId;
    },

    async update(id, userData) {
        const { username, email } = userData;
        const [result] = await pool.execute(
            'UPDATE users SET username = ?, email = ? WHERE id = ?',
            [username, email, id]
        );
        return result.affectedRows > 0;
    }
};