import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import type { AuthTokens } from '../types'; 
// Componentes para el login
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook para redireccionar a otras paginas

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); //Evita que el formulario recargue la pagina
    setError('');

    try {
      const response = await api.post<AuthTokens>('token/', { // Obtener tokens de autenticacion
        username,
        password,
      });

      const { access, refresh } = response.data; // Guardar tokens en localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a1b3a_0%,_#020205_100%)]" />
      <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-blue-500/30 shadow-2xl w-full max-w-[400px] shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <h3 className="text-xl font-bold text-white">Login</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6 ml-1">Please sign in to continue</p>
        {error && (
          <div className="mb-5 p-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/30">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-4 font-medium uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-600"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-4 font-medium uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-600"
              required
            />
          </div>
          <div className="text-left px-2">
            <a href="#" className="text-blue-400 text-xs hover:underline transition-colors">
              Forget password?
            </a>
          </div>
          <div className="pt-2">
            <button
              onClick={handleLogin}
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-blue-900/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
              LOGIN
            </button>
          </div>
          <p className="text-gray-500 text-xs text-center pt-4">
            Don't have an account?{' '}
            <span className="text-blue-400 cursor-pointer hover:underline transition-colors">
              click here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}