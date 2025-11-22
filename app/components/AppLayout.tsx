import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  UploadCloud, 
  Settings,
  Search, 
  Bell, 
  ChevronRight,
  LogOut,
  Menu,         // Hamburguesa
  PanelLeftClose, // Icono cerrar sidebar
  PanelLeftOpen,  // Icono abrir sidebar
  X             // Cerrar en móvil
} from 'lucide-react';
import { Route } from '../../types';
import { cn } from '../../lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

export default function AppLayout({ children, currentRoute, onNavigate }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Estado Desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);     // Estado Móvil

  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'campaigns', label: 'Campañas', icon: Megaphone },
    { id: 'import', label: 'Importar', icon: UploadCloud },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const getPageName = (r: Route) => {
    if (r === 'campaigns-new') return 'Campañas';
    return navItems.find(i => i.id === r)?.label || (r === 'profile' ? 'Perfil de Usuario' : 'Panel');
  };

  // Cerrar menú móvil al navegar
  const handleNavigate = (route: Route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  // Clases dinámicas para el ancho del sidebar en escritorio
  const sidebarWidthClass = isSidebarCollapsed ? 'md:w-20' : 'md:w-64';
  // Clases dinámicas para el margen del contenido principal
  const mainMarginClass = isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64';

  // Lógica Unificada: Mostrar texto completo si NO está colapsado (Desktop) O si el menú móvil está abierto
  const isExpanded = !isSidebarCollapsed || isMobileMenuOpen;

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
      {/* Overlay para Móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-[#0F172A] border-r border-slate-800 shadow-2xl transition-all duration-300 flex flex-col",
          sidebarWidthClass, // Ancho dinámico en desktop
          // En móvil: translate-0 y ancho fijo de 64 (256px) si está abierto
          isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0" 
        )}
      >
        {/* Logo Section */}
        <div className={cn("h-16 flex items-center border-b border-slate-800/50 transition-all duration-300", !isExpanded ? "justify-center px-0" : "px-6 justify-between")}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 min-w-[32px] bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className={cn("text-white font-bold text-lg tracking-tight transition-opacity duration-300 whitespace-nowrap", !isExpanded ? "opacity-0 w-0 hidden" : "opacity-100")}>
              VenePOS
            </span>
          </div>
          
          {/* Botón Cerrar (Móvil) */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toggle Button (Desktop Only) - Ubicado justo debajo del header o flotante */}
        <div className="hidden md:flex justify-end px-4 py-2">
           <button 
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
             className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
             title={isSidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
           >
             {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
           </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {isExpanded && (
            <div className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider animate-in fade-in duration-300">
              Menu Principal
            </div>
          )}
          
          {navItems.map((item) => {
            // Highlight logic: Exact match OR Special cases (Campaigns includes campaigns-new)
            const isActive = currentRoute === item.id || (item.id === 'campaigns' && currentRoute === 'campaigns-new');
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as Route)}
                className={cn(
                  "w-full flex items-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                  !isExpanded ? "justify-center px-2" : "px-3 gap-3"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon size={20} strokeWidth={1.5} className={cn(isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors')} />
                
                {isExpanded && (
                  <span className="whitespace-nowrap animate-in fade-in duration-200">{item.label}</span>
                )}

                {/* Tooltip-like indicator for active collapsed state (Only Desktop Collapsed) */}
                {!isExpanded && isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0B1120]">
          <div 
            onClick={() => handleNavigate('profile')}
            className={cn("flex items-center rounded-lg cursor-pointer transition-colors group hover:bg-white/5 p-2", !isExpanded ? "justify-center" : "gap-3")}
            title="Ir al perfil"
          >
            <div className="relative shrink-0">
              <img 
                src="https://ui-avatars.com/api/?name=Carlos+Ruiz&background=334155&color=fff" 
                alt="Avatar" 
                className="w-9 h-9 rounded-full ring-2 ring-slate-700 group-hover:ring-primary transition-all"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
            </div>
            
            {isExpanded && (
              <>
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                  <span className="text-sm font-medium text-white truncate">Carlos Ruiz</span>
                  <span className="text-xs text-slate-400 truncate">Jefe de Recuperación</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onNavigate('login'); }} className="text-slate-500 hover:text-white transition-colors shrink-0">
                   <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300 w-full", mainMarginClass, "ml-0")}>
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between transition-all">
          
          <div className="flex items-center gap-4">
            {/* Botón Hamburguesa (Solo Móvil) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-slate-500">
              <span className="hover:text-primary cursor-pointer transition-colors hidden sm:inline">VenePOS</span>
              <ChevronRight size={14} className="mx-2 text-slate-300 hidden sm:inline" />
              <span className="font-medium text-slate-900">{getPageName(currentRoute)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Búsqueda global (Cmd+K)" 
                className="pl-9 pr-4 py-2 w-48 lg:w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-primary rounded-lg transition-all">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth w-full">
          <div key={currentRoute} className="max-w-7xl mx-auto animate-in fade-in zoom-in-[0.99] slide-in-from-bottom-2 duration-300 ease-out">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}