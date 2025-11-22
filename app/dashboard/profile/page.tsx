
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, Button, Input, Label, 
  Tabs, TabsList, TabsTrigger, TabsContent, Checkbox, Badge, 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '../../../components/UI';
import { 
  User, Lock, Bell, Camera, Mail, Smartphone, Briefcase, 
  Moon, Sun, Laptop, ShieldCheck, Save, QrCode 
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  // Mock State for Profile
  const [profile, setProfile] = useState({
    name: 'Carlos Ruiz',
    email: 'admin@credicardpos.com',
    phone: '+58 414 1234567',
    role: 'Jefe de Recuperación',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Ruiz&background=334155&color=fff'
  });

  // Mock State for Preferences
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    marketing: false
  });

  const handleSave = () => {
    alert("Cambios guardados correctamente");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mi Perfil</h1>
          <p className="text-slate-500 text-sm">Gestiona tu información personal y preferencias de cuenta.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 shadow-lg shadow-indigo-100">
            <Save size={16} /> Guardar Cambios
        </Button>
      </div>

      {/* Profile Summary Card */}
      <Card>
         <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <div className="relative group cursor-pointer shrink-0">
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full ring-2 ring-slate-100 object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                     <Camera className="text-white" size={20} />
                  </div>
               </div>
               <div className="text-center md:text-left flex-1 space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-sm text-slate-500">
                     <span className="flex items-center gap-1"><Briefcase size={14} /> {profile.role}</span>
                     <span className="hidden md:inline">•</span>
                     <Badge variant="primary" className="text-[10px]">ADMINISTRADOR</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{profile.email}</p>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex md:bg-white md:border md:border-slate-200 p-1 rounded-xl h-auto">
            <TabsTrigger value="personal" activeValue={activeTab} onClick={() => setActiveTab('personal')} className="px-6 py-2">
               <User size={16} className="mr-2" /> Personal
            </TabsTrigger>
            <TabsTrigger value="security" activeValue={activeTab} onClick={() => setActiveTab('security')} className="px-6 py-2">
               <ShieldCheck size={16} className="mr-2" /> Seguridad
            </TabsTrigger>
            <TabsTrigger value="preferences" activeValue={activeTab} onClick={() => setActiveTab('preferences')} className="px-6 py-2">
               <Bell size={16} className="mr-2" /> Preferencias
            </TabsTrigger>
         </TabsList>

         {/* --- PERSONAL INFO --- */}
         <TabsContent value="personal" activeValue={activeTab} className="mt-6 space-y-6 animate-in fade-in duration-300">
            <Card>
               <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label>Nombre Completo</Label>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="pl-10" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>Cargo / Rol</Label>
                        <div className="relative">
                           <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <Input value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} className="pl-10" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>Correo Electrónico</Label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <Input value={profile.email} disabled className="pl-10 bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" />
                        </div>
                        <p className="text-[10px] text-slate-400">El correo es gestionado por la organización.</p>
                     </div>
                     <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <div className="relative">
                           <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="pl-10" />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </TabsContent>

         {/* --- SECURITY --- */}
         <TabsContent value="security" activeValue={activeTab} className="mt-6 space-y-6 animate-in fade-in duration-300">
            <Card>
               <CardHeader>
                  <CardTitle>Contraseña</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label>Contraseña Actual</Label>
                     <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label>Nueva Contraseña</Label>
                        <Input type="password" />
                     </div>
                     <div className="space-y-2">
                        <Label>Confirmar Contraseña</Label>
                        <Input type="password" />
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <Button variant="outline">Actualizar Contraseña</Button>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <CardTitle>Autenticación de Dos Factores (2FA)</CardTitle>
                     <Badge variant="neutral">Desactivado</Badge>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <p className="text-sm text-slate-500 max-w-lg">
                        Añade una capa extra de seguridad a tu cuenta requiriendo un código temporal desde tu móvil al iniciar sesión. Recomendamos usar Google Authenticator o Authy.
                     </p>
                     <Button variant="secondary" onClick={() => setIs2FAModalOpen(true)}>
                        Configurar 2FA
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </TabsContent>

         {/* --- PREFERENCES --- */}
         <TabsContent value="preferences" activeValue={activeTab} className="mt-6 space-y-6 animate-in fade-in duration-300">
            <Card>
               <CardHeader>
                  <CardTitle>Apariencia</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-3 gap-4 max-w-lg">
                     <button 
                       onClick={() => setTheme('light')}
                       className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-200 hover:border-slate-300'}`}
                     >
                        <Sun size={24} />
                        <span className="text-sm font-medium">Claro</span>
                     </button>
                     <button 
                       onClick={() => setTheme('dark')}
                       className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-200 hover:border-slate-300'}`}
                     >
                        <Moon size={24} />
                        <span className="text-sm font-medium">Oscuro</span>
                     </button>
                     <button 
                       onClick={() => setTheme('system')}
                       className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-200 hover:border-slate-300'}`}
                     >
                        <Laptop size={24} />
                        <span className="text-sm font-medium">Sistema</span>
                     </button>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <div className="space-y-0.5">
                        <Label className="text-base">Resumen por Correo</Label>
                        <p className="text-xs text-slate-500">Recibe un resumen semanal de la actividad de tus campañas.</p>
                     </div>
                     <Checkbox checked={notifications.email} onCheckedChange={() => setNotifications({...notifications, email: !notifications.email})} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <div className="space-y-0.5">
                        <Label className="text-base">Alertas en Tiempo Real</Label>
                        <p className="text-xs text-slate-500">Notificaciones en el navegador para pagos recibidos y alertas de terminales.</p>
                     </div>
                     <Checkbox checked={notifications.browser} onCheckedChange={() => setNotifications({...notifications, browser: !notifications.browser})} />
                  </div>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>

      {/* 2FA Modal */}
      <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
         <DialogHeader>
            <DialogTitle>Configurar Autenticación de Dos Factores</DialogTitle>
         </DialogHeader>
         <DialogContent className="space-y-6 text-center">
            <p className="text-sm text-slate-500">Escanea el siguiente código QR con tu aplicación de autenticación (Google Authenticator, Authy).</p>
            <div className="flex justify-center p-6 bg-white border border-slate-200 rounded-xl w-fit mx-auto shadow-inner">
               <QrCode size={160} className="text-slate-900" />
            </div>
            <div className="space-y-2 text-left">
               <Label>Ingresa el código de 6 dígitos</Label>
               <Input placeholder="000 000" className="text-center text-lg tracking-widest font-mono uppercase" maxLength={6} />
            </div>
            <div className="flex gap-3 pt-2">
               <Button variant="outline" className="w-full" onClick={() => setIs2FAModalOpen(false)}>Cancelar</Button>
               <Button className="w-full shadow-lg shadow-indigo-200">Verificar y Activar</Button>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
