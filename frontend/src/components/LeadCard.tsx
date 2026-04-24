import React, { useState } from "react";
import { Draggable } from '@hello-pangea/dnd';
import type { Lead, Person } from '../../types';
import api from '../api/apiDjango';

interface LeadCardProps {
    lead: Lead;
    index: number;
    onSuccess: () => void;
}

export default function LeadCard({ lead, index, onSuccess }: LeadCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editButget, setEditButget] = useState(lead.butget);
    // Asignacion de colores por prioridad
    const getPriorityStyles = (priority: string) => {
        if (priority === 'Alta') {
            return {
                dot: 'bg-green-400',
                text: 'text-green-400'
            };
        }
        if (priority === 'Media') {
            return {
                dot: 'bg-yellow-400',
                text: 'text-yellow-400'
            };
        }
        return {
            dot: 'bg-red-400',
            text: 'text-red-400'
        };
    };
    // Captura de las iniciales para su perfil
    const getInitials = (name: string, lastname: string) => {
        return `${name?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase();
    };
    // Esxtrae la prioridad actual
    const priority = getPriorityStyles(lead.priority);
    // Actualizacion de presupuesto
    const leadUpdate = async () => {
        try {
            // Calculo de la prioridad
            let nuevaPrioridad = 'Baja';
            if (editButget >= 10000) nuevaPrioridad = 'Alta';
            else if (editButget >= 5000) nuevaPrioridad = 'Media';
            await api.patch(`/api/leads/${lead.id}/`, {
                butget: Number(editButget),
                priority: nuevaPrioridad
            });
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        }
    };
    // Eliminacion del lead
    const leadDelete = async () => {
        if (window.confirm(`¿Estás seguro de eliminar a ${lead.person.name}?`)) {
            try {
                await api.delete(`/api/leads/${lead.id}/`); 
                await api.delete(`/api/persons/${lead.person.id}/`);
                onSuccess();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
    <div>
        <Draggable
        key={lead.id}
        draggableId={lead.id.toString()}
        index={index}
        >
        {(provided, snapshot) => (
            <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
                group
                bg-gradient-to-br from-[#0f172a] to-[#020617]
                border border-white/10
                p-4 rounded-2xl
                transition-all duration-200
                cursor-grab active:cursor-grabbing
                ${
                snapshot.isDragging
                    ? 'scale-105 shadow-2xl border-blue-500'
                    : 'hover:border-white/20 hover:shadow-lg'
                }
            `}
            >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400 shadow-inner">
                {getInitials(lead.person.name, lead.person.lastname)}
                </div>
                <div className="flex-1">
                <p className="font-semibold text-white text-sm break-words">
                    {lead.person.name} {lead.person.lastname}
                </p>
                <p className="text-xs text-gray-400 break-words">
                    {lead.person.email}
                </p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-xl font-bold text-green-400 tracking-tight">
                ${lead.butget.toLocaleString()}
                </p>
            </div>
            <div className="flex justify-between items-center mt-3">
                <span className={`
                text-xs px-3 py-1 rounded-full font-medium
                ${
                    lead.status === 'Cliente'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-orange-500/20 text-orange-400'
                }
                `}>
                {lead.status}
                </span>
                <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${priority.dot}`} />
                <span className={`text-xs font-medium ${priority.text}`}>
                    {lead.priority}
                </span>
                </div>
            </div>
            <div className="
                flex justify-end gap-2 mt-4 pt-3 border-t border-white/5
                opacity-0 group-hover:opacity-100
                transition-all duration-200
            ">
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="text-blue-400 hover:text-blue-300 text-xs px-3 py-1 rounded-md hover:bg-blue-500/10"
                >
                Editar
                </button>
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    leadDelete();
                }}
                className="text-red-400 hover:text-red-300 text-xs px-3 py-1 rounded-md hover:bg-red-500/10"
                >
                Eliminar
                </button>
            </div>
            </div>
        )}
        </Draggable>
        {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0f172a] rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-xl">
            <h3 className="text-white font-bold mb-4">
                Editar Presupuesto
            </h3>
            <input
                type="number"
                value={editButget}
                onChange={(e) => setEditButget(Number(e.target.value))}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white mb-4 outline-none focus:border-blue-500"
                autoFocus
            />
            <div className="flex gap-3">
                <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                Cancelar
                </button>
                <button
                onClick={leadUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                Guardar
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
    );
}