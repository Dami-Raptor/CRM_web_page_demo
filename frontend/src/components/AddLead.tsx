import React, { useState } from "react";
import api from "../api";

interface AddLeadProps {
    onSuccess: () => void;
}

export default function AddLead({ onSuccess }: AddLeadProps) {
    const [newName, setNewName] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newButget, setNewButget] = useState<number | ''>(1.0);
    const [newStatus, setNewStatus] = useState<'Prospecto' | 'Cliente'>('Prospecto');
    const calcularPrioridad = (b: number) => {
        if (b >= 10000) return 'Alta';
        if (b >= 5000) return 'Media';
        return 'Baja';
    };

    const crearTodo = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const resPerson = await api.post('persons/', {
                name: newName,
                lastname: newLastname, 
                email: newEmail,
            });

            const personId = resPerson.data.id;

            await api.post('leads/', {
                person: personId, 
                butget: newButget === '' ? 1.0 : newButget,
                status: newStatus,
                priority: calcularPrioridad(Number(newButget)) 
            });

            setNewName(''); 
            setNewLastname(''); 
            setNewEmail('');
            setNewButget(1.0); 
            setNewStatus('Prospecto'); 
            
            onSuccess();
            alert("¡Lead registrado con éxito!");

        } catch (error: any) {
            console.error("Error al registrar:", error.response?.data);
            alert("Error: " + JSON.stringify(error.response?.data || "Verifica los datos"));
        }
    };

    const styles = {
        card: {
            backgroundColor: 'rgba(31, 41, 55, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontFamily: "'Inter', sans-serif"
        },
        sectionTitle: { fontSize: '1.2rem', color: '#60A5FA', marginBottom: '1.2rem', fontWeight: 'bold' as const },
        group: { marginBottom: '0.8rem' },
        label: { fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', marginLeft: '1rem' },
        input: { 
            width: '100%', padding: '0.8rem 1.2rem', backgroundColor: '#111827', color: 'white', 
            border: '1px solid #374151', borderRadius: '2rem', outline: 'none', boxSizing: 'border-box' as const 
        },
        button: {
            width: '100%', background: 'linear-gradient(90deg, #10B981 0%, #3b82f6 100%)',
            color: 'white', fontWeight: 'bold' as const, padding: '1rem', borderRadius: '2rem',
            border: 'none', cursor: 'pointer', marginTop: '1.5rem', fontSize: '1rem'
        }
    };

    return (
        <div style={styles.card}>
            <form onSubmit={crearTodo}>
                <h3 style={styles.sectionTitle}>Registrar Lead</h3>
                
                <div style={styles.group}>
                    <label style={styles.label}>Nombre</label>
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required style={styles.input} />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Apellido</label>
                    <input type="text" value={newLastname} onChange={(e) => setNewLastname(e.target.value)} style={styles.input} />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Email</label>
                    <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required style={styles.input} />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Presupuesto ($)</label>
                    <input type="number" value={newButget} onChange={(e) => setNewButget(e.target.value === '' ? '' : Number(e.target.value))} style={styles.input} />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Estado</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} style={styles.input}>
                        <option value="Prospecto">Prospecto</option>
                        <option value="Cliente">Cliente</option>
                    </select>
                </div>
                <button type="submit" style={styles.button}>
                    Registrar Lead
                </button>
            </form>
        </div>
    );
}