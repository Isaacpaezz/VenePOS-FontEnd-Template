import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent, Badge, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/UI';
import { Building2, Users, Plug, CreditCard, Save, UploadCloud, Mail, Plus, MoreHorizontal, CheckCircle2, XCircle, RefreshCw, Loader2, Eye, EyeOff, MessageSquare, Trash2, ArrowRight, Workflow } from 'lucide-react';
import { mockTeamMembers } from '../../../mockData';
import { TeamMember } from '../../../types';

interface LabelMapping {
   id: number;
   chatwootLabel: string;
   posStatus: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // Team State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('agent');

  // Integrations State
  const [chatwootStatus, setChatwootStatus] = useState<'disconnected' | 'connected' | 'testing'>('disconnected');
  const [showToken, setShowToken] = useState(false);
  
  // Label Mapping State
  const [mappings, setMappings] = useState<LabelMapping[]>([
    { id: 1, chatwootLabel: 'pago-confirmado', posStatus: 'active' },
    { id: 2, chatwootLabel: 'no-interesado', posStatus: 'inactive' },
    { id: 3, chatwootLabel: 'negociacion', posStatus: 'pending' }
  ]);

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: `u${Date.now()}`,
      name: '',
      email: inviteEmail,
      role: inviteRole as any,
      status: 'invited',
      avatar: inviteEmail.substring(0,2).toUpperCase()
    };
    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const testChatwootConnection = () => {
    setChatwootStatus('testing');
    setTimeout(() => {
      setChatwootStatus('connected');
    }, 1500);
  };

  const addMapping = () => {
    setMappings([...mappings, { id: Date.now(), chatwootLabel: '', posStatus: 'active' }]);
  };

  const removeMapping = (id: number) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const updateMapping = (id: number, field: keyof LabelMapping, value: string) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configuración de Organización</h1>
        <p className="text-slate-500 text-sm">Administra tu empresa, equipo y conexiones externas.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-slate-200 p-1 shadow-sm rounded-xl">
          <TabsTrigger value="general" activeValue={activeTab} onClick={() => setActiveTab('general')}>
             <Building2 size={16} className="mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="team" activeValue={activeTab} onClick={() => setActiveTab('team')}>
             <Users size={16} className="mr-2" /> Equipo
          </TabsTrigger>
          <TabsTrigger value="integrations" activeValue={activeTab} onClick={() => setActiveTab('integrations')}>
             <Plug size={16} className="mr-2" /> Integraciones
          </TabsTrigger>
          <TabsTrigger value="billing" activeValue={activeTab} onClick={() => setActiveTab('billing')}>
             <CreditCard size={16} className="mr-2" /> Facturación
          </TabsTrigger>
        </TabsList>

        {/* --- GENERAL TAB --- */}
        <TabsContent value="general" activeValue={activeTab} className="space-y-6 animate-in fade-in duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Perfil de la Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                 {/* Logo Upload */}
                 <div className="w-full md:w-auto flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                       <UploadCloud size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-500">Logo de la Empresa</span>
                 </div>

                 {/* Company Form */}
                 <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Nombre de la Organización</Label>
                          <Input defaultValue="VenePOS Inc." />
                       </div>
                       <div className="space-y-2">
                          <Label>ID Fiscal (RIF/NIT)</Label>
                          <Input defaultValue="J-12345678-9" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Dirección Fiscal</Label>
                       <Input defaultValue="Av. Principal de Las Mercedes, Torre Financiera, Piso 5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>País</Label>
                          <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                             <option>Venezuela</option>
                             <option>Colombia</option>
                             <option>México</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <Label>Zona Horaria</Label>
                          <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                             <option>Caracas (GMT-4)</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button className="gap-2 shadow-lg shadow-indigo-100"><Save size={16} /> Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TEAM TAB --- */}
        <TabsContent value="team" activeValue={activeTab} className="space-y-6 animate-in fade-in duration-300">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Miembros del Equipo</h2>
              <Button onClick={() => setIsInviteOpen(true)} className="gap-2"><Plus size={16} /> Invitar Miembro</Button>
           </div>

           <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</th>
                          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Último Acceso</th>
                          <th className="px-6 py-3 w-10"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {teamMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-slate-50/50">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                      {member.avatar}
                                   </div>
                                   <div>
                                      <p className="text-sm font-medium text-slate-900">{member.name || 'Pendiente'}</p>
                                      <p className="text-xs text-slate-500">{member.email}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium capitalize">
                                   {member.role}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <Badge variant={member.status === 'active' ? 'success' : member.status === 'invited' ? 'warning' : 'neutral'}>
                                   {member.status === 'active' ? 'Activo' : member.status === 'invited' ? 'Invitado' : 'Desactivado'}
                                </Badge>
                             </td>
                             <td className="px-6 py-4 text-right text-sm text-slate-500">
                                {member.lastActive || '-'}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-slate-600">
                                   <MoreHorizontal size={16} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </TabsContent>

        {/* --- INTEGRATIONS TAB --- */}
        <TabsContent value="integrations" activeValue={activeTab} className="space-y-6 animate-in fade-in duration-300">
           
           {/* Chatwoot Credentials */}
           <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="pb-2">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                          <MessageSquare size={20} fill="currentColor" className="text-white" />
                       </div>
                       <div>
                          <CardTitle>Chatwoot</CardTitle>
                          <p className="text-sm text-slate-500">Plataforma de interacción con clientes (Open Source).</p>
                       </div>
                    </div>
                    <Badge variant={chatwootStatus === 'connected' ? 'success' : chatwootStatus === 'testing' ? 'warning' : 'danger'}>
                       {chatwootStatus === 'connected' ? 'Conectado' : chatwootStatus === 'testing' ? 'Verificando...' : 'Desconectado'}
                    </Badge>
                 </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label>Chatwoot Base URL</Label>
                       <Input placeholder="https://app.chatwoot.com" defaultValue="https://chat.venepos.com" />
                       <p className="text-[10px] text-slate-500">La URL donde está alojada tu instancia.</p>
                    </div>
                    <div className="space-y-2">
                       <Label>Account ID</Label>
                       <Input placeholder="Ej. 1" defaultValue="2" />
                       <p className="text-[10px] text-slate-500">ID numérico de tu cuenta en Chatwoot.</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label>User API Access Token</Label>
                    <div className="relative">
                       <Input 
                         type={showToken ? "text" : "password"} 
                         placeholder="Pegar token aquí..." 
                         defaultValue="cz_ab392819283912839"
                       />
                       <button 
                         onClick={() => setShowToken(!showToken)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                       >
                          {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-500">Este token se usará para crear contactos y enviar mensajes en tu nombre.</p>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       {chatwootStatus === 'connected' && <><CheckCircle2 size={14} className="text-emerald-500" /> Sincronización activa</>}
                       {chatwootStatus === 'disconnected' && <><XCircle size={14} className="text-rose-500" /> Credenciales inválidas o no probadas</>}
                    </div>
                    <div className="flex gap-3">
                       <Button variant="outline" onClick={testChatwootConnection} disabled={chatwootStatus === 'testing'}>
                          {chatwootStatus === 'testing' ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                          <span className="ml-2">Probar Conexión</span>
                       </Button>
                       <Button className="shadow-lg shadow-blue-100">Guardar Configuración</Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Label Automation Mapping */}
           <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="pb-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center border border-purple-200">
                       <Workflow size={20} />
                    </div>
                    <div>
                       <CardTitle>Automatización de Estados (Etiquetas)</CardTitle>
                       <p className="text-sm text-slate-500">Actualiza el estado del cliente en VenePOS cuando se asigna una etiqueta en Chatwoot.</p>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="space-y-4">
                    <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                       <div className="col-span-5">Si la etiqueta es...</div>
                       <div className="col-span-1 text-center"></div>
                       <div className="col-span-5">Establecer estado a...</div>
                       <div className="col-span-1"></div>
                    </div>
                    
                    {mappings.map((map) => (
                       <div key={map.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100 hover:border-purple-200 transition-colors group">
                          <div className="w-full md:col-span-5">
                             <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">#</span>
                                <Input 
                                  value={map.chatwootLabel}
                                  onChange={(e) => updateMapping(map.id, 'chatwootLabel', e.target.value)}
                                  className="pl-6 h-9 text-sm bg-white border-slate-200"
                                  placeholder="ej. pagado"
                                />
                             </div>
                          </div>
                          
                          <div className="hidden md:flex col-span-1 justify-center text-slate-300">
                             <ArrowRight size={16} />
                          </div>

                          <div className="w-full md:col-span-5">
                             <select 
                                value={map.posStatus}
                                onChange={(e) => updateMapping(map.id, 'posStatus', e.target.value)}
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                             >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="pending">Pendiente</option>
                             </select>
                          </div>
                          
                          <div className="w-full md:col-span-1 flex justify-end">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeMapping(map.id)}
                                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 h-9 w-9"
                             >
                                <Trash2 size={16} />
                             </Button>
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-4">
                    <Button variant="ghost" onClick={addMapping} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 gap-2">
                       <Plus size={16} /> Agregar Regla
                    </Button>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                       <Save size={16} /> Guardar Reglas
                    </Button>
                 </div>
              </CardContent>
           </Card>

        </TabsContent>

        {/* --- BILLING TAB --- */}
        <TabsContent value="billing" activeValue={activeTab} className="animate-in fade-in duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-2">
                 <CardHeader>
                    <CardTitle>Plan Actual</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-xl text-slate-900">Plan Pro</h3>
                             <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">ACTIVO</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">Facturación mensual • Próximo cobro: 01 Dic 2025</p>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">$49<span className="text-sm text-slate-500 font-normal">/mes</span></p>
                       </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                       <h4 className="text-sm font-medium text-slate-900">Uso del Plan</h4>
                       <div className="space-y-3">
                          <div className="space-y-1">
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Usuarios Activos</span>
                                <span className="font-medium text-slate-900">3 / 10</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[30%]"></div>
                             </div>
                          </div>
                          <div className="space-y-1">
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Contactos Sincronizados</span>
                                <span className="font-medium text-slate-900">1,284 / 5,000</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[25%]"></div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4">
                       <Button variant="outline">Historial de Facturas</Button>
                       <Button variant="primary">Cambiar Plan</Button>
                    </div>
                 </CardContent>
              </Card>
              
              {/* Payment Method Placeholder */}
              <Card>
                 <CardHeader>
                    <CardTitle>Método de Pago</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                       <CreditCard className="text-slate-400" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Visa terminada en 4242</p>
                          <p className="text-xs text-slate-500">Expira 12/28</p>
                       </div>
                    </div>
                    <Button variant="ghost" className="w-full text-indigo-600 text-sm">Actualizar tarjeta</Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>

      {/* Invite User Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
         <DialogHeader>
            <DialogTitle>Invitar Nuevo Miembro</DialogTitle>
            <p className="text-sm text-slate-500">Se enviará un correo electrónico con instrucciones para unirse.</p>
         </DialogHeader>
         <DialogContent className="space-y-4">
            <div className="space-y-2">
               <Label>Correo Electrónico</Label>
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="colaborador@empresa.com" 
                    className="pl-10"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
               </div>
            </div>
            <div className="space-y-2">
               <Label>Rol de Acceso</Label>
               <div className="grid grid-cols-1 gap-2">
                  <div 
                     onClick={() => setInviteRole('admin')}
                     className={`p-3 rounded-lg border cursor-pointer transition-all ${inviteRole === 'admin' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                     <p className="font-semibold text-sm text-slate-900">Administrador</p>
                     <p className="text-xs text-slate-500">Acceso total a configuración y facturación.</p>
                  </div>
                  <div 
                     onClick={() => setInviteRole('agent')}
                     className={`p-3 rounded-lg border cursor-pointer transition-all ${inviteRole === 'agent' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                     <p className="font-semibold text-sm text-slate-900">Agente</p>
                     <p className="text-xs text-slate-500">Gestión de clientes y campañas.</p>
                  </div>
                  <div 
                     onClick={() => setInviteRole('viewer')}
                     className={`p-3 rounded-lg border cursor-pointer transition-all ${inviteRole === 'viewer' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                     <p className="font-semibold text-sm text-slate-900">Visualizador</p>
                     <p className="text-xs text-slate-500">Solo lectura de reportes y dashboards.</p>
                  </div>
               </div>
            </div>
         </DialogContent>
         <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>Enviar Invitación</Button>
         </DialogFooter>
      </Dialog>
    </div>
  );
}