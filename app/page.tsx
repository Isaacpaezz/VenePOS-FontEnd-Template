
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from '../components/UI';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Megaphone, Calendar, ChevronDown } from 'lucide-react';
import { chartData, dashboardActivities } from '../mockData';
import { KPI, Route } from '../types';

interface DashboardPageProps {
  onNavigate?: (route: Route) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [timeRange, setTimeRange] = useState('Semana');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800); // 800ms simulates a fast API
    return () => clearTimeout(timer);
  }, []);

  // Date Formatting
  const today = new Date();
  const dateString = today.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  // Capitalize first letter
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  const kpis: KPI[] = [
    { label: 'Terminales Recuperados', value: '1,284', trend: 12.5, trendLabel: '+12.5%', isUp: true },
    { label: 'Terminales Inactivos', value: '324', trend: 5.4, trendLabel: '+5.4%', isUp: false },
    { label: 'Recuperación Mensual', value: '$452,000', trend: 8.2, trendLabel: '+8.2%', isUp: true },
    { label: 'Tasa de Éxito', value: '94.2%', trend: 1.1, trendLabel: '-1.1%', isUp: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Buenos días, Admin</h1>
          <p className="text-slate-500 mt-1 capitalize">{formattedDate}</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white gap-2">
              <Calendar size={16} />
              <span>Nov 1 - Nov 20, 2025</span>
              <ChevronDown size={14} className="text-slate-400" />
           </Button>
           <Button 
             variant="primary" 
             className="shadow-lg shadow-indigo-200"
             onClick={() => onNavigate?.('campaigns-new')}
           >
              Nueva Campaña
           </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton Loaders for KPIs
          [1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-slate-100">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          kpis.map((kpi, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow border border-slate-100">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-slate-500">{kpi.label}</span>
                  <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${
                    kpi.isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {kpi.isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                    {kpi.trendLabel}
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart: Funnel Efficiency */}
        <div className="lg:col-span-2">
          <Card className="h-full shadow-sm border border-slate-100">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-4">
              <div>
                <CardTitle>Rendimiento de Recuperación</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Eficiencia del embudo de comunicación diario.</p>
              </div>
              
              <div className="flex bg-slate-100 rounded-lg p-1 shrink-0">
                {['Día', 'Semana', 'Mes'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      timeRange === range 
                        ? 'bg-white shadow-sm text-slate-900' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                {isLoading ? (
                   <Skeleton className="w-full h-full rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36} 
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                      />
                      <Bar name="Contactados" dataKey="sent" stackId="a" fill="#cbd5e1" radius={[0, 0, 0, 0]} barSize={32} />
                      <Bar name="En Conversación" dataKey="replied" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={32} />
                      <Bar name="Recuperados" dataKey="recovered" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-1">
          <Card className="h-full border border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-2 space-y-8 before:absolute before:left-[19px] before:top-3 before:h-[85%] before:w-[2px] before:bg-slate-100">
                {isLoading ? (
                   [1, 2, 3, 4].map(i => (
                     <div key={i} className="flex gap-4 relative z-10 bg-white">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2 w-full">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-3 w-full" />
                        </div>
                     </div>
                   ))
                ) : (
                  dashboardActivities.map((item) => (
                    <div key={item.id} className="relative flex gap-4 group bg-white">
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-110 ${
                        item.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                        item.type === 'alert' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type === 'payment' && <CheckCircle2 size={18} />}
                        {item.type === 'alert' && <AlertTriangle size={18} />}
                        {item.type === 'system' && <Megaphone size={18} />}
                      </div>
                      <div className="flex flex-col gap-0.5 pb-2">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <span className="text-sm font-bold text-slate-900">{item.title}</span>
                        </div>
                        
                        <p className="text-xs text-slate-500 leading-snug">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                          {item.amount && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                              {item.amount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {!isLoading && (
                <Button variant="ghost" className="w-full mt-4 text-slate-500 text-xs hover:text-slate-900">
                  Ver toda la actividad
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
