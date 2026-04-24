import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import apiDjango from '../api/apiDjango';
import type { Company, Lead, Seller } from '../../types';
import CrearLeadModal from './CrearLeadModal';
import CrearCompanyModal from './CrearCompanyModal';
import CrearSellerModal from './CrearSellerModal';
import ButtonLogut from './ButtonLogut';
import ButtonAddCompany from './ButtonAddCompany';
import ButtonAddSeller from './ButtonAddSeller';
import SidebarLeads from './SidebarLeads';
import CompanyColumn from './CompanyColumn';

export default function KambanBoard() {
  // Los datos de cada tabla
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  // Control de modales
  const [modalLead, setModalLead] = useState(false);
  const [modalCompany, setModalCompany] = useState(false);
  const [modalSeller, setModalSeller] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      // Realiza ejecucion en paraleo
      const [resC, resL, resS] = await Promise.all([
        apiDjango.get('/api/companies/'),
        apiDjango.get('/api/leads/'),
        apiDjango.get('/api/sellers/')
      ]);
      // Menjo de datos con o sin paginacion, vacios y respuesta inesperada
      const leadsReales: Lead[] = Array.isArray(resL.data) 
        ? resL.data 
        : (resL.data.results || []);
      setLeads(leadsReales);
      const sellersReales: Seller[] = Array.isArray(resS.data) 
        ? resS.data 
        : (resS.data.results || []);
      setSellers(sellersReales);
      const companiesReales: Company[] = Array.isArray(resC.data) 
        ? resC.data 
        : (resC.data.results || []);
      setCompanies(companiesReales);

    } catch (e) {
      console.error("Error en CORE:", e);
    }
  }, []);
  // Carga empresas, vendedores y prospectos al mismo tiempo
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]); // Cuando las dependencias cambian se reejecuta
  
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    // Destructuracion de los ids
    const leadId = parseInt(draggableId);
    const [destType, destId, destStatus] = destination.droppableId.split('-');
    const [sourceType, sourceId, sourceStatus] = source.droppableId.split('-');
    // Mover lead al sidebar
    if (destType === 'lead' && sourceType === 'seller') {
      try {
        await apiDjango.patch(`/api/leads/${leadId}/`, {
          seller: null,
          company: null,
          status: sourceStatus
        });
        cargarDatos();
      } catch (e) {
        console.error("Error al quitar vendedor:", e);
      }
      return;
    }
    // Si el lead no se coloca en sidebar o seller no hace nada
    if (destType !== 'seller' || destType !== 'lead') return;
    // Si el lead venía de la sidebar
    if (sourceType === 'lead') {
      const payload: any = {
        seller: parseInt(destId),
        status: destStatus
      };
      // Busca en sellers
      const vendedorDestino = sellers.find(s => s.id === parseInt(destId));
      if (vendedorDestino) {
        payload.company = vendedorDestino.company;
      }
      try {
        await apiDjango.patch(`/api/leads/${leadId}/`, payload);
        cargarDatos();
      } catch (e) {
        console.error("Error en LeadModal:", e);
      }
      return;
    }
    // Reasignacion de seller
    if (sourceType === 'seller' && sourceId !== destId) {
      const payload: any = {
        seller: parseInt(destId),
        status: destStatus
      };
      const vendedorDestino = sellers.find(s => s.id === parseInt(destId));
      if (vendedorDestino) {
        payload.company = vendedorDestino.company;
      }
      try {
        await apiDjango.patch(`/api/leads/${leadId}/`, payload);
        cargarDatos();
      } catch (e) {
        console.error("Error en SellerModal:", e);
      }
      return;
    }
    // Mismo seller diferente estado
    if (sourceType === 'vendedor' && sourceId === destId && sourceStatus !== destStatus) {
      try {
        await apiDjango.patch(`/api/leads/${leadId}/`, {status: destStatus});
        cargarDatos();
      } catch (e) {
        console.error("Error en CompanyModal:", e);
      }
      return;
    }
  };
    return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-300">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#1a1b3a_0%,_#020205_100%)]" />
        <DragDropContext onDragEnd={onDragEnd}>
        <SidebarLeads 
            leads={leads} 
            onAddLead={() => setModalLead(true)}
            onSuccess={cargarDatos} 
        />
        <div className="flex-1 flex flex-col">
            <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                CRM Companies
              </h1>
            <div className="flex items-center gap-3">
                <ButtonAddCompany onClick={() => setModalCompany(true)} />
                <ButtonAddSeller onClick={() => setModalSeller(true)} />
                <div className="w-px h-6 bg-white/10" />
                <ButtonLogut />
            </div>
            </div>
            <main className="flex-1 p-6 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 h-full min-w-max">
                {companies.map(company => (
                <CompanyColumn
                    key={company.id}
                    company={company}
                    sellers={sellers}
                    leads={leads}
                    onSuccess={cargarDatos} 
                />
                ))}
            </div>
            </main>
        </div>
        </DragDropContext>
        <CrearLeadModal
        isOpen={modalLead}
        onClose={() => setModalLead(false)}
        onSuccess={cargarDatos}
        companies={companies}
        sellers={sellers}
        />
        <CrearCompanyModal
        isOpen={modalCompany}
        onClose={() => setModalCompany(false)}
        onSuccess={cargarDatos}
        />
        <CrearSellerModal
        isOpen={modalSeller}
        onClose={() => setModalSeller(false)}
        onSuccess={cargarDatos}
        companies={companies}
        />
    </div>
    );
}
