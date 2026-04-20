import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import type { Lead, Person, Seller, Company } from '../types';
import LeadCard from '../components/LeadCard';

export default function CompanyStacks() {
    const { id } = useParams(); // Obtener el id de la empresa desde la URL
    const navigate = useNavigate();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const cargarDatosEmpresa = async () => {
        try {
            const [resLeads, resSellers, resPersons, resCompany] = await Promise.all([ // Reliza 4 solicitudes a la api deacuerdo al id de la empresa
                api.get<Lead[]>(`leads/?company=${id}`),
                api.get<Seller[]>(`sellers/?company=${id}`),
                api.get<Person[]>('persons/'),
                api.get<Company>(`companies/${id}/`)
            ]);
            setLeads(resLeads.data);
            setSellers(resSellers.data);
            setPersons(resPersons.data);
            setCompany(resCompany.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        cargarDatosEmpresa();
    }, [id]);
    const getPersonData = (personId: number) => {
        return persons.find(p => p.id === personId) || 
               { id: 0, name: 'Cargando...', lastname: '', email: '' } as Person;
    };
    return (
        <div className="min-h-screen w-full bg-[#020205] bg-[radial-gradient(circle_at_center,_#1a1b3a_0%,_#020205_100%)] text-white font-sans p-8">
            <header className="mb-10 border-b border-white/10 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white">{company?.nameCompany}</h1>
                </div>
                <div className="flex gap-8">
                    <div>
                        <button onClick={() => navigate(-1)}className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-blue-900/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                        Volver al Dashboard
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-[10px] font-bold">VENDEDORES</p>
                        <p className="text-2xl font-mono">{sellers.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-[10px] font-bold">LEADS ACTIVOS</p>
                        <p className="text-2xl font-mono text-blue-400">{leads.length}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <section className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Equipo de Ventas
                    </h2>
                    {sellers.map(s => (
                        <div key={s.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                {s.badget}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{s.name} {s.lastname}</p>
                                <p className="text-xs text-gray-500">{s.email}</p>
                            </div>
                        </div>
                    ))}
                </section>
                <section className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Leads Asignados
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {leads.map(lead => (
                            <LeadCard 
                                key={lead.id}
                                lead={lead}
                                person={getPersonData(lead.person)}
                                seller={sellers}
                                onSuccess={cargarDatosEmpresa}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}