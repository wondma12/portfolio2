import pool from '../config/db.js';

export const contactModel = {
    async findAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM messages ORDER BY created_at DESC'
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM messages WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(messageData) {
        const { name, email, subject, message } = messageData;
        const [result] = await pool.execute(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        return result.insertId;
    },

    async updateStatus(id, status) {
        const [result] = await pool.execute(
            'UPDATE messages SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM messages WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    async getUnreadCount() {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM messages WHERE status = "unread"'
        );
        return rows[0].count;
    }
};