import pool from '../config/db.js';

export const skillModel = {
    async findAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM skills ORDER BY category ASC, order_index ASC'
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM skills WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(skillData) {
        const { name, category, proficiency, icon_url, order_index } = skillData;
        const [result] = await pool.execute(
            'INSERT INTO skills (name, category, proficiency, icon_url, order_index) VALUES (?, ?, ?, ?, ?)',
            [name, category, proficiency, icon_url, order_index || 0]
        );
        return result.insertId;
    },

    async update(id, skillData) {
        const { name, category, proficiency, icon_url, order_index } = skillData;
        const [result] = await pool.execute(
            'UPDATE skills SET name = ?, category = ?, proficiency = ?, icon_url = ?, order_index = ? WHERE id = ?',
            [name, category, proficiency, icon_url, order_index, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM skills WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};