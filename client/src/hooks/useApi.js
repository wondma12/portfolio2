import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data = null, options = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            let response;
            switch (method.toLowerCase()) {
                case 'get':
                    response = await api.get(url, options);
                    break;
                case 'post':
                    response = await api.post(url, data, options);
                    break;
                case 'put':
                    response = await api.put(url, data, options);
                    break;
                case 'delete':
                    response = await api.delete(url, options);
                    break;
                default:
                    throw new Error('Invalid method');
            }
            
            if (options.showSuccess) {
                toast.success(options.successMessage || 'Operation completed successfully');
            }
            
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            if (options.showError) {
                toast.error(err.response?.data?.message || 'An error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, request };
};