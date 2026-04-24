import type { Company, Lead, Seller } from '../../types';
import SellerCard from './SellerCard';

interface CompanyColumnProps {
  company: Company;
  sellers: Seller[];
  leads: Lead[];
  onSuccess: () => void;
}

export default function CompanyColumn({ company, sellers, leads, onSuccess}: CompanyColumnProps) {
  // Filtra los seller pertenecientes a la company
  const sellersEmpresa = sellers.filter(s => s.company === company.id);
  // Filtra los leads pertenecientes a la company
  const leadsEmpresa = leads.filter(l => l.company === company.id);
  // Calcula el potencial de ventas deacuerdo a su performance de los seller
  const totalVentas = sellersEmpresa.reduce(
    (acc, s) => acc + (s.performance || 0), 0
  );

  return (
    <div className="
      min-w-[520px]
      bg-gradient-to-br from-[#0f172a] to-[#020617]
      border border-white/10
      rounded-3xl
      overflow-hidden
      hover:border-white/20
      transition-all
    ">
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {company.name}
            </h2>
              <span className="text-xs text-gray-500">
                Potencial de Ventas
              </span>
            <div className="mt-3">
              <p className="text-2xl font-bold text-green-400">
                ${totalVentas.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="
              w-12 h-12 rounded-xl
              bg-gradient-to-br from-blue-500/20 to-purple-500/20
              border border-blue-500/30
              flex items-center justify-center
              text-blue-400 text-lg
            ">
              🏢
            </div>
            <span className="text-[10px] text-gray-500 font-mono">
              ID: {String(company.id).padStart(3, '0')}
            </span>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
            <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-400">Clientes</p>
            <p className="text-white font-bold">{leadsEmpresa.length}</p>
          </div>
          <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-400">Vendedores</p>
            <p className="text-blue-400 font-bold">{sellersEmpresa.length}</p>
          </div>
          <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-400">Ventas</p>
            <p className="text-green-400 font-bold">
              ${totalVentas.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
        {sellersEmpresa.length > 0 ? (
          sellersEmpresa.map(seller => (
            <SellerCard
              key={seller.id}
              seller={seller}
              leads={leads}
              onSuccess={onSuccess}
            />
          ))
        ) : (
          <div className="
            h-40 flex items-center justify-center
            border border-dashed border-white/10
            rounded-2xl text-gray-500 text-sm
          ">
            Sin vendedores
          </div>
        )}
      </div>
    </div>
  );
}
