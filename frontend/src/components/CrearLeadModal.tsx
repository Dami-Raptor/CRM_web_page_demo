import { useState } from 'react';
import apiDjango from '../api/apiDjango';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function CrearLeadModal({ isOpen, onClose, onSuccess }: Props) {
    const [newName, setNewName] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newButget, setNewButget] = useState<number>(0);
    const [newStatus, setNewStatus] = useState<'Prospecto' | 'Cliente'>('Prospecto');
    const [newCompany, setNewCompany] = useState('');
    const [newSeller, setNewSeller] = useState('');

    if (!isOpen) return null;
    // Calculo de prioridad
    const calcularPrioridad = (butget: number) => {
        if (butget >= 10000) return 'Alta';
        if (butget >= 5000) return 'Media';
        return 'Baja';
    };
    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validación 
        if (!newName.trim() || !newLastname.trim() || !newEmail.trim()) {
            alert("Todos los campos de persona son obligatorios");
            return;
        }
        // Validacion de presupuesto
        if (newButget <= 0) {
            alert("El presupuesto debe ser mayor a 0");
            return;
        }
        // Calculo de la prioridad
        const prioridadCalculada = calcularPrioridad(newButget);
        
        try {
            await apiDjango.post('/api/leads/', {
                person: {
                    name: newName,
                    lastname: newLastname,
                    email: newEmail
                },
                butget: newButget,
                status: newStatus,
                priority: prioridadCalculada,
                company: newCompany ? parseInt(newCompany) : null,
                seller: newSeller ? parseInt(newSeller) : null
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al crear lead:", error);
            alert("Error: Verifique que el email sea único y todos los campos obligatorios estén llenos.");
        }
    };

    const handleClose = () => {
        onClose();
    };

return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0f172a] rounded-2xl p-6 w-full max-w-md border border-white/10">
                <h3 className="text-white font-bold mb-4">Crear Nuevo Lead</h3>
                
                <form onSubmit={manejarEnvio} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nombre *</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                            placeholder="Ej: Juan"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Apellido *</label>
                        <input
                            type="text"
                            value={newLastname}
                            onChange={(e) => setNewLastname(e.target.value)}
                            className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                            placeholder="Ej: Pérez"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email *</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                            placeholder="Ej: juan@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Presupuesto ($) *</label>
                        <input
                            type="number"
                            min="0"
                            step="100"
                            value={newButget}
                            onChange={(e) => setNewButget(Number(e.target.value))}
                            className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                            placeholder="Ej: 5000"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Estado</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as 'Prospecto' | 'Cliente')}
                            className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                        >
                            <option value="Prospecto">Prospecto</option>
                            <option value="Cliente">Cliente</option>
                        </select>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Prioridad (calculada automáticamente)</p>
                        <p className="text-blue-400 font-bold text-lg">
                            {calcularPrioridad(newButget)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {newButget >= 10000 
                                ? 'Presupuesto ≥ $10,000' 
                                : newButget >= 5000 
                                    ? 'Presupuesto entre $5,000 y $9,999'
                                    : 'Presupuesto < $5,000'
                            }
                        </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm border border-white/10 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            Crear Lead
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}