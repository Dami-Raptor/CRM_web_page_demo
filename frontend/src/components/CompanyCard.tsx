import { useNavigate } from "react-router-dom";
import type { Company, Lead, Seller } from "../types";

interface CompanyCardProps {
    company: Company;
    leads: Lead[];
    sellers: Seller[];
}
export default function CompanyCard({ company, leads, sellers }: CompanyCardProps) {
    const navigate = useNavigate();
    const potencialVentas = sellers
        .filter(s => s.company === company.id) // Filtra solo los vendedores de la empresa actual
        .reduce((acc, s) => acc + (s.performance || 0), 0); // Suma el rendimiento de los vendedores de esta empresa
    const leadsEmpresa = leads.filter(l => l.company === company.id); // Filtra los leads de esta empresa
    const stats = { // Calcula el numero de leads por prioridad para la empresa
        alta: leadsEmpresa.filter(l => l.priority === 'Alta').length,
        media: leadsEmpresa.filter(l => l.priority === 'Media').length,
        baja: leadsEmpresa.filter(l => l.priority === 'Baja').length,
    };
    const handleCompany = (companyId: number) => {
        navigate(`/company/${companyId}`); // Navega a la pagina de detalles mandndo el id de la empresa en el URL
    };
    return (
        <div 
            onClick={() => handleCompany(company.id)}
            className="group bg-gray-800/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                        {company.nameCompany}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Corporativo</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400 font-bold">
                    ID {company.id}
                </div>
            </div>
            <div className="bg-gray-900/40 rounded-3xl p-4 mb-6 border border-white/5">
                <p className="text-gray-400 text-xs mb-1 font-medium">Potencial de Ventas</p>
                <p className="text-3xl font-black text-green-400">
                    ${potencialVentas.toLocaleString()}
                </p>
            </div>
            <div className="space-y-3">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Estado de Leads por Prioridad</p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-center">
                        <span className="block text-xl font-bold text-emerald-500">{stats.alta}</span>
                        <span className="text-[10px] text-emerald-300 font-bold uppercase">Alta</span>
                    </div>
                    <div className="flex-1 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-2xl text-center">
                        <span className="block text-xl font-bold text-yellow-500">{stats.media}</span>
                        <span className="text-[10px] text-yellow-300 font-bold uppercase">Media</span>
                    </div>
                    <div className="flex-1 bg-red-500/10 border border-red-500/30 p-3 rounded-2xl text-center">
                        <span className="block text-xl font-bold text-red-500">{stats.baja}</span>
                        <span className="text-[10px] text-red-300 font-bold uppercase">Baja</span>
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-gray-500">
                <span className="text-xs font-medium">{leadsEmpresa.length} Leads totales</span>
                <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all">
                    Ver Detalles →
                </span>
            </div>
        </div>
    );
}