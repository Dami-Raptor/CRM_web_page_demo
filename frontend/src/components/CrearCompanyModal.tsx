import { useState } from "react";
import apiDjango from "../api/apiDjango"; 
import type { Company } from "../../types";

type AddCompanyProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (nuevoCompany: Company) => void;
}

export default function CrearCompanyModal({ isOpen, onClose, onSuccess }: AddCompanyProps) {
    const [newNameCompany, setNameCompany] = useState('');
    
    if (!isOpen) return null;

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNameCompany.trim()) return;

        try {
            const resCompany = await apiDjango.post('/api/companies/', {
                name: newNameCompany, 
            });

            onSuccess(resCompany.data);
            setNameCompany('');
            onClose();
        } catch (error) {
            console.error("Error al registrar empresa:", error);
            alert("Error al registrar la empresa. Verifica que el nombre no esté duplicado.");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-md relative">
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-8 text-gray-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <form onSubmit={manejarEnvio} className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <h3 className="text-xl font-bold text-white">Nueva Empresa</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 ml-4 font-medium uppercase tracking-wider">
                            Nombre del Corporativo
                        </label>
                        <input 
                            type="text" 
                            placeholder="Ej. Acme Corp"
                            className="w-full px-6 py-4 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-600"
                            value={newNameCompany} 
                            onChange={(e) => setNameCompany(e.target.value)} 
                            required 
                            autoFocus
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-blue-900/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Registrar Empresa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}