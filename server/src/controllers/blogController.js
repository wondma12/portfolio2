import { blogModel } from '../models/blogModel.js';

export const blogController = {
    async getAll(req, res) {
        try {
            const status = req.query.status === 'all' ? null : req.query.status || 'published';
            const posts = status === null ? await blogModel.findAll() : await blogModel.findAll(status);
            res.json({ success: true, data: posts });
        } catch (error) {
            console.error('Get blog posts error:', error);
            res.status(500).json({ message: 'Failed to fetch blog posts' });
        }
    },

    async getBySlug(req, res) {
        try {
            const post = await blogModel.findBySlug(req.params.slug);
            if (!post) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
            await blogModel.incrementViews(post.id);
            res.json({ success: true, data: post });
        } catch (error) {
            console.error('Get blog post error:', error);
            res.status(500).json({ message: 'Failed to fetch blog post' });
        }
    },

    async getOne(req, res) {
        try {
            const post = await blogModel.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
            res.json({ success: true, data: post });
        } catch (error) {
            console.error('Get blog post error:', error);
            res.status(500).json({ message: 'Failed to fetch blog post' });
        }
    },

    async create(req, res) {
        try {
            const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const postData = { ...req.body, slug };
            const id = await blogModel.create(postData);
            const post = await blogModel.findById(id);
            res.status(201).json({ success: true, data: post });
        } catch (error) {
            console.error('Create blog post error:', error);
            res.status(500).json({ message: 'Failed to create blog post' });
        }
    },

    async update(req, res) {
        try {
            const postData = { ...req.body };
            if (req.body.title) {
                postData.slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            }
            const updated = await blogModel.update(req.params.id, postData);
            if (!updated) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
            const post = await blogModel.findById(req.params.id);
            res.json({ success: true, data: post });
        } catch (error) {
            console.error('Update blog post error:', error);
            res.status(500).json({ message: 'Failed to update blog post' });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await blogModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
            res.json({ success: true, message: 'Blog post deleted successfully' });
        } catch (error) {
            console.error('Delete blog post error:', error);
            res.status(500).json({ message: 'Failed to delete blog post' });
        }
    }
};