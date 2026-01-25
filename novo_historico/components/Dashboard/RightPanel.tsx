import React from 'react';
import { Download, FileText, Table, Grid, Send, History } from 'lucide-react';

const RightPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Export Station */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Download size={18} className="text-green-600" />
          <h3 className="text-sm font-bold text-slate-800">Estação de Exportação</h3>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="raw-data" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
              Incluir dados brutos
            </label>
            <div className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="raw-data" className="toggle-checkbox absolute block w-3.5 h-3.5 rounded-full bg-white border-4 appearance-none cursor-pointer top-[3px] left-[3px] peer checked:translate-x-full transition-transform duration-200" />
              <label htmlFor="raw-data" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer peer-checked:bg-green-500 transition-colors duration-200"></label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
                { icon: FileText, label: 'PDF' }, 
                { icon: Table, label: 'CSV' }, 
                { icon: Grid, label: 'Excel' }
            ].map((item, idx) => (
              <button key={idx} className="flex flex-col items-center justify-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg hover:border-green-500 hover:text-green-600 hover:shadow-sm transition-all group">
                <item.icon size={20} className="text-slate-400 group-hover:text-green-500 transition-colors" />
                <span className="text-[10px] font-semibold text-slate-500 group-hover:text-green-600">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-green-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition-all shadow-sm shadow-green-200 active:transform active:scale-[0.98]">
          Gerar Relatório
        </button>
      </div>

      {/* Intervention Log */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <History size={18} className="text-green-600" />
          <h3 className="text-sm font-bold text-slate-800">Registro de Intervenções</h3>
        </div>

        {/* Note Input */}
        <div className="mb-6 relative">
          <textarea 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 text-slate-700 resize-none h-20 placeholder:text-slate-400 placeholder:text-xs" 
            placeholder="Adicionar nota de campo..." 
          />
          <button className="absolute bottom-2 right-2 p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm">
            <Send size={14} />
          </button>
        </div>

        {/* Timeline */}
        <div className="relative pl-2 flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin">
          {/* Vertical Line */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200"></div>

          {/* Item 1 */}
          <div className="relative pl-6">
            <div className="absolute left-[3px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-green-500 z-10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-green-600 uppercase mb-0.5">Hoje, 14:30</span>
              <h4 className="text-sm font-bold text-slate-800">Pulverização Preventiva</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Aplicação de fungicida na área norte devido ao alerta de risco alto.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">Fungicida X</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">Setor N</span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="relative pl-6">
            <div className="absolute left-[3px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-slate-300 z-10"></div>
            <div className="flex flex-col opacity-90">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">11 Out, 09:00</span>
              <h4 className="text-sm font-bold text-slate-700">Inspeção Visual</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Verificação de folhas sem sinais de ferrugem visíveis.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="relative pl-6">
            <div className="absolute left-[3px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-slate-300 z-10"></div>
            <div className="flex flex-col opacity-75">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">05 Out, 08:00</span>
              <h4 className="text-sm font-bold text-slate-700">Irrigação Programada</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ciclo automático de 45 minutos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;