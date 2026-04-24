import { Navigate, Outlet } from 'react-router-dom';

export default function RutaPublica() {
    const token = localStorage.getItem('token');
    
    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}