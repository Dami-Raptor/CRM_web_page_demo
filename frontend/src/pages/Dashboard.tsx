import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Company } from '../types';
import CompanyCard from '../components/CompanyCard';
import AddCompany from '../components/AddCompany';
import Button from '../components/Button';

export default function Dashboard() {
    const [companies, setCompanies] = useState<Company[]>([]); // Almacena la lista de empresas obtenida inicialmente vacia
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        cargarTablero(); 
    }, []);

    const cargarTablero = async () => {
        try {
            // Realiza 3 solicitudes a la api para obtener empresas, leads y vendedores simultaneamente
            const [resCompany, resLead, resSeller] = await Promise.all([
                api.get('companies/'),
                api.get('leads/'),
                api.get('sellers/')
            ]);
            // Actualiza los estados con los datos obtenidos
            setCompanies(resCompany.data);
            setLeads(resLead.data);
            setSellers(resSeller.data);
        } catch (error) {
            console.error(error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };
    const handleLeads = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/leads');
    };
    const handleSellers = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/sellers');
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

                    <nav className="flex flex-wrap gap-3">
                        <div>
                            <Button onClick={handleSellers} variant="success" className="!w-auto">
                                Vendedores
                            </Button>
                        </div>
                        
                        <Button onClick={handleLeads} variant="success" className="!w-auto">
                                Leads
                            </Button>
                        <Button onClick={handleLogout} variant="danger" className="!w-auto">
                                Cerrar Sesion
                            </Button>
                    </nav>
                </header>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    <aside className="w-full lg:w-[450px] lg:sticky lg:top-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.6rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                            <AddCompany onSuccess={cargarTablero} />
                        </div>
                    </aside>
                    <main className="flex-1 w-full">
                        { companies.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                                <p className="text-gray-600 font-medium">No hay registros en la base de datos.</p>
                            </div>
                        ) : (
                        <>
                        <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold">Empresas</h2>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black">
                            {companies.length} TOTAL
                        </span>  
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {companies.map(company => (
                            <CompanyCard 
                            key={company.id} 
                            company={company} 
                            leads={leads} 
                            sellers={sellers} 
                            />
                        ))}
                        </div>
                    </>
                    )}
                    </main>
                </div>
        </div>
    );
}