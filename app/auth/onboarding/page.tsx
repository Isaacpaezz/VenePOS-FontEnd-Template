import React, { useState } from 'react';
import { Button, Input, Label, Card, CardContent } from '../../../components/UI';
import { CheckCircle, MessageSquare, Users, ArrowRight, Loader2, Link } from 'lucide-react';
import { Route } from '../../../types';

interface OnboardingPageProps {
  onNavigate: (route: Route) => void;
}

export default function OnboardingPage({ onNavigate }: OnboardingPageProps) {
  const [step, setStep] = useState<'welcome' | 'chatwoot' | 'team'>('welcome');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyChatwoot = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const renderContent = () => {
    switch (step) {
      case 'welcome':
        return (
           <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                 <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30">V</div>
              </div>
              <div>
                 <h1 className="text-3xl font-bold text-slate-900">¡Bienvenido a VenePOS!</h1>
                 <p className="text-slate-500 mt-2 max-w-md mx-auto">Tu espacio de trabajo ha sido creado exitosamente. Configuremos lo básico para empezar a operar.</p>
              </div>
              <Button size="lg" className="shadow-xl shadow-indigo-200 mt-8" onClick={() => setStep('chatwoot')}>
                 Comenzar Configuración <ArrowRight className="ml-2" />
              </Button>
           </div>
        );

      case 'chatwoot':
        return (
           <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <MessageSquare size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">Conectar Chatwoot</h2>
                    <p className="text-sm text-slate-500">Vincula tu instancia para sincronizar contactos y campañas.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label>URL de Instancia Chatwoot</Label>
                    <Input placeholder="https://app.chatwoot.com" />
                 </div>
                 <div className="space-y-2">
                    <Label>User API Token</Label>
                    <Input type="password" placeholder="Pegar token aquí..." />
                    <p className="text-xs text-slate-400">Lo encuentras en Perfil {'>'} Configuración de Perfil.</p>
                 </div>
                 <div className="space-y-2">
                    <Label>ID de Cuenta (Account ID)</Label>
                    <Input placeholder="Ej. 1" />
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6">
                 {!isVerified ? (
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      onClick={handleVerifyChatwoot}
                      disabled={isVerifying}
                    >
                       {isVerifying ? <Loader2 className="animate-spin mr-2" /> : <Link className="mr-2" size={16} />}
                       {isVerifying ? 'Verificando conexión...' : 'Verificar Conexión'}
                    </Button>
                 ) : (
                    <div className="space-y-4">
                       <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-sm font-medium">
                          <CheckCircle size={16} />
                          Conexión establecida correctamente.
                       </div>
                       <Button className="w-full" onClick={() => setStep('team')}>
                          Continuar <ArrowRight className="ml-2" size={16} />
                       </Button>
                    </div>
                 )}
              </div>
              <button onClick={() => setStep('team')} className="text-xs text-slate-400 hover:text-slate-600 w-full text-center mt-2">
                 Omitir por ahora
              </button>
           </div>
        );

      case 'team':
        return (
           <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <Users size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">Invitar al Equipo</h2>
                    <p className="text-sm text-slate-500">Agrega colaboradores a tu organización.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                       <Input placeholder="colaborador@empresa.com" className="flex-1" />
                       <select className="w-32 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>Agente</option>
                          <option>Admin</option>
                       </select>
                    </div>
                 ))}
                 <Button variant="ghost" size="sm" className="text-indigo-600">
                    + Agregar otro
                 </Button>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                 <button onClick={() => onNavigate('dashboard')} className="text-sm text-slate-500 hover:text-slate-900">
                    Omitir
                 </button>
                 <Button className="shadow-lg shadow-indigo-200" onClick={() => onNavigate('dashboard')}>
                    Finalizar y Entrar
                 </Button>
              </div>
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
       {/* Step Progress Dots (Simple) */}
       {step !== 'welcome' && (
         <div className="flex gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full transition-colors ${step === 'chatwoot' ? 'bg-indigo-600 scale-110' : 'bg-indigo-200'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-colors ${step === 'team' ? 'bg-indigo-600 scale-110' : 'bg-indigo-200'}`}></div>
         </div>
       )}

       <Card className="w-full max-w-lg border-0 shadow-2xl ring-1 ring-slate-100 bg-white">
          <CardContent className="p-8 lg:p-10">
             {renderContent()}
          </CardContent>
       </Card>
    </div>
  );
}