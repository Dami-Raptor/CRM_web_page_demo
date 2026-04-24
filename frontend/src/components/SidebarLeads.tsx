import { Droppable } from '@hello-pangea/dnd';
import type { Lead } from '../../types';
import LeadCard from './LeadCard';

interface SidebarLeadsProps {
  leads: Lead[]; // Ttodos los leads
  onAddLead: () => void; // Abre el modal de crear leads
  onSuccess: () => void; // Recarga despues de una accion
  onEditLead: (lead: Lead) => void; // Abre el modal de editar lead
  onDeleteLead: (leadId: number) => void; //Elimina un lead
}

export default function SidebarLeads({ leads, onAddLead, onEditLead, onDeleteLead, onSuccess}: SidebarLeadsProps) {
  return (
    <aside className="w-80 border-r border-white/10 p-4 flex flex-col bg-[#0f1623]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs font-bold text-blue-400 tracking-widest">LEADS</h2>
        <button
          onClick={onAddLead}
          className="bg-blue-500/10 border border-blue-500/50 hover:bg-blue-500 text-white text-xs px-3 py-1 text-blue-500 rounded-lg font-semibold rounded-full transition-all duration-200"
        >
          + Lead
        </button>
      </div>
      <Droppable droppableId="lead-sidebar" isDropDisabled={false}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 overflow-y-auto pr-1 min-h-[200px] rounded-lg transition-colors
              ${snapshot.isDraggingOver 
                ? 'bg-blue-500/10 border-2 border-dashed border-blue-400' 
                : 'border-2 border-dashed border-transparent'
              }`}
          >
            {leads.filter(l => !l.seller).map((lead, index) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                index={index}
                onEdit={onEditLead}
                onDelete={onDeleteLead}
                onSuccess={onSuccess}
              />
            ))}
            {provided.placeholder}
            
            {leads.filter(l => !l.seller).length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                {snapshot.isDraggingOver 
                  ? 'Suelta aquí para quitar vendedor' 
                  : 'No hay leads sin asignar'
                }
              </div>
            )}
          </div>
        )}
      </Droppable>
    </aside>
  );
}