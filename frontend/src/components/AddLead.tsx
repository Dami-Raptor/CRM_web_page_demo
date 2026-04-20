import React, { useState, useEffect } from "react";
import api from "../api";
import type { Company, Seller } from "../types";

interface AddLeadProps {
    onSuccess: () => void;
}
export default function AddLead({ onSuccess }: AddLeadProps) {
    const [newName, setNewName] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newButget, setNewButget] = useState<number>(0);
    const [newStatus, setNewStatus] = useState<'Prospecto' | 'Cliente'>('Prospecto');
    const [newCompany, setNewCompany] = useState('');
    const [newSeller, setNewSeller] = useState('');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]);
    useEffect(() => {
        const fetchLists = async () => { // Carga las listas de las empresas y vendedores
            try {
                const [resC, resS] = await Promise.all([ // Realiza las solicitudes a la api para obtener los datos
                    api.get('companies/'),
                    api.get('sellers/')
                ]);
                setCompanies(resC.data);
                setSellers(resS.data);
            } catch (err) {
                console.error("Error cargando listas:", err);
            }
        };
        fetchLists();
    }, []);
    const calcularPrioridad = (b: number) => {
        if (b >= 10000) return 'Alta';
        if (b >= 5000) return 'Media';
        return 'Baja';
    };
    const crearLead = async (e: React.FormEvent) => {
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
                butget: Number(newButget),
                status: newStatus,
                priority: calcularPrioridad(Number(newButget)),
                company: newCompany,
                seller: newSeller || null
            });
            setNewName('');
            setNewLastname('');
            setNewEmail('');
            setNewButget(0);
            setNewCompany('');
            setNewSeller('');
            onSuccess();
            alert("Lead registrado con exito!");
        } catch (error) {
            console.error(error);
            alert("Error al registarar lead");
        }
    };

    return (
        <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <form onSubmit={crearLead} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-green-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <h3 className="text-xl font-bold text-white">Nuevo Lead</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase">Nombre</label>
                        <input 
                        type="text" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)} 
                        required 
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-green-500/50 transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase">Apellido</label>
                        <input 
                        type="text" 
                        value={newLastname}
                        onChange={(e) => setNewLastname(e.target.value)}
                        required
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-green-500/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase">Email</label>
                    <input 
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    required 
                        className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-green-500/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase">Presupuesto ($)</label>
                        <input 
                        type="number" 
                        value={newButget} 
                        onChange={(e) => setNewButget(Number(e.target.value))} 
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-green-500/50 transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase">Estado</label>
                        <select 
                        value={newStatus} 
                        onChange={(e) => setNewStatus(e.target.value as any)} 
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-green-500/50 transition-all">
                            <option value="Prospecto">Prospecto</option>
                            <option value="Cliente">Cliente</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-1 pt-2">
                    <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase">Asignar Empresa</label>
                    <select 
                    value={newCompany} 
                    onChange={(e) => setNewCompany(e.target.value)} 
                    required
                        className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500/50 transition-all">
                        <option value="">Selecciona una empresa...</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.nameCompany}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase">Asignar Vendedor (Opcional)</label>
                    <select 
                    value={newSeller} 
                    onChange={(e) => setNewSeller(e.target.value)}
                        className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-purple-500/50 transition-all">
                        <option value="">Sin vendedor asignado</option>
                        {sellers.map(s => <option key={s.id} value={s.id}>{s.name} {s.lastname}
                            - Performance: {s.performance}</option>)}
                    </select>
                </div>
                <button type="submit" 
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-4 rounded-full shadow-lg shadow-green-900/20 active:scale-95 transition-all cursor-pointer">
                    Registrar Lead Completo
                </button>
            </form>
        </div>
    );
}