import React, { useState } from 'react';
import { Button, Input, Checkbox, Label } from '../../../components/UI';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Route } from '../../../types';

interface LoginPageProps {
  onNavigate: (route: Route) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulacion de login
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Brand / Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-900/10 z-0"></div>
        <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">VenePOS</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            La plataforma integral para la recuperación de puntos de venta Credicard.
          </h2>
          <p className="text-slate-400 text-lg">
            Gestiona terminales, automatiza campañas y recupera cartera vencida de forma centralizada e inteligente.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2025 VenePOS Inc. Todos los derechos reservados.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Iniciar Sesión</h1>
            <p className="text-slate-500 mt-2">Bienvenido de nuevo. Ingresa tus credenciales.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  type="email" 
                  placeholder="nombre@empresa.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Contraseña</Label>
                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                Mantener sesión iniciada
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2 shadow-lg shadow-indigo-200"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar al Panel'}
              {!isLoading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500">
            ¿No tienes una cuenta?{' '}
            <button 
              onClick={() => onNavigate('register')}
              className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Regístrate gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}