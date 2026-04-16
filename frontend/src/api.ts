import axios from 'axios';
import type {InternalAxiosRequestConfig} from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', 
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default api;