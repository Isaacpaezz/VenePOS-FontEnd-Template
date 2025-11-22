
import React, { useState } from 'react';
import { Card, CardContent, Button } from '../../../components/UI';
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    alert("Funcionalidad de carga mockeada: Archivo recibido");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-8">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Importar Datos</h1>
        <p className="text-slate-500 text-sm mt-2">Carga masiva de clientes y transacciones mediante CSV o Excel.</p>
      </div>

      <Card className="shadow-lg border-0 ring-1 ring-slate-200">
        <CardContent className="p-10">
          <div 
            className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center transition-all duration-300 ${
              dragActive 
                ? 'border-primary bg-indigo-50 scale-[1.02]' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${dragActive ? 'bg-white text-primary' : 'bg-slate-100 text-slate-400'}`}>
              <UploadCloud size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Arrastra tu archivo CSV/XLSX aquí
            </h3>
            <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
              o haz clic en el botón para buscar los archivos en tu ordenador
            </p>
            <div className="flex gap-4">
                <Button variant="secondary" size="md" className="min-w-[140px]">
                Seleccionar Archivo
                </Button>
            </div>
            <input type="file" className="hidden" />
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors cursor-pointer">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <FileSpreadsheet size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Plantilla de Clientes</h4>
                  <p className="text-xs text-slate-500 mt-1">Descarga el formato requerido.</p>
                  <span className="text-xs font-medium text-primary mt-2 inline-block hover:underline">Descargar CSV</span>
                </div>
             </div>
             <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Restricciones</h4>
                  <p className="text-xs text-slate-500 mt-1">Máx 10,000 filas. UTF-8. Sin celdas combinadas.</p>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
