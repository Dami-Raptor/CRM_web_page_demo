import React, { useState } from "react";
import api from "../api";
import Button from "./Button";

interface AddCompanyProps {
    onSuccess: () => void;
}
export default function AddCompany({ onSuccess }: AddCompanyProps) {
    const [nameCompany, setNameCompany] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("companies/", {
                nameCompany: nameCompany
            });
            setNameCompany('');
            onSuccess();
            alert("Empresa registrada con éxito!");
        } catch (error) {
            console.error(error);
            alert("Error al registrar empresa, prueba con otro nombre");
        }
    };

    return (
        <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl w-full">
            <form className="space-y-6">
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
                        placeholder="Nombre"
                        className="w-full px-6 py-4 bg-gray-900/60 border border-gray-700 rounded-full text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-600"
                        value={nameCompany} 
                        onChange={(e) => setNameCompany(e.target.value)} 
                        required 
                    />
                </div>
                <div className="pt-2">
                    <Button 
                        onClick={handleSubmit}
                        type="submit" 
                        variant="primary" 
                        className={`py-4 text-lg shadow-lg shadow-blue-900/20 opacity-50`}
                    >
                        Registar Empresa
                    </Button>
                </div>
            </form>
        </div>
    );
}