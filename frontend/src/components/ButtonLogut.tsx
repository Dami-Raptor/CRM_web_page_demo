import { useNavigate } from 'react-router-dom'

const ButtonLogut = () => {
    const navigate = useNavigate();
    const manejarCerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/login')
    };

    return(                 
            <button
                onClick={manejarCerrarSesion}
                className="py-2 px-6 bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-500 font-semibold rounded-full transition-all duration-200"
            >
            Cerrar Sesión
            </button>
    );
};

export default ButtonLogut;