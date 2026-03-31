import pool from '../config/db.js';

export const projectController = {
    async getAll(req, res) {
        try {
            const [rows] = await pool.query('SELECT * FROM projects ORDER BY order_index ASC');
            
            const projects = rows.map(project => {
                let technologies = [];
                if (project.technologies) {
                    if (typeof project.technologies === 'string') {
                        try {
                            technologies = JSON.parse(project.technologies);
                        } catch (e) {
                            technologies = project.technologies.split(',').map(t => t.trim());
                        }
                    } else if (Array.isArray(project.technologies)) {
                        technologies = project.technologies;
                    }
                }
                return { ...project, technologies };
            });
            
            res.json({ success: true, data: projects });
        } catch (error) {
            console.error('Get all projects error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async create(req, res) {
        try {
            const { title, description, image_url, github_url, live_url, technologies, featured, order_index } = req.body;
            
            // Validate required fields
            if (!title) {
                return res.status(400).json({ success: false, message: 'Title is required' });
            }
            
            // Process technologies
            let techArray = [];
            if (technologies) {
                if (Array.isArray(technologies)) {
                    techArray = technologies;
                } else if (typeof technologies === 'string') {
                    techArray = technologies.split(',').map(t => t.trim());
                }
            }
            
            const technologiesJson = JSON.stringify(techArray);
            
            // Insert into database
            const [result] = await pool.query(
                `INSERT INTO projects 
                (title, description, image_url, github_url, live_url, technologies, featured, order_index) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, description || '', image_url || null, github_url || null, live_url || null, technologiesJson, featured || false, order_index || 0]
            );
            
            // Get the created project
            const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
            
            const project = {
                ...newProject[0],
                technologies: techArray
            };
            
            res.status(201).json({ success: true, data: project });
        } catch (error) {
            console.error('Create project error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const { title, description, image_url, github_url, live_url, technologies, featured, order_index } = req.body;
            
            // Process technologies
            let techArray = [];
            if (technologies) {
                if (Array.isArray(technologies)) {
                    techArray = technologies;
                } else if (typeof technologies === 'string') {
                    techArray = technologies.split(',').map(t => t.trim());
                }
            }
            
            const technologiesJson = JSON.stringify(techArray);
            
            const [result] = await pool.query(
                `UPDATE projects SET 
                title = ?, description = ?, image_url = ?, github_url = ?,
                live_url = ?, technologies = ?, featured = ?, order_index = ?
                WHERE id = ?`,
                [title, description || '', image_url || null, github_url || null, live_url || null, technologiesJson, featured || false, order_index || 0, req.params.id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            
            const [updatedProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
            
            res.json({ 
                success: true, 
                data: { ...updatedProject[0], technologies: techArray }
            });
        } catch (error) {
            console.error('Update project error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            
            res.json({ success: true, message: 'Project deleted successfully' });
        } catch (error) {
            console.error('Delete project error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};