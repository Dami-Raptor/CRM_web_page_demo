import React, { useState } from "react";
import api from "../api";
import type { Lead, Person } from "../types";

interface LeadCardProps {
    person: Person;
    lead: Lead;
    onSuccess: () => void;
}

export default function LeadCard({ person, lead, onSuccess }: LeadCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editButget, setEditButget] = useState(lead.butget);
    const [editStatus, setEditStatus] = useState(lead.status);

    const getPriorityDetails = (budget: number) => {
        if (budget >= 10000) return { label: 'Alta', color: '#10B981' };
        if (budget >= 5000) return { label: 'Media', color: '#FBBF24' };
        return { label: 'Baja', color: '#F87171' };
    };

    const priority = getPriorityDetails(Number(editButget));
    const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar a ${person.name}?`)) {
        try {
            await api.delete(`leads/${lead.id}/`); 
            await api.delete(`persons/${person.id}/`)
            onSuccess();
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar el registro.");
        }
    }
};

    const handleUpdate = async () => {
        try {
            await api.patch(`leads/${lead.id}/`, {
                butget: editButget,
                status: editStatus,
                priority: priority.label
            });
            setIsEditing(false);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        }
    };

    const styles = {
        card: {
            backgroundColor: 'rgba(31, 41, 55, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '1.5rem',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1rem',
            position: 'relative' as const
        },
        input: {
            backgroundColor: '#111827',
            border: '1px solid #374151',
            color: 'white',
            borderRadius: '0.5rem',
            padding: '0.2rem 0.5rem',
            width: '100px'
        },
        btnEdit: {
            flex: 1,
            backgroundColor: '#F59E0B',
            color: 'white',
            border: 'none',
            padding: '0.4rem 1rem',
            borderRadius: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
        },
        btnSave: {
            flex: 1,
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.4rem 1rem',
            borderRadius: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
        },
        btnCancel: {
            flex: 1,
            backgroundColor: '#4B5563',
            color: 'white',
            border: 'none',
            padding: '0.4rem 1rem',
            borderRadius: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
        },
        btnDelete: {
            flex: 1,
            backgroundColor: '#DC2626',
            color: 'white',
            border: 'none',
            padding: '0.4rem 1rem',
            borderRadius: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
        }
    };

    return (
        <div style={styles.card}>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.8rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#60A5FA', margin: 0 }}>{person.name} {person.lastname}</h3>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{person.email}</div>
                
                {isEditing ? (
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} style={{...styles.input, marginTop: '0.5rem', width: '100%'}}>
                        <option value="Prospecto">Prospecto</option>
                        <option value="Cliente">Cliente</option>
                    </select>
                ) : (
                    <div style={{
                        display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold',
                        backgroundColor: lead.status === 'Cliente' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: lead.status === 'Cliente' ? '#10B981' : '#F59E0B',
                        border: `1px solid ${lead.status === 'Cliente' ? '#10B981' : '#F59E0B'}`, marginTop: '0.5rem'
                    }}>{lead.status}</div>
                )}
            </div>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94a3b8' }}>Presupuesto:</span>
                    {isEditing ? (
                        <input type="number" value={editButget} onChange={(e) => setEditButget(Number(e.target.value))} style={styles.input} />
                    ) : (
                        <span style={{ fontWeight: 'bold' }}>${lead.butget}</span>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Prioridad:</span>
                    <span style={{ fontWeight: 'bold', color: priority.color }}>{priority.label}</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {isEditing ? (
                    <div>
                        <button onClick={handleUpdate} style={styles.btnSave}>Guardar</button>
                        <button onClick={() => setIsEditing(false)} style={styles.btnCancel}>Cancelar</button>
                    </div>
                ) : (
                    <div>
                    <button onClick={() => setIsEditing(true)} style={styles.btnEdit}>
                        Editar
                    </button>
                    
                    <button 
                        onClick={handleDelete} 
                        style={styles.btnDelete}
                    >
                        Eliminar
                    </button>
                    </div>
                )}
            </div>
        </div>
    );
}