import pool from '../config/db.js';

export const projectModel = {
    async findAll() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC'
            );
            
            return rows.map(row => {
                let technologies = [];
                if (row.technologies) {
                    // Check if it's already a parsed JSON object or a string
                    if (typeof row.technologies === 'string') {
                        try {
                            technologies = JSON.parse(row.technologies);
                        } catch (e) {
                            // If it's a comma-separated string
                            technologies = row.technologies.split(',').map(t => t.trim());
                        }
                    } else if (Array.isArray(row.technologies)) {
                        // If it's already an array
                        technologies = row.technologies;
                    } else if (typeof row.technologies === 'object') {
                        // If it's a JSON object
                        technologies = Object.values(row.technologies);
                    }
                }
                return {
                    ...row,
                    technologies
                };
            });
        } catch (error) {
            console.error('Find all projects error:', error);
            throw error;
        }
    },

    async findFeatured() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM projects WHERE featured = true ORDER BY order_index ASC'
            );
            
            return rows.map(row => {
                let technologies = [];
                if (row.technologies) {
                    if (typeof row.technologies === 'string') {
                        try {
                            technologies = JSON.parse(row.technologies);
                        } catch (e) {
                            technologies = row.technologies.split(',').map(t => t.trim());
                        }
                    } else if (Array.isArray(row.technologies)) {
                        technologies = row.technologies;
                    } else if (typeof row.technologies === 'object') {
                        technologies = Object.values(row.technologies);
                    }
                }
                return {
                    ...row,
                    technologies
                };
            });
        } catch (error) {
            console.error('Find featured projects error:', error);
            throw error;
        }
    },

    async findById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM projects WHERE id = ?',
                [id]
            );
            
            if (rows.length === 0) return null;
            
            let technologies = [];
            if (rows[0].technologies) {
                if (typeof rows[0].technologies === 'string') {
                    try {
                        technologies = JSON.parse(rows[0].technologies);
                    } catch (e) {
                        technologies = rows[0].technologies.split(',').map(t => t.trim());
                    }
                } else if (Array.isArray(rows[0].technologies)) {
                    technologies = rows[0].technologies;
                } else if (typeof rows[0].technologies === 'object') {
                    technologies = Object.values(rows[0].technologies);
                }
            }
            
            return {
                ...rows[0],
                technologies
            };
        } catch (error) {
            console.error('Find project by id error:', error);
            throw error;
        }
    },

    async create(projectData) {
        try {
            const { title, description, image_url, github_url, live_url, technologies, featured, order_index } = projectData;
            
            // Convert technologies to JSON string
            const technologiesJson = JSON.stringify(technologies || []);
            
            const [result] = await pool.execute(
                `INSERT INTO projects 
                (title, description, image_url, github_url, live_url, technologies, featured, order_index) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, description || '', image_url || null, github_url || null, live_url || null, technologiesJson, featured || false, order_index || 0]
            );
            
            return result.insertId;
        } catch (error) {
            console.error('Create project error:', error);
            throw error;
        }
    },

    async update(id, projectData) {
        try {
            const { title, description, image_url, github_url, live_url, technologies, featured, order_index } = projectData;
            
            // Convert technologies to JSON string
            const technologiesJson = JSON.stringify(technologies || []);
            
            const [result] = await pool.execute(
                `UPDATE projects SET 
                title = ?, description = ?, image_url = ?, github_url = ?,
                live_url = ?, technologies = ?, featured = ?, order_index = ?
                WHERE id = ?`,
                [title, description || '', image_url || null, github_url || null, live_url || null, technologiesJson, featured || false, order_index || 0, id]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Update project error:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM projects WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Delete project error:', error);
            throw error;
        }
    }
};