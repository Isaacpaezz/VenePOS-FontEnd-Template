
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, Button, Badge, Input, Sheet, SheetContent, SheetHeader, SheetTitle, 
  Tabs, TabsList, TabsTrigger, TabsContent, Popover, PopoverTrigger, PopoverContent, 
  Checkbox, Label, Skeleton 
} from '../../../components/UI';
import { 
  Search, Filter, MoreHorizontal, Plus, Download, Phone, Mail, MapPin, 
  CreditCard, Wifi, WifiOff, AlertTriangle, ChevronDown, User, Building, Check,
  Pencil, Save, X 
} from 'lucide-react';
import { clientsData, mockTerminals, dashboardActivities } from '../../../mockData';
import { Client, Terminal, Route } from '../../../types';
import { cn } from '../../../lib/utils';

interface ClientsPageProps {
  onNavigate: (route: Route) => void;
}

export default function ClientsPage({ onNavigate }: ClientsPageProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Client>>({});

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]); // Ahora filtra por GESTION

  // Local state for filter searches
  const [bankSearch, setBankSearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');

  // Simulate fetch
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Reset edit state when client changes
  useEffect(() => {
    if (selectedClient) {
      setEditForm(selectedClient);
      setIsEditing(false);
    }
  }, [selectedClient]);

  // Extract unique values for filters
  const banks = Array.from(new Set(clientsData.map(c => c.banco))).sort();
  const regions = Array.from(new Set(clientsData.map(c => c.region))).sort();
  const statuses = Array.from(new Set(clientsData.map(c => c.gestion))).sort(); 
  const gestionOptions = ['POR GESTIONAR', 'ILOCALIZABLE', 'EQUIPO EN TALLER', 'CONTACTAR DE NUEVO', 'COMPROMISO DE PAGO', 'RECUPERADO'];

  // Filter Logic
  const filteredClients = useMemo(() => {
    return clientsData.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.initials.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.rif.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.codigoAfiliado.includes(searchQuery);
      
      const matchesBank = selectedBanks.length === 0 || selectedBanks.includes(client.banco);
      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(client.region);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(client.gestion);

      return matchesSearch && matchesBank && matchesRegion && matchesStatus;
    });
  }, [searchQuery, selectedBanks, selectedRegions, selectedStatuses]);

  const toggleFilter = (list: string[], setList: (l: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    if (selectedClient && editForm) {
      // In a real app, this would be an API call
      // updateClient(selectedClient.id, editForm);
      setSelectedClient({ ...selectedClient, ...editForm } as Client);
      setIsEditing(false);
      alert("Cambios guardados correctamente (Simulado)");
    }
  };

  // Export Logic
  const handleExport = () => {
    // Define CSV headers matching the Excel structure exactly
    const headers = [
      "AFIPOS", "NUMPOS", "CODIGO_AFILIADO", "NOMBRE_AFILIADO", "RIF_AFILIADO", 
      "TELEFONO_AFILIADO", "PERSONA_CONTACTO", "DIRECCION_AFILIADO", "NOMBRE_BANCO", 
      "REGION", "ESTADO", "CIUDAD", "SECTOR", "CATEGORIA_COMERCIO", 
      "RANGO", "GESTION"
    ];

    const rows = filteredClients.map(c => [
      c.afipos,
      c.terminalsCount,
      c.codigoAfiliado,
      `"${c.name}"`, // Quote strings with spaces
      c.rif,
      c.telefono,
      `"${c.personaContacto}"`,
      `"${c.direccion}"`,
      c.banco,
      c.region,
      c.estado,
      c.ciudad,
      c.sector,
      c.categoriaComercio,
      c.rango,
      c.gestion
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "credicardpos_export_master.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper para colorear el badge de Gestión
  const getStatusVariant = (gestion: string) => {
    switch (gestion) {
      case 'POR GESTIONAR': return 'warning';
      case 'ILOCALIZABLE': return 'danger';
      case 'EQUIPO EN TALLER': return 'neutral';
      case 'CONTACTAR DE NUEVO': return 'primary';
      case 'COMPROMISO DE PAGO': return 'success';
      case 'RECUPERADO': return 'success';
      default: return 'neutral';
    }
  };

  // Helper components for Filter UI
  const FilterItem = ({ label, isSelected, onClick, badgeVariant }: { label: string, isSelected: boolean, onClick: () => void, badgeVariant?: any }) => (
     <div 
        onClick={onClick}
        className={cn(
           "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors",
           isSelected ? "bg-indigo-50 text-indigo-900" : "text-slate-700 hover:bg-slate-50"
        )}
     >
        <div className="flex items-center gap-2 overflow-hidden">
           <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white")}>
              {isSelected && <Check size={10} className="text-white" strokeWidth={4} />}
           </div>
           
           {badgeVariant ? (
              <Badge variant={badgeVariant} className="truncate max-w-[160px]">{label}</Badge>
           ) : (
              <span className={cn("truncate max-w-[160px]", isSelected && "font-medium")}>{label}</span>
           )}
        </div>
     </div>
  );

  // Obtener terminales de un cliente seleccionado
  const clientTerminals = selectedClient 
    ? mockTerminals.filter(t => t.clientId === selectedClient.id) 
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clientes y Afiliados</h1>
          <p className="text-slate-500 text-sm">Gestiona la cartera de afiliados POS basada en tu archivo maestro.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="gap-2 hidden md:flex" onClick={handleExport}>
            <Download size={16} />
            Exportar Excel
          </Button>
          <Button 
            variant="primary" 
            className="gap-2 shadow-lg shadow-indigo-200 w-full md:w-auto"
            onClick={() => onNavigate('import')}
          >
            <Plus size={18} />
            <span className="md:hidden">Nuevo</span>
            <span className="hidden md:inline">Importar Clientes</span>
          </Button>
        </div>
      </div>

      {/* overflow-visible Added here to fix popover clipping */}
      <Card className="flex flex-col bg-white overflow-visible">
        {/* Advanced Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              type="text" 
              placeholder="Buscar por nombre, RIF o código..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Faceted Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            
            {/* Status Filter (GESTION) */}
            <Popover 
              trigger={
                <Button variant="outline" className={`gap-2 border-dashed group hover:border-indigo-300 hover:bg-indigo-50/50 ${selectedStatuses.length > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'text-slate-600'}`}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedStatuses.length > 0 ? 'border-indigo-300 bg-indigo-200 text-indigo-700' : 'border-slate-400 text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-600'}`}>
                     <Plus size={10} strokeWidth={3} />
                  </div>
                  Gestión
                  {selectedStatuses.length > 0 && (
                    <>
                        <div className="h-4 w-px bg-indigo-300 mx-1"></div>
                        <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{selectedStatuses.length}</span>
                    </>
                  )}
                </Button>
              }
              content={
                <div className="w-[280px] flex flex-col">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                     <h4 className="font-medium text-xs text-slate-500 uppercase tracking-wider">Filtrar por Estado</h4>
                  </div>
                  <div className="p-2 max-h-[280px] overflow-y-auto space-y-1">
                    {statuses.map(status => (
                       <FilterItem 
                          key={status}
                          label={status}
                          isSelected={selectedStatuses.includes(status)}
                          onClick={() => toggleFilter(selectedStatuses, setSelectedStatuses, status)}
                          badgeVariant={getStatusVariant(status)}
                       />
                    ))}
                  </div>
                  {selectedStatuses.length > 0 && (
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                       <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-slate-500 hover:text-slate-900" onClick={() => setSelectedStatuses([])}>
                          Limpiar filtro
                       </Button>
                    </div>
                  )}
                </div>
              }
            />

            {/* Bank Filter */}
            <Popover 
               trigger={
                 <Button variant="outline" className={`gap-2 border-dashed group hover:border-indigo-300 hover:bg-indigo-50/50 ${selectedBanks.length > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'text-slate-600'}`}>
                   <Building size={14} className={selectedBanks.length > 0 ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"} />
                   Banco
                   {selectedBanks.length > 0 && (
                     <>
                        <div className="h-4 w-px bg-indigo-300 mx-1"></div>
                        <span className="text-xs font-medium">{selectedBanks.length}</span>
                     </>
                   )}
                 </Button>
               }
               content={
                 <div className="w-[280px] flex flex-col">
                   <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                         <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                           className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400" 
                           placeholder="Buscar banco..."
                           value={bankSearch}
                           onChange={(e) => setBankSearch(e.target.value)}
                           autoFocus
                         />
                      </div>
                   </div>
                   <div className="p-2 max-h-[240px] overflow-y-auto space-y-1">
                     {banks.filter(b => b.toLowerCase().includes(bankSearch.toLowerCase())).map(bank => (
                        <FilterItem 
                           key={bank}
                           label={bank}
                           isSelected={selectedBanks.includes(bank)}
                           onClick={() => toggleFilter(selectedBanks, setSelectedBanks, bank)}
                        />
                     ))}
                     {banks.filter(b => b.toLowerCase().includes(bankSearch.toLowerCase())).length === 0 && (
                        <div className="py-4 text-center text-xs text-slate-400">No se encontraron resultados</div>
                     )}
                   </div>
                   {selectedBanks.length > 0 && (
                     <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                        <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-slate-500 hover:text-slate-900" onClick={() => setSelectedBanks([])}>
                           Limpiar ({selectedBanks.length})
                        </Button>
                     </div>
                   )}
                 </div>
               }
            />

             {/* Region Filter */}
             <Popover 
               trigger={
                 <Button variant="outline" className={`gap-2 border-dashed group hover:border-indigo-300 hover:bg-indigo-50/50 ${selectedRegions.length > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'text-slate-600'}`}>
                   <MapPin size={14} className={selectedRegions.length > 0 ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"} />
                   Región
                   {selectedRegions.length > 0 && (
                     <>
                        <div className="h-4 w-px bg-indigo-300 mx-1"></div>
                        <span className="text-xs font-medium">{selectedRegions.length}</span>
                     </>
                   )}
                 </Button>
               }
               content={
                 <div className="w-[280px] flex flex-col">
                   <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                         <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                           className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400" 
                           placeholder="Buscar región..."
                           value={regionSearch}
                           onChange={(e) => setRegionSearch(e.target.value)}
                           autoFocus
                         />
                      </div>
                   </div>
                   <div className="p-2 max-h-[240px] overflow-y-auto space-y-1">
                     {regions.filter(r => r.toLowerCase().includes(regionSearch.toLowerCase())).map(region => (
                        <FilterItem 
                           key={region}
                           label={region}
                           isSelected={selectedRegions.includes(region)}
                           onClick={() => toggleFilter(selectedRegions, setSelectedRegions, region)}
                        />
                     ))}
                     {regions.filter(r => r.toLowerCase().includes(regionSearch.toLowerCase())).length === 0 && (
                        <div className="py-4 text-center text-xs text-slate-400">No se encontraron resultados</div>
                     )}
                   </div>
                   {selectedRegions.length > 0 && (
                     <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                        <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-slate-500 hover:text-slate-900" onClick={() => setSelectedRegions([])}>
                           Limpiar ({selectedRegions.length})
                        </Button>
                     </div>
                   )}
                 </div>
               }
            />
            
            {(selectedBanks.length > 0 || selectedRegions.length > 0 || selectedStatuses.length > 0) && (
                <Button variant="ghost" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs h-9 px-3" onClick={() => { setSelectedBanks([]); setSelectedRegions([]); setSelectedStatuses([]); }}>
                    Resetear todos
                </Button>
            )}
          </div>
        </div>

        {/* Data View - Desktop (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Afiliado (Nombre / RIF)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gestión</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rango TX</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Banco</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Región</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">POS</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // Skeleton Rows
                [1, 2, 3, 4, 5].map(i => (
                   <tr key={i}>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <Skeleton className="w-9 h-9 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="w-32 h-4" />
                                <Skeleton className="w-20 h-3" />
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="w-24 h-5 rounded-full" /></td>
                      <td className="px-6 py-4"><Skeleton className="w-24 h-4" /></td>
                      <td className="px-6 py-4"><Skeleton className="w-20 h-4" /></td>
                      <td className="px-6 py-4"><Skeleton className="w-20 h-4" /></td>
                      <td className="px-6 py-4"><Skeleton className="w-8 h-4 mx-auto" /></td>
                      <td className="px-6 py-4"><Skeleton className="w-8 h-8 rounded-md" /></td>
                   </tr>
                ))
              ) : (
                filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100 ring-2 ring-white shrink-0">
                            {client.initials}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-slate-900 block truncate max-w-[180px]">{client.name}</span>
                            <span className="text-xs text-slate-500 font-mono">{client.rif}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(client.gestion)}>
                          {client.gestion}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${
                            client.rango.includes('SIN TX') ? 'text-rose-600' : 'text-slate-600'
                        }`}>
                            {client.rango}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{client.banco}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex flex-col">
                            <span>{client.region}</span>
                            <span className="text-[10px] text-slate-400">{client.estado}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-bold text-center bg-slate-50/50">{client.terminalsCount}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                         <Search size={32} className="text-slate-300 mb-3" />
                         <p className="font-medium text-slate-900">No se encontraron afiliados</p>
                         <p className="text-sm mt-1">Intenta ajustar tus filtros de búsqueda.</p>
                         <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearchQuery(''); setSelectedBanks([]); setSelectedRegions([]); setSelectedStatuses([]); }}>
                            Limpiar filtros
                         </Button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Data View - Mobile (Card List) */}
        <div className="md:hidden bg-slate-50 p-4 space-y-4">
           {isLoading ? (
              [1, 2, 3].map(i => (
                 <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between">
                       <div className="flex gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-1">
                             <Skeleton className="w-32 h-4" />
                             <Skeleton className="w-16 h-3" />
                          </div>
                       </div>
                       <Skeleton className="w-16 h-5 rounded-full" />
                    </div>
                 </div>
              ))
           ) : (
             filteredClients.length > 0 ? (
                filteredClients.map(client => (
                   <div 
                     key={client.id} 
                     onClick={() => setSelectedClient(client)}
                     className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
                   >
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                               {client.initials}
                            </div>
                            <div className="overflow-hidden">
                               <h4 className="font-bold text-slate-900 text-sm truncate w-40">{client.name}</h4>
                               <p className="text-xs text-slate-500 font-mono">{client.rif}</p>
                            </div>
                         </div>
                         <Badge variant={getStatusVariant(client.gestion)} className="text-[10px]">
                            {client.gestion}
                         </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase">Banco</span>
                            <span className="text-xs font-medium text-slate-700">{client.banco}</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 uppercase">Rango TX</span>
                            <span className="text-xs font-medium text-slate-700">{client.rango}</span>
                         </div>
                      </div>
                   </div>
                ))
             ) : (
                <div className="text-center py-10 px-4">
                   <p className="text-slate-500">No hay resultados.</p>
                </div>
             )
           )}
        </div>
      </Card>

      {/* Client 360 Drawer (EDIT MODE ENABLED) */}
      <Sheet open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        {selectedClient && (
          <>
            <SheetHeader>
               <div className="flex flex-col gap-4">
                  {/* Top Bar with Actions */}
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                           {selectedClient.initials}
                        </div>
                        <div>
                           <SheetTitle className="text-lg leading-tight">{selectedClient.name}</SheetTitle>
                           <div className="flex flex-wrap items-center gap-2 mt-1">
                              {isEditing ? (
                                 <select 
                                    value={editForm.gestion} 
                                    onChange={(e) => setEditForm({...editForm, gestion: e.target.value})}
                                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium"
                                 >
                                    {gestionOptions.map(opt => (
                                       <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                 </select>
                              ) : (
                                 <Badge variant={getStatusVariant(selectedClient.gestion)}>
                                    {selectedClient.gestion}
                                 </Badge>
                              )}
                              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">RIF: {selectedClient.rif}</span>
                           </div>
                        </div>
                     </div>
                     
                     {/* Edit Toggle */}
                     <Button 
                        variant={isEditing ? "ghost" : "outline"} 
                        size="sm" 
                        className={isEditing ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "text-slate-500"}
                        onClick={() => {
                           if(isEditing) {
                              // Cancel
                              setIsEditing(false);
                              setEditForm(selectedClient);
                           } else {
                              setIsEditing(true);
                           }
                        }}
                     >
                        {isEditing ? <X size={16} /> : <Pencil size={16} />}
                     </Button>
                  </div>
                  
                  {!isEditing && (
                     <div className="flex gap-2 mt-1">
                        <Button variant="outline" size="sm" className="flex-1 gap-2"><Phone size={14}/> Llamar</Button>
                        <Button variant="success" size="sm" className="flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent"><Phone size={14}/> WhatsApp</Button>
                     </div>
                  )}
               </div>
            </SheetHeader>

            <SheetContent className="flex flex-col h-full">
               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                 <TabsList className="w-full grid grid-cols-3 mb-6">
                   <TabsTrigger value="summary" activeValue={activeTab} onClick={() => setActiveTab('summary')}>General</TabsTrigger>
                   <TabsTrigger value="terminals" activeValue={activeTab} onClick={() => setActiveTab('terminals')}>POS ({selectedClient.terminalsCount})</TabsTrigger>
                   <TabsTrigger value="location" activeValue={activeTab} onClick={() => setActiveTab('location')}>Ubicación</TabsTrigger>
                 </TabsList>

                 <TabsContent value="summary" activeValue={activeTab} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Datos del Afiliado</h4>
                          {isEditing && <span className="text-[10px] text-indigo-600 font-medium animate-pulse">Modo Edición Activo</span>}
                       </div>
                       
                       <div className="space-y-3">
                          {/* Contact Person */}
                          <div className="flex items-start gap-3 text-sm">
                             <User size={16} className="text-slate-400 mt-0.5" />
                             <div className="flex flex-col flex-1">
                               <span className="text-slate-500 text-xs">Persona Contacto</span>
                               {isEditing ? (
                                 <Input 
                                    value={editForm.personaContacto} 
                                    onChange={(e) => setEditForm({...editForm, personaContacto: e.target.value})}
                                    className="h-8 text-sm mt-1"
                                 />
                               ) : (
                                 <span className="text-slate-900 font-medium">{selectedClient.personaContacto}</span>
                               )}
                             </div>
                          </div>

                          {/* Phone */}
                          <div className="flex items-start gap-3 text-sm">
                             <Phone size={16} className="text-slate-400 mt-0.5" />
                             <div className="flex flex-col flex-1">
                               <span className="text-slate-500 text-xs">Teléfono</span>
                               {isEditing ? (
                                 <Input 
                                    value={editForm.telefono} 
                                    onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                                    className="h-8 text-sm mt-1"
                                 />
                               ) : (
                                 <span className="text-slate-900 font-medium">{selectedClient.telefono}</span>
                               )}
                             </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-start gap-3 text-sm">
                             <Mail size={16} className="text-slate-400 mt-0.5" />
                             <div className="flex flex-col flex-1">
                               <span className="text-slate-500 text-xs">Email (CRM)</span>
                               {isEditing ? (
                                 <Input 
                                    value={editForm.email || ''} 
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="h-8 text-sm mt-1"
                                    placeholder="Agregar correo..."
                                 />
                               ) : (
                                 <span className={cn("font-medium", selectedClient.email ? "text-slate-900" : "text-slate-400 italic")}>
                                    {selectedClient.email || 'No registrado'}
                                 </span>
                               )}
                             </div>
                          </div>

                          {/* Affiliate Code (Read Only) */}
                          <div className="flex items-start gap-3 text-sm">
                             <CreditCard size={16} className="text-slate-400 mt-0.5" />
                             <div className="flex flex-col">
                               <span className="text-slate-500 text-xs">Código Afiliado</span>
                               <span className="text-slate-900 font-medium">{selectedClient.codigoAfiliado}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {isEditing && (
                       <div className="pt-4 flex justify-end">
                          <Button onClick={handleSaveChanges} className="gap-2 shadow-lg shadow-indigo-200">
                             <Save size={16} /> Guardar Cambios
                          </Button>
                       </div>
                    )}

                    <div className="h-px bg-slate-100 w-full" />

                    <div className="space-y-4">
                       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clasificación</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <span className="text-[10px] text-slate-500 block">Categoría</span>
                             <p className="text-xs font-bold text-slate-900 mt-1">{selectedClient.categoriaComercio}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <span className="text-[10px] text-slate-500 block">Rango TX</span>
                             <p className="text-xs font-bold text-rose-600 mt-1">{selectedClient.rango}</p>
                          </div>
                       </div>
                    </div>
                 </TabsContent>

                 <TabsContent value="terminals" activeValue={activeTab} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    {clientTerminals.map(term => (
                       <div key={term.id} className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                   term.estadoPos === 'INSTALADO' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                   <CreditCard size={16} />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-900">{term.modelo}</p>
                                   <p className="text-xs text-slate-500 font-mono">{term.serial}</p>
                                </div>
                             </div>
                             <Badge variant="neutral" className="text-[10px]">{term.marca}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                             <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-400 block text-[10px]">Operadora</span>
                                <span className="font-medium">{term.operadora}</span>
                             </div>
                             <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-400 block text-[10px]">Detalle</span>
                                <span className="font-medium truncate block" title={term.modeloDetalle}>{term.modeloDetalle}</span>
                             </div>
                          </div>

                          {term.observacion && (
                             <div className="text-xs bg-amber-50 text-amber-800 p-2 rounded border border-amber-100">
                                <span className="font-bold">Obs:</span> {term.observacion}
                             </div>
                          )}
                       </div>
                    ))}
                    {clientTerminals.length === 0 && (
                       <div className="text-center py-6 text-slate-400 text-sm">No hay terminales registrados</div>
                    )}
                 </TabsContent>

                 <TabsContent value="location" activeValue={activeTab} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                     <div className="space-y-4">
                        <div className="flex items-start gap-3 text-sm">
                             <MapPin size={16} className="text-slate-400 mt-0.5" />
                             <div className="flex flex-col">
                               <span className="text-slate-500 text-xs">Dirección Fiscal</span>
                               <span className="text-slate-900 font-medium leading-snug">{selectedClient.direccion}</span>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                             <div className="space-y-1">
                                <span className="text-xs text-slate-500">Estado</span>
                                <p className="text-sm font-medium text-slate-900">{selectedClient.estado}</p>
                             </div>
                             <div className="space-y-1">
                                <span className="text-xs text-slate-500">Ciudad</span>
                                <p className="text-sm font-medium text-slate-900">{selectedClient.ciudad}</p>
                             </div>
                             <div className="space-y-1">
                                <span className="text-xs text-slate-500">Sector</span>
                                <p className="text-sm font-medium text-slate-900">{selectedClient.sector}</p>
                             </div>
                             <div className="space-y-1">
                                <span className="text-xs text-slate-500">Región</span>
                                <p className="text-sm font-medium text-slate-900">{selectedClient.region}</p>
                             </div>
                        </div>
                     </div>
                 </TabsContent>
               </Tabs>
            </SheetContent>
          </>
        )}
      </Sheet>
    </div>
  );
}
