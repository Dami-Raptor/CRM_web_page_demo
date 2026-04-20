import React, { useState } from "react";
import api from "../api";
import type { Seller, Lead, Person } from "../types";
import Button from "./Button";

interface LeadCardProps {
    person: Person;
    lead: Lead;
    seller: Seller[]; 
    onSuccess: () => void;
}
export default function LeadCard({ person, lead, seller = [], onSuccess }: LeadCardProps) {
    const [isEditing, setIsEditing] = useState(false); // Bandera para saber si estamos editando
    const [editButget, setEditButget] = useState(lead.butget);
    const [editStatus, setEditStatus] = useState(lead.status);
    const [editSeller, setEditSeller] = useState(lead.seller);
    console.log("Contenido de seller:", seller);
    const getPriorityDetails = (budget: number) => {
        if (budget >= 10000) return { label: 'Alta', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' };
        if (budget >= 5000) return { label: 'Media', bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' };
        return { label: 'Baja', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' };
    };
    const priority = getPriorityDetails(Number(editButget));
    const currentSellerInfo = seller?.find(s => s.id === lead.seller);
    const leadUpdate = async () => {
        try {
            await api.patch(`leads/${lead.id}/`, {
                butget: Number(editButget),
                status: editStatus,
                priority: priority.label,
                seller: editSeller
            });
            setIsEditing(false);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        }
    };
    const leadDelete = async () => {
        if (window.confirm(`¿Estás seguro de eliminar a ${person.name}?`)) {
            try {
                await api.delete(`leads/${lead.id}/`); 
                await api.delete(`persons/${person.id}/`);
                onSuccess();
            } catch (error) {
                console.error(error);
            }
        }
    };
    return (
        <div className="group bg-gray-800/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-xl transition-all hover:border-blue-500/30">
            <div className="border-b border-white/5 pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-blue-400">
                            {person.name} {person.lastname}
                        </h3>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{person.email}</p>
                    </div>
                    {!isEditing && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lead.status === 'Cliente' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                            {lead.status}
                        </span>
                    )}
                </div>
                {isEditing && (
                    <select 
                        value={editStatus} 
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full mt-3 bg-gray-900/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    >
                        <option value="Prospecto">Prospecto</option>
                        <option value="Cliente">Cliente</option>
                    </select>
                )}
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Presupuesto:</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={editButget} 
                            onChange={(e) => setEditButget(Number(e.target.value))}
                            className="w-24 bg-gray-900/60 border border-gray-700 rounded-lg px-2 py-1 text-right text-white outline-none focus:border-blue-500"/>
                    ):(
                        <span className="font-mono font-bold text-white text-base">${lead.butget.toLocaleString()}</span>
                    )}
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Prioridad:</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${priority.bg} ${priority.text} ${priority.border}`}>
                        {priority.label.toUpperCase()}
                    </span>
                </div>
                <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter block mb-2">Vendedor Asignado</span>
                    {isEditing ? (
                        <select 
                            value={editSeller ?? ""} 
                            onChange={(e) => setEditSeller(e.target.value === "" ? null : Number(e.target.value))}
                            className="w-full bg-gray-900/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
                            <option value="">Sin vendedor asignado</option>
                            {seller.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} {s.lastname} ({s.badget})
                                </option>
                            ))}
                        </select>
                    ):(
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400 border border-purple-500/30">
                                {currentSellerInfo?.badget || "?"}
                            </div>
                            <span className="text-xs font-bold text-gray-200">
                                {currentSellerInfo ? `${currentSellerInfo.name} ${currentSellerInfo.lastname}` : "Sin asignar"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2 mt-6">
                {isEditing ? (
                    <>
                        <Button variant="primary" onClick={leadUpdate} className="flex-1 py-2 text-xs">Guardar</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 py-2 text-xs border-white/10">Cancelar</Button>
                    </>
                ):(
                    <div className="flex w-full gap-2">
                        <button onClick={() => setIsEditing(true)} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 transition-all cursor-pointer">
                            Editar
                        </button>
                        <button onClick={leadDelete} className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}