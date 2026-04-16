import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Lead, Person } from '../types';
import AddLead from "../components/AddLead";
import LeadCard from '../components/LeadCard'; 
export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        cargarTablero();
    }, []);

    const cargarTablero = async () => {
        try {
            const [resLeads, resPersons] = await Promise.all([
                api.get<Lead[]>('leads/'),
                api.get<Person[]>('persons/')
            ]);
            setLeads(resLeads.data);
            setPersons(resPersons.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };
    const getPersonData = (personId: number) => {
        const person = persons.find(p => p.id === personId);
        return person || { name: 'Desconocido', lastName: '', email: '' } as Person;
    };

    const styles = {
        container: {
            minHeight: '100vh',
            width: '100vw',
            background: 'radial-gradient(circle at center, #1a1b3a 0%, #020205 100%)',
            color: 'white',
            fontFamily: "'Inter', sans-serif",
            padding: '2rem',
            boxSizing: 'border-box' as const,
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        title: {
            fontSize: '2.2rem',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        mainLayout: {
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'flex-start',
        },
        sidebar: {
            width: '400px',
            position: 'sticky' as const,
            top: '2rem',
        },
        gridContainer: {
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
        }
    };

    return (
        <div style={styles.container}>
            <style>{`body, html { margin: 0; padding: 0; overflow-x: hidden; }`}</style>

            <header style={styles.header}>
                <h1 style={styles.title}>CRM - Gestión de Leads</h1>
                <button onClick={handleLogout} style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    color: '#F87171',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '2rem',
                    border: '1px solid #DC2626',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}>
                    Cerrar sesión
                </button>
            </header>

            <div style={styles.mainLayout}>
                <aside style={styles.sidebar}>
                    <AddLead onSuccess={cargarTablero} />
                </aside>

                <main style={styles.gridContainer}>
                    {leads.length === 0 ? (
                        <p style={{ color: '#64748b' }}>No hay registros disponibles</p>
                    ) : (
                        leads.map((lead) => (
                            <LeadCard
                                key={lead.id}
                                lead={lead}
                                person={getPersonData(lead.person)} 
                                onSuccess={cargarTablero}
                            />
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}