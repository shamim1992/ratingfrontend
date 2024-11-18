// src/utils/api.js
import { ApiUrl } from '@/AppUrl';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: ApiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 errors
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            
            // Show error message
            const message = error.response.data?.error || 'An error occurred';
            toast.error(message);
        } else {
            toast.error('Network error occurred');
        }
        return Promise.reject(error);
    }
);

export default api;