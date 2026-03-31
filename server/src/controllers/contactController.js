import pool from '../config/db.js';

export const contactController = {
    async sendMessage(req, res) {
        try {
            const { name, email, subject, message } = req.body;
            
            if (!name || !email || !message) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Name, email, and message are required' 
                });
            }
            
            const [result] = await pool.execute(
                'INSERT INTO messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, ?)',
                [name, email, subject || '', message, 'unread']
            );
            
            res.status(201).json({ 
                success: true, 
                message: 'Message sent successfully' 
            });
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send message' 
            });
        }
    },

    async getAllMessages(req, res) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM messages ORDER BY created_at DESC'
            );
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch messages' 
            });
        }
    },

    async getMessageById(req, res) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM messages WHERE id = ?',
                [req.params.id]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Message not found' 
                });
            }
            
            res.json({ success: true, data: rows[0] });
        } catch (error) {
            console.error('Get message error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch message' 
            });
        }
    },

    async markAsRead(req, res) {
        try {
            console.log(`Marking message ${req.params.id} as read`);
            
            const [result] = await pool.execute(
                'UPDATE messages SET status = ? WHERE id = ?',
                ['read', req.params.id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Message not found' 
                });
            }
            
            res.json({ 
                success: true, 
                message: 'Message marked as read' 
            });
        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to update message' 
            });
        }
    },

    async markAsReplied(req, res) {
        try {
            console.log(`Marking message ${req.params.id} as replied`);
            
            const [result] = await pool.execute(
                'UPDATE messages SET status = ? WHERE id = ?',
                ['replied', req.params.id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Message not found' 
                });
            }
            
            res.json({ 
                success: true, 
                message: 'Message marked as replied' 
            });
        } catch (error) {
            console.error('Mark as replied error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to update message' 
            });
        }
    },

    async deleteMessage(req, res) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM messages WHERE id = ?',
                [req.params.id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Message not found' 
                });
            }
            
            res.json({ 
                success: true, 
                message: 'Message deleted successfully' 
            });
        } catch (error) {
            console.error('Delete message error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to delete message' 
            });
        }
    }
};