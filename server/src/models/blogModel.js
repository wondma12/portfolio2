import pool from '../config/db.js';

export const blogModel = {
    async findAll(status = 'published') {
        let query = 'SELECT * FROM blog_posts';
        const params = [];
        
        if (status === 'published') {
            query += ' WHERE status = ? AND published_at <= NOW()';
            params.push('published');
        }
        
        query += ' ORDER BY published_at DESC, created_at DESC';
        
        const [rows] = await pool.execute(query, params);
        return rows;
    },

    async findBySlug(slug) {
        const [rows] = await pool.execute(
            'SELECT * FROM blog_posts WHERE slug = ?',
            [slug]
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM blog_posts WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(postData) {
        const { title, slug, content, excerpt, cover_image, status } = postData;
        const [result] = await pool.execute(
            `INSERT INTO blog_posts 
            (title, slug, content, excerpt, cover_image, status, published_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, content, excerpt, cover_image, status, status === 'published' ? new Date() : null]
        );
        return result.insertId;
    },

    async update(id, postData) {
        const { title, slug, content, excerpt, cover_image, status } = postData;
        const [result] = await pool.execute(
            `UPDATE blog_posts SET 
            title = ?, slug = ?, content = ?, excerpt = ?,
            cover_image = ?, status = ?, published_at = ?
            WHERE id = ?`,
            [title, slug, content, excerpt, cover_image, status, status === 'published' ? new Date() : null, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM blog_posts WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    async incrementViews(id) {
        await pool.execute(
            'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
            [id]
        );
    }
};