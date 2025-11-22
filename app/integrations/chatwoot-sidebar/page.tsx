
import React from 'react';
import { Badge, Button, Card } from '../../../components/UI';
import { ExternalLink, CreditCard, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { clientsData, mockTerminals } from '../../../mockData';

export default function ChatwootEmbedPage() {
  // Mock: Usamos el cliente ID 1 para demostración
  const client = clientsData[0];
  
  if (!client) return <div className="p-4 text-sm text-slate-500">Cliente no encontrado</div>;

  // Filter terminals for this client
  const terminals = mockTerminals.filter(t => t.clientId === client.id);

  return (
    <div className="min-h-screen bg-white p-3 max-w-[320px] mx-auto border-r border-slate-100">
      {/* Client Header */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">
            {client.initials}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-tight">{client.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{client.rif}</p>
          </div>
        </div>
        {/* Corrected status check using terminalsCount as proxy since 'status' doesn't exist */}
        <div className={`w-2.5 h-2.5 rounded-full ${client.terminalsCount > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      </div>

      {/* Key Metrics (Mini) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
         <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Banco</span>
            {/* Corrected property name: bank -> banco */}
            <span className="text-xs font-bold text-slate-700 truncate block">{client.banco}</span>
         </div>
         <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Terminales</span>
            {/* Corrected property name: terminals -> terminalsCount */}
            <span className="text-xs font-bold text-slate-700">{client.terminalsCount} POS</span>
         </div>
      </div>

      {/* POS List */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
           <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Terminales POS</h4>
           <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Total: {terminals.length}</span>
        </div>
        
        <div className="space-y-2">
          {terminals.map(term => (
            <div key={term.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white shadow-sm hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">{term.serial}</span>
                  {/* Corrected property name: model -> modelo */}
                  <span className="text-[10px] text-slate-500">{term.modelo}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                 {/* Adapted logic for status icons using existing properties */}
                 {term.estadoPos === 'INSTALADO' && !term.rango.includes('SIN TX') && <Wifi size={12} className="text-emerald-500" />}
                 {term.estadoPos !== 'INSTALADO' && <WifiOff size={12} className="text-slate-400" />}
                 {/* Show warning if there is an issue (SIN TX) */}
                 {term.rango.includes('SIN TX') && <AlertTriangle size={12} className="text-amber-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100">
         <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-xs font-bold transition-colors"
         >
            <ExternalLink size={14} />
            Ver en FinanPOS
         </a>
      </div>
    </div>
  );
}
