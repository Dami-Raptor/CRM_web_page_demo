import React, { useState } from "react";
import api from "../api";
import type { Seller, Person } from "../types";
import Button from "./Button";

interface SellerCardProps {
    person: Person;
    seller: Seller;
    onSuccess: () => void;
}
export default function SellerCard({ person, seller, onSuccess }: SellerCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editBadge, setEditBadge] = useState(seller.badget);
    const [editPerformance, setEditPerformance] = useState(seller.performance);
    const [editCommission, setEditCommission] = useState(seller.commission * 100);
    const sellerDelete = async () => {
        if (window.confirm(`¿Estás seguro de eliminar al vendedor ${person.name}?`)) {
            try {
                await api.delete(`sellers/${seller.id}/`); 
                await api.delete(`persons/${person.id}/`);
                onSuccess();
            } catch (error) {
                console.error(error);
                alert("No se pudo eliminar el registro.");
            }
        }
    };
    const sellerUpdate = async () => {
        try {
            await api.patch(`sellers/${seller.id}/`, {
                badget: editBadge,
                performance: editPerformance,
                commission: editCommission / 100
            });
            setIsEditing(false);
            onSuccess();
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error al actualizar los datos del vendedor");
        }
    };

    return (
        <div className="group bg-gray-800/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-xl transition-all hover:border-blue-500/40">
            <div className="border-b border-white/5 pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-blue-400">
                            {person.name} {person.lastname}
                        </h3>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{person.email}</p>
                    </div>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                        Vendedor
                    </span>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">No. Empleado:</span>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editBadge} 
                            onChange={(e) => setEditBadge(e.target.value)}
                            className="w-24 bg-gray-900/60 border border-gray-700 rounded-lg px-2 py-1 text-right text-white text-xs outline-none focus:border-blue-500"/>
                    ):(
                        <span className="font-bold text-white tracking-tighter">{seller.badget}</span>
                    )}
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Performance:</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={editPerformance} 
                            onChange={(e) => setEditPerformance(Number(e.target.value))}
                            className="w-24 bg-gray-900/60 border border-gray-700 rounded-lg px-2 py-1 text-right text-green-400 outline-none focus:border-green-500"/>
                    ):(
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-mono font-bold text-green-400">${seller.performance.toLocaleString()}</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Comisión ({ (seller.commission * 100).toFixed(0) }%):</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            step="0.01"
                            value={editCommission} 
                            onChange={(e) => setEditCommission(Number(e.target.value))}
                            className="w-24 bg-gray-900/60 border border-gray-700 rounded-lg px-2 py-1 text-right text-white outline-none focus:border-blue-500"/>
                    ):(
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                            <span className="font-mono font-bold text-blue-400">
                                ${(seller.performance * seller.commission).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2 mt-6">
                {isEditing ? (
                    <div>
                        <Button variant="primary" onClick={sellerUpdate} className="flex-1 py-2 text-xs">
                            Guardar
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 py-2 text-xs border-white/10">
                            Cancelar
                        </Button>
                    </div>
                ):(
                    <div className="flex w-full gap-2">
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                            Editar
                        </button>
                        <button 
                            onClick={sellerDelete}
                            className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
                            Dar de baja
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}