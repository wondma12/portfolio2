import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Haymi@mysql1', // Your password
    database: 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10
});

// Test database connection
pool.getConnection()
    .then(conn => {
        console.log('✅ Database connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

const JWT_SECRET = 'mysecretkey123456789';

// ==================== AUTH MIDDLEWARE ====================
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
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
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ success: true, user: users[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== PROJECTS ROUTES ====================
// ==================== PROJECTS ROUTES ====================
app.get('/api/projects', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects ORDER BY order_index ASC');
        
        const projects = rows.map(project => {
            let technologies = [];
            
            if (project.technologies) {
                // Check the type of technologies
                if (typeof project.technologies === 'string') {
                    try {
                        // Try to parse as JSON
                        technologies = JSON.parse(project.technologies);
                    } catch (e) {
                        // If JSON parse fails, split by comma
                        technologies = project.technologies.split(',').map(t => t.trim());
                    }
                } else if (Array.isArray(project.technologies)) {
                    // Already an array
                    technologies = project.technologies;
                } else if (typeof project.technologies === 'object') {
                    // Object from MySQL JSON type
                    technologies = Object.values(project.technologies);
                }
            }
            
            return {
                id: project.id,
                title: project.title,
                description: project.description,
                image_url: project.image_url,
                github_url: project.github_url,
                live_url: project.live_url,
                technologies: technologies,
                featured: project.featured === 1,
                order_index: project.order_index,
                created_at: project.created_at,
                updated_at: project.updated_at
            };
        });
        
        res.json({ success: true, data: projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: error.stack 
        });
    }
});

app.post('/api/projects', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, description, image_url, github_url, live_url, technologies, featured, order_index } = req.body;
        
        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }
        
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
            `INSERT INTO projects 
            (title, description, image_url, github_url, live_url, technologies, featured, order_index) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description || '', image_url || null, github_url || null, live_url || null, technologiesJson, featured || false, order_index || 0]
        );
        
        const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
        
        res.status(201).json({ success: true, data: { ...newProject[0], technologies: techArray } });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/projects/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, description, image_url, github_url, live_url, technologies, featured, order_index } = req.body;
        
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
        
        res.json({ success: true, data: { ...updatedProject[0], technologies: techArray } });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== BLOG ROUTES ====================
// ==================== BLOG ROUTES ====================

// GET all blog posts
app.get('/api/blog', async (req, res) => {
    try {
        console.log('📡 GET /api/blog');
        
        let query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
        let params = [];
        
        // Filter by status if provided
        if (req.query.status === 'published') {
            query = 'SELECT * FROM blog_posts WHERE status = ? AND published_at <= NOW() ORDER BY published_at DESC';
            params = ['published'];
        } else if (req.query.status === 'all') {
            query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
        } else if (req.query.status === 'draft') {
            query = 'SELECT * FROM blog_posts WHERE status = ? ORDER BY created_at DESC';
            params = ['draft'];
        }
        
        const [rows] = await pool.query(query, params);
        console.log(`✅ Found ${rows.length} blog posts`);
        
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch blog posts',
            error: error.message 
        });
    }
});

// GET single blog post by slug
app.get('/api/blog/slug/:slug', async (req, res) => {
    try {
        console.log(`📡 GET /api/blog/slug/${req.params.slug}`);
        
        const [rows] = await pool.query(
            'SELECT * FROM blog_posts WHERE slug = ?',
            [req.params.slug]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }
        
        // Increment views
        await pool.query(
            'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
            [rows[0].id]
        );
        
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ Error fetching blog post:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch blog post' 
        });
    }
});

// GET single blog post by ID
app.get('/api/blog/:id', async (req, res) => {
    try {
        console.log(`📡 GET /api/blog/${req.params.id}`);
        
        const [rows] = await pool.query(
            'SELECT * FROM blog_posts WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }
        
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ Error fetching blog post:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch blog post' 
        });
    }
});

// CREATE blog post (admin only)
app.post('/api/blog', authenticateToken, isAdmin, async (req, res) => {
    try {
        console.log('📡 POST /api/blog');
        console.log('Request body:', req.body);
        
        const { title, content, excerpt, cover_image, status } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and content are required' 
            });
        }
        
        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        // Check if slug already exists
        const [existing] = await pool.query(
            'SELECT id FROM blog_posts WHERE slug = ?',
            [slug]
        );
        
        if (existing.length > 0) {
            // Append timestamp to make slug unique
            const uniqueSlug = `${slug}-${Date.now()}`;
            
            const [result] = await pool.query(
                `INSERT INTO blog_posts (title, slug, content, excerpt, cover_image, status, published_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, uniqueSlug, content, excerpt || '', cover_image || null, status || 'draft', 
                 status === 'published' ? new Date() : null]
            );
            
            const [newPost] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
            
            res.status(201).json({ success: true, data: newPost[0] });
        } else {
            const [result] = await pool.query(
                `INSERT INTO blog_posts (title, slug, content, excerpt, cover_image, status, published_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, slug, content, excerpt || '', cover_image || null, status || 'draft', 
                 status === 'published' ? new Date() : null]
            );
            
            const [newPost] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
            
            res.status(201).json({ success: true, data: newPost[0] });
        }
        
    } catch (error) {
        console.error('❌ Error creating blog post:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create blog post',
            error: error.message 
        });
    }
});

// UPDATE blog post (admin only)
app.put('/api/blog/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        console.log(`📡 PUT /api/blog/${req.params.id}`);
        console.log('Request body:', req.body);
        
        const { title, content, excerpt, cover_image, status } = req.body;
        
        // Check if post exists
        const [existing] = await pool.query(
            'SELECT * FROM blog_posts WHERE id = ?',
            [req.params.id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }
        
        // Generate new slug if title changed
        let slug = existing[0].slug;
        if (title && title !== existing[0].title) {
            slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            
            // Check if new slug already exists
            const [slugExists] = await pool.query(
                'SELECT id FROM blog_posts WHERE slug = ? AND id != ?',
                [slug, req.params.id]
            );
            
            if (slugExists.length > 0) {
                slug = `${slug}-${Date.now()}`;
            }
        }
        
        const [result] = await pool.query(
            `UPDATE blog_posts SET 
             title = ?, slug = ?, content = ?, excerpt = ?, cover_image = ?, status = ?,
             published_at = CASE 
                 WHEN status = 'published' AND published_at IS NULL THEN NOW() 
                 ELSE published_at 
             END
             WHERE id = ?`,
            [title || existing[0].title, slug, content || existing[0].content, 
             excerpt || existing[0].excerpt, cover_image || existing[0].cover_image, 
             status || existing[0].status, req.params.id]
        );
        
        const [updatedPost] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
        
        res.json({ success: true, data: updatedPost[0] });
        
    } catch (error) {
        console.error('❌ Error updating blog post:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update blog post',
            error: error.message 
        });
    }
});

// DELETE blog post (admin only)
app.delete('/api/blog/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        console.log(`📡 DELETE /api/blog/${req.params.id}`);
        
        const [result] = await pool.query(
            'DELETE FROM blog_posts WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Blog post deleted successfully' 
        });
        
    } catch (error) {
        console.error('❌ Error deleting blog post:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete blog post',
            error: error.message 
        });
    }
});

// ==================== CONTACT ROUTES ====================
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, subject || '', message, 'unread']
        );
        
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/contact', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/contact/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/contact/:id/read', authenticateToken, isAdmin, async (req, res) => {
    try {
        console.log(`Marking message ${req.params.id} as read`);
        
        const [result] = await pool.query(
            'UPDATE messages SET status = ? WHERE id = ?',
            ['read', req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        
        res.json({ success: true, message: 'Message marked as read' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/contact/:id/reply', authenticateToken, isAdmin, async (req, res) => {
    try {
        console.log(`Marking message ${req.params.id} as replied`);
        
        const [result] = await pool.query(
            'UPDATE messages SET status = ? WHERE id = ?',
            ['replied', req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        
        res.json({ success: true, message: 'Message marked as replied' });
    } catch (error) {
        console.error('Error marking message as replied:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/contact/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== USERS ROUTES ====================
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
        }
        
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== PROFILE ROUTES ====================
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM profile WHERE user_id = ?', [req.user.id]);
        res.json({ success: true, data: rows[0] || null });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location } = req.body;
        
        const [existing] = await pool.query('SELECT id FROM profile WHERE user_id = ?', [req.user.id]);
        
        if (existing.length === 0) {
            await pool.query(
                `INSERT INTO profile (user_id, name, title, bio, avatar_url, resume_url, github_url, linkedin_url, twitter_url, email, phone, location) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [req.user.id, name || null, title || null, bio || null, avatar_url || null, resume_url || null, 
                 github_url || null, linkedin_url || null, twitter_url || null, email || null, phone || null, location || null]
            );
        } else {
            await pool.query(
                `UPDATE profile SET name = ?, title = ?, bio = ?, avatar_url = ?, resume_url = ?,
                 github_url = ?, linkedin_url = ?, twitter_url = ?, email = ?, phone = ?, location = ?
                 WHERE user_id = ?`,
                [name || null, title || null, bio || null, avatar_url || null, resume_url || null,
                 github_url || null, linkedin_url || null, twitter_url || null, email || null, phone || null, location || null, req.user.id]
            );
        }
        
        const [updated] = await pool.query('SELECT * FROM profile WHERE user_id = ?', [req.user.id]);
        
        res.json({ success: true, data: updated[0] || null, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
   console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login\n`);
});