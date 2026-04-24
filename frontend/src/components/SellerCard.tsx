import { useState } from "react";
import { Droppable } from '@hello-pangea/dnd';
import type { Lead, Seller } from '../../types';
import LeadCard from './LeadCard';
import api from '../api/apiDjango';

interface SellerCardProps {
  seller: Seller;
  leads: Lead[];
  onSuccess: () => void;
}

export default function SellerCard({ seller, leads, onSuccess }: SellerCardProps) {
    // Busca todos los lead asigandos al seller por medio del id
    const leadsSeller = leads.filter(l => l.seller === seller.id);
    const [isEditing, setIsEditing] = useState(false);
    const [editCommission, setEditCommission] = useState(seller.commission * 100);
    // Obtiene las iniciales para el perfil
    const getInitials = (name: string, lastname: string) =>
        `${name?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase();
    // Eliminacion de seller
    const sellerDelete = async () => {
        // No debe tener leads asignados
        if (leadsSeller.length > 0) {
            alert(`No se puede eliminar al vendedor porque tiene ${leadsSeller.length} clientes asignados. Reasigna o elimina sus clientes primero.`);
            return;
        }
        if (window.confirm(`¿Estás seguro de eliminar al vendedor ${seller.person.name}?`)) {
            try {
                await api.delete(`/api/sellers/${seller.id}/`); 
                await api.delete(`/api/persons/${seller.person.id}/`);
                onSuccess();
            } catch (error) {
                console.error(error);
                alert("No se pudo eliminar el registro.");
            }
        }
    };
    // Actualizacion de la comision del seller
    const sellerUpdate = async () => {
        try {
            await api.patch(`/api/sellers/${seller.id}/`, {
                commission: editCommission / 100
            });
            onSuccess();
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error al actualizar los datos del vendedor");
        }
    };

    return (
    <div>
        <div className="group bg-[#0f172a] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all ">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400">
                {getInitials(seller.person.name, seller.person.lastname)}
            </div>
            <div>
                <p className="text-blue-400 font-bold text-base break-words">
                {seller.person.name} {seller.person.lastname}
                </p>
                <p className="text-xs text-gray-400 break-words">
                {seller.person.email}
                </p>
            </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {seller.badge}
            </span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4 border-y border-white/5 py-4">
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                $
            </div>
            <div>
                <p className="text-[10px] text-gray-400">Ventas</p>
                <p className="text-green-400 font-bold text-sm">
                ${seller.performance.toLocaleString()}
                </p>
            </div>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                {(seller.commission * 100).toFixed(0)}%
            </div>
            <div>
                <p className="text-[10px] text-gray-400">Comisión</p>
                <p className="text-blue-400 font-bold text-sm">
                ${(seller.performance * seller.commission).toFixed(2)}
                </p>
            </div>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                👤
            </div>
            <div>
                <p className="text-[10px] text-gray-400">Leads</p>
                <p className="text-purple-400 font-bold text-sm">
                {leadsSeller.length}
                </p>
            </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {['Prospecto', 'Cliente'].map(status => {
            const leadsFiltrados = leadsSeller.filter(l => l.status === status);
            return (
                <Droppable
                key={`${seller.id}-${status}`}
                droppableId={`vendedor-${seller.id}-${status}`}
                >
                {(provided, snapshot) => (
                    <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                        p-3 rounded-xl min-h-[180px]
                        transition-all
                        ${
                        snapshot.isDraggingOver
                            ? 'bg-blue-500/10 border border-blue-400 scale-[1.02]'
                            : 'bg-black/30 border border-white/5'
                        }
                    `}
                    >
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-semibold text-gray-400">
                        {status}
                        </p>
                        <span className="text-[10px] text-gray-500">
                        {leadsFiltrados.length}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {leadsFiltrados.map((lead, idx) => (
                        <LeadCard 
                            key={lead.id} 
                            lead={lead} 
                            index={idx} 
                            onSuccess={onSuccess}
                        />
                        ))}
                    </div>
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            );
            })}
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200">
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
                sellerDelete();
            }}
            className="text-red-400 hover:text-red-300 text-xs px-3 py-1 rounded-md hover:bg-red-500/10"
            >
            Eliminar
            </button>
        </div>
        </div>
        {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0f172a] rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-white font-bold mb-4">
                Editar Comisión - {seller.person.name}
            </h3>
            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                Porcentaje de Comisión (%)
                </label>
                <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editCommission}
                onChange={(e) => setEditCommission(Number(e.target.value))}
                className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                Valor actual: {(seller.commission * 100).toFixed(1)}%
                </p>
            </div>
            <div className="flex gap-3">
                <button
                onClick={() => {
                    setIsEditing(false);
                    setEditCommission(seller.commission * 100);
                }}
                className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                Cancelar
                </button>
                <button
                onClick={sellerUpdate}
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