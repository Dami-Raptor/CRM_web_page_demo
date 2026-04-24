import { useState } from 'react';
import apiDjango from '../api/apiDjango';
import type { Company} from '../../types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    companies: Company[];
};

export default function CrearSellerModal({ isOpen, onClose, onSuccess, companies }: Props) {
    const [newName, setNewName] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newBadge, setNewBadge] = useState('');
    const [newCompanyId, setNewCompanyId] = useState('');

    if (!isOpen) return null;
    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validación básica
        if (!newName.trim() || !newLastname.trim()) {
            alert("Nombre y apellido son obligatorios");
            return;
        }
        if (!newEmail.trim() || !newEmail.includes('@')) {
            alert("Ingrese un email válido");
            return;
        }
        if (!newBadge.trim()) {
            alert("El número de empleado es obligatorio");
            return;
        }
        if (!newCompanyId) {
            alert("Seleccione una empresa");
            return;
        }

        try {
            await apiDjango.post('/api/sellers/', {
                person: {
                    name: newName,
                    lastname: newLastname,
                    email: newEmail
                },
                badge: newBadge,
                company: parseInt(newCompanyId)
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Error al registrar: Verifique que el Email o Badge no estén duplicados");
        }
    };

    const handleClose = () => {¿
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-black text-purple-400 mb-6 uppercase tracking-tighter italic">
                    Registrar Nuevo Agente de Ventas
                </h2>
                <form onSubmit={manejarEnvio} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                                Nombre
                            </label>
                            <input 
                                required 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" 
                                placeholder="Ej: Juan"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                                Apellido
                            </label>
                            <input 
                                required 
                                type="text"
                                value={newLastname}
                                onChange={(e) => setNewLastname(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" 
                                placeholder="Ej: Pérez"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">
                            Email Corporativo
                        </label>
                        <input 
                            required 
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" 
                            placeholder="Ej: juan@empresa.com"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                                No. Empleado (Badge)
                            </label>
                            <input 
                                required 
                                type="text"
                                value={newBadge}
                                onChange={(e) => setNewBadge(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" 
                                placeholder="Ej: EMP001"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                                Asignar Empresa
                            </label>
                            <select 
                                required
                                value={newCompanyId}
                                onChange={(e) => setNewCompanyId(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-gray-300"
                            >
                                <option value="">Seleccionar...</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-700">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            className="text-gray-500 hover:text-white text-xs font-bold uppercase"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-lg shadow-purple-900/20"
                        >
                            Dar de Alta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}