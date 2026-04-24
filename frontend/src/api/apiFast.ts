import axios from 'axios';

const apiFast =  axios.create({
    baseURL: 'http://localhost:8001',
});

apiFast.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiFast