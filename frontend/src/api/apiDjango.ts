import axios from 'axios';

const apiDjango =  axios.create({
    baseURL: 'http://localhost:8000/',
});

apiDjango.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiDjango.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response && error.response.status === 401){
            console.warn("Token muerto. Limpiando y enviando al login...");
            localStorage.removeItem("token");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
    
);

export default apiDjango