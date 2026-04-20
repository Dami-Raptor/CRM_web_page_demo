import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Lead, Person, Seller } from '../types'; 
import AddLead from "../components/AddLead";
import LeadCard from '../components/LeadCard';

export default function Lead() {
    // Almacena los datos en Arays, inicialmente vacios
    const [leads, setLeads] = useState<Lead[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]); 
    const navigate = useNavigate();
    useEffect(() => {
        cargarTablero();
    }, []);
    const cargarTablero = async () => {
        try {
            const [resLeads, resPersons, resSellers] = await Promise.all([
                api.get<Lead[]>('leads/'),
                api.get<Person[]>('persons/'),
                api.get<Seller[]>('sellers/') 
            ]);
            
            setLeads(resLeads.data);
            setPersons(resPersons.data);
            setSellers(resSellers.data); 
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };
    const handleCompany = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/dashboard');
    };
    const handleSellers = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/sellers');
    };
    // Funcion para obtener los datos de la persona por medio del id
    const getPersonData = (personId: number) => {
        const person = persons.find(p => p.id === personId);
        // person retorna el objeto encontrado o un objeto con los datos de carga
        return person || { id: 0, name: 'Cargando...', lastname: '', email: '' } as Person;
    };
    return (
        <div className="min-h-screen w-full bg-[#020205] bg-[radial-gradient(circle_at_center,_#1a1b3a_0%,_#020205_100%)] text-white font-sans p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-12 pb-6 border-b border-white/10 gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        CRM Engine
                    </h1>
                    <p className="text-gray-500 text-sm font-medium tracking-widest uppercase mt-1">Gestión de Leads & Ventas</p>
                </div>
                <nav className="flex items-center gap-4">
                    <button onClick={handleSellers} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 transition-all cursor-pointer">
                        Vendedores
                    </button>
                    <button onClick={handleCompany} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 transition-all cursor-pointer">
                        Empresas
                    </button>
                    <button onClick={handleLogout} className="px-6 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/20 transition-all cursor-pointer">
                        Cerrar sesión
                    </button>
                </nav>
            </header>
            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <aside className="w-full lg:w-[450px] lg:sticky lg:top-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.6rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <AddLead onSuccess={cargarTablero} />
                    </div>
                </aside>
                <main className="flex-1 w-full">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold">Leads</h2>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black">
                            {leads.length} TOTAL
                        </span>
                    </div>
                    {leads.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                            <p className="text-gray-600 font-medium">No hay registros en la base de datos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {leads.map((lead) => (
                                <LeadCard
                                    key={lead.id}
                                    lead={lead}
                                    person={getPersonData(lead.person)} 
                                    seller={sellers} 
                                    onSuccess={cargarTablero}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}