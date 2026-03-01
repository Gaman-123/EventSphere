import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

// Admin API for protected routes
const adminApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

adminApi.interceptors.request.use((config) => {
    const adminKey = localStorage.getItem('v_admin_key');
    if (adminKey) {
        config.headers['x-admin-key'] = adminKey;
    }
    return config;
});

export { api, adminApi };
export default api;
