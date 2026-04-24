import { Navigate, Outlet, useNavigate, Link } from 'react-router-dom';

export default function RutaPrivada() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    try {
        const payloadCodificado = token.split('.')[1];
        const payload = JSON.parse(atob(payloadCodificado));
        const fechaExpliracion = payload.exp * 100000;
        const tiempoActual = Date.now();

        if(tiempoActual >= fechaExpliracion){
            console.warn("El cadenero detecto un token vencido, acceso denegado");
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />
        }
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
}