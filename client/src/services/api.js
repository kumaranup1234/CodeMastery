
import axios from 'axios';


// https://code-mastery-backend.vercel.app/api
// http://localhost:5000/api
const API_URL = 'https://code-mastery-backend.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });
export const getProfile = () => api.get('/user/me');
export const syncProgress = (data) => api.put('/user/sync', data);

export default api;
