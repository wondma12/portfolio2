import api from './api';

export const blogService = {
    async getAll(status = 'published') {
        const response = await api.get(`/blog?status=${status}`);
        return response.data;
    },
    
    async getBySlug(slug) {
        const response = await api.get(`/blog/slug/${slug}`);
        return response.data;
    },
    
    async getById(id) {
        const response = await api.get(`/blog/${id}`);
        return response.data;
    },
    
    async create(postData) {
        const response = await api.post('/blog', postData);
        return response.data;
    },
    
    async update(id, postData) {
        const response = await api.put(`/blog/${id}`, postData);
        return response.data;
    },
    
    async delete(id) {
        const response = await api.delete(`/blog/${id}`);
        return response.data;
    }
};