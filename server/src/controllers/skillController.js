import { skillModel } from '../models/skillModel.js';

export const skillController = {
    async getAll(req, res) {
        try {
            const skills = await skillModel.findAll();
            res.json({ success: true, data: skills });
        } catch (error) {
            console.error('Get skills error:', error);
            res.status(500).json({ message: 'Failed to fetch skills' });
        }
    },

    async create(req, res) {
        try {
            const id = await skillModel.create(req.body);
            const skill = await skillModel.findById(id);
            res.status(201).json({ success: true, data: skill });
        } catch (error) {
            console.error('Create skill error:', error);
            res.status(500).json({ message: 'Failed to create skill' });
        }
    },

    async update(req, res) {
        try {
            const updated = await skillModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Skill not found' });
            }
            const skill = await skillModel.findById(req.params.id);
            res.json({ success: true, data: skill });
        } catch (error) {
            console.error('Update skill error:', error);
            res.status(500).json({ message: 'Failed to update skill' });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await skillModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Skill not found' });
            }
            res.json({ success: true, message: 'Skill deleted successfully' });
        } catch (error) {
            console.error('Delete skill error:', error);
            res.status(500).json({ message: 'Failed to delete skill' });
        }
    }
};