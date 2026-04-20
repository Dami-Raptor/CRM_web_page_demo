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

api.interceptors.response.use((response) => response, // Si la respuesta es OK, no hacemos nada
    async (error) => {
        const originalRequest = error.config;
        // Si el error es 401 y no intentamos refrescar antes
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const res = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                if (res.status === 200) {
                    const newAccessToken = res.data.access;
                    localStorage.setItem('access_token', newAccessToken); // Guardar el nuevo access_token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Actualizar el header de la peticion original
                    return api(originalRequest); // Reintentar la peticion original con el nuevo token
                }
            } catch (refreshError) {
                // Si el refresh token también expiro, mandamos al login
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default api;