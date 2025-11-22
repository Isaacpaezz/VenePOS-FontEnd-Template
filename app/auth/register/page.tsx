import React, { useState } from 'react';
import { Button, Input, Label } from '../../../components/UI';
import { User, Building2, MapPin, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { Route } from '../../../types';

interface RegisterPageProps {
  onNavigate: (route: Route) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular creación de Tenant y Usuario
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('onboarding');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Side - Info */}
        <div className="w-full lg:w-2/5 bg-[#0F172A] p-8 lg:p-12 flex flex-col justify-between relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
           
           <div>
             <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-white font-bold text-xl">VenePOS</span>
             </div>
             
             <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
               Comienza a recuperar tu cartera hoy.
             </h2>
             <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed">Automatización de mensajes por WhatsApp y SMS.</p>
                </div>
                <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed">Gestión centralizada de comunicaciones.</p>
                </div>
                <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed">Reportes de terminales POS Credicard en tiempo real.</p>
                </div>
             </div>
           </div>

           <div className="text-slate-500 text-xs mt-8 lg:mt-0">
             Paso {step} de 2: {step === 1 ? 'Datos del Administrador' : 'Información de la Empresa'}
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
           <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Crear nueva cuenta</h1>
              <p className="text-slate-500 mt-2 text-sm">Prueba gratis por 14 días. Sin tarjeta de crédito.</p>
           </div>

           <form onSubmit={step === 1 ? handleNext : handleRegister} className="space-y-6 max-w-md">
              
              {/* Step 1: User Info */}
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                   <div className="space-y-2">
                      <Label>Nombre Completo</Label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <Input className="pl-10" placeholder="Ej. Juan Pérez" required autoFocus />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label>Correo Corporativo</Label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <Input type="email" className="pl-10" placeholder="juan@empresa.com" required />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label>Contraseña</Label>
                      <Input type="password" placeholder="Mínimo 8 caracteres" required />
                   </div>
                </div>
              )}

              {/* Step 2: Company Info */}
              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                   <div className="space-y-2">
                      <Label>Nombre de la Empresa / Organización</Label>
                      <div className="relative">
                         <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <Input className="pl-10" placeholder="Ej. Soluciones Financieras CA" required autoFocus />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label>RIF / NIT / ID Fiscal</Label>
                      <div className="relative">
                         <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <Input className="pl-10" placeholder="J-12345678-9" required />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label>País / Región</Label>
                      <div className="relative">
                         <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <option>Venezuela</option>
                            <option>Colombia</option>
                            <option>Panamá</option>
                            <option>México</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between gap-4">
                 {step === 2 ? (
                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="text-slate-500">
                       <ArrowLeft size={16} className="mr-2" /> Atrás
                    </Button>
                 ) : (
                    <div className="text-sm text-slate-500">
                       ¿Ya tienes cuenta? <button type="button" onClick={() => onNavigate('login')} className="text-indigo-600 font-medium">Entrar</button>
                    </div>
                 )}
                 
                 <Button type="submit" className="ml-auto shadow-lg shadow-indigo-200" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : step === 1 ? 'Siguiente' : 'Finalizar Registro'}
                    {!isLoading && <ArrowRight size={16} className="ml-2" />}
                 </Button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}