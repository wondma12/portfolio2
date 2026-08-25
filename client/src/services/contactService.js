import api from './api';

export const contactService = {
    async sendMessage(messageData) {
        const response = await api.post('/contact', messageData);
        return response.data;
    },
    
    async getAll() {
        const response = await api.get('/contact');
        return response.data;
    },
    
    async markAsRead(id) {
        const response = await api.put(`/contact/${id}/read`);
        return response.data;
    },
    
    async delete(id) {
        const response = await api.delete(`/contact/${id}`);
        return response.data;
    }
};