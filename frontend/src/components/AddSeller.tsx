import React, { useState, useEffect } from "react";
import api from "../api";
import type { Company } from "../types";

interface AddSellerProps {
    onSuccess: () => void;
}
export default function AddSeller({ onSuccess }: AddSellerProps) {
    const [newName, setNewName] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newBadget, setNewBadget] = useState('');
    const [newPerformance, setNewPerformance] = useState<number>(0);
    const [newCommission] = useState<number>(0.05);
    const [newCompany, setNewCompany] = useState('');
    const [companies, setCompanies] = useState<Company[]>([]);
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('companies/');
                setCompanies(res.data);
            } catch (err) {
                console.error("Error al cargar empresas:", err);
            }
        };
        fetchCompanies();
    }, []);

    const [porcentajeCommission, setPorcentajeCommission] = useState<number>(5);
    const crearVendedor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resPerson = await api.post('persons/', {
                name: newName,
                lastname: newLastname, 
                email: newEmail,
            });
            const personId = resPerson.data.id;
            await api.post('sellers/', {
                person: personId, 
                badget: newBadget,
                performance: newPerformance,
                commission: newCommission / 100,
                company: newCompany
            });
            setNewName('');
            setNewLastname('');
            setNewEmail('');
            setNewBadget('');
            setNewPerformance(0);
            setNewCompany('');
            onSuccess();
            alert("Vendedor registrado con exito!");
        } catch (error) {
            console.error(error);
            alert("Error al registar vendedor");
        }
    };

    return (
        <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <form onSubmit={crearVendedor} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <h3 className="text-xl font-bold text-white">Nuevo Vendedor</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase tracking-tighter">Nombre</label>
                        <input 
                        type="text"
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        required 
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase tracking-tighter">Apellido</label>
                        <input 
                        type="text" 
                        value={newLastname} 
                        onChange={(e) => setNewLastname(e.target.value)} 
                        required
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase tracking-tighter">Email</label>
                    <input 
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    required 
                        className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase tracking-tighter">No. Empleado</label>
                        <input 
                        type="text" 
                        value={newBadget} 
                        onChange={(e) => setNewBadget(e.target.value)} 
                        required
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-purple-500/50 transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase tracking-tighter">Comisión %</label>
                        <input 
                        type="number" 
                        step="0.01" 
                        value={porcentajeCommission} 
                        onChange={(e) => setPorcentajeCommission(Number(e.target.value))} 
                            className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-purple-500/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-1 pt-2">
                    <label className="text-[10px] text-gray-400 ml-4 font-bold uppercase tracking-tighter">Empresa Asignada</label>
                    <select 
                    value={newCompany} 
                    onChange={(e) => setNewCompany(e.target.value)} 
                    required
                        className="w-full px-5 py-3 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-green-500/50 transition-all appearance-none">
                        <option value="">Selecciona Empresa</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.nameCompany}</option>)}
                    </select>
                </div>
                <button type="submit" 
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-full shadow-lg shadow-blue-900/20 active:scale-95 transition-all cursor-pointer uppercase tracking-widest text-sm">
                    Dar de alta Vendedor
                </button>
            </form>
        </div>
    );
}