import React from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import StatusStepper from '../UI/StatusStepper';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 flex-shrink-0 z-10 shadow-sm">
      {/* Top Bar: Title & Status */}
      <div className="px-8 py-5 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Centro de Dados e Histórico</h2>
          <p className="text-slate-500 text-sm mt-1">
            Análise detalhada de sensores, previsões e intervenções da safra atual.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Sistema Online
          </span>
          <span className="text-xs text-slate-400">Atualizado há 2min</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="px-8 pb-6 flex flex-wrap gap-6 items-end">
        
        {/* Culture Selector */}
        <div className="w-full sm:w-auto min-w-[220px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Cultura Ativa
          </label>
          <div className="relative group">
            <select className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm group-hover:border-slate-300 cursor-pointer">
              <option>Milho (Safra 23/24)</option>
              <option>Soja (Experimental)</option>
              <option>Trigo (Inverno)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronDown size={16} />
            </div>
            {/* Custom Icon inside select simulation */}
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden">
                {/* Normally we'd use padding-left and absolute icon but default select styling is tricky */}
            </div>
          </div>
        </div>

        {/* Pathogen Filters */}
        <div className="flex-1 min-w-[320px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Filtro de Patógenos
          </label>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-medium border border-green-600 shadow-sm hover:bg-green-700 transition-colors">
              Ferrugem (Soja)
              <X size={12} className="opacity-80 hover:opacity-100" />
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-slate-600 text-xs font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              Mofo Branco
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-slate-600 text-xs font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              Antracnose
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition-all">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="w-full xl:w-auto xl:ml-auto min-w-[300px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Estágio Fenológico
          </label>
          <StatusStepper />
        </div>
      </div>
    </header>
  );
};

export default Header;