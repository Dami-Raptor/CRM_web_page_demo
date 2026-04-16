import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import type { AuthTokens } from '../types'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');

    try {
      const response = await api.post<AuthTokens>('token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
    }
  };

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)',
      fontFamily: "'Inter', sans-serif",
      color: 'white',
      overflow: 'hidden',
    },
    card: {
      backgroundColor: 'rgba(15, 23, 42, 0.6)', 
      backdropFilter: 'blur(12px)',
      padding: '3.5rem 2.5rem',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      width: '90%',
      maxWidth: '420px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      textAlign: 'center' as const,
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '1rem',
      marginBottom: '2rem',
    },
    input: {
      width: '100%',
      padding: '1.1rem 1.5rem',
      borderRadius: '2.5rem', 
      backgroundColor: '#0f172a',
      border: '1px solid #1e293b',
      color: 'white',
      fontSize: '1rem',
      marginBottom: '1.2rem',
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    button: {
      width: '100%',
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.1rem',
      padding: '1.1rem',
      borderRadius: '2.5rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '1.5rem',
      boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.5)',
    },
    link: {
      color: '#6366f1',
      fontSize: '0.9rem',
      textDecoration: 'none',
      cursor: 'pointer',
    }
  };

  return (
    <div>
      <style>{`
        body, html { 
          margin: 0; 
          padding: 0; 
          width: 100%; 
          height: 100%; 
          overflow: hidden;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Login</h1>
          <p style={styles.subtitle}>Please sign in to continue</p>

          {error && (
            <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.8rem', borderRadius: '1rem', marginBottom: '1.2rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />

            <div style={{ textAlign: 'left', paddingLeft: '1rem' }}>
              <span style={styles.link}>Forget password?</span>
            </div>

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
            Don't have an account? <span style={styles.link}>click here</span>
          </p>
        </div>
      </div>
    </div>
  );
}