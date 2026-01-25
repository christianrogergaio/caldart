import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-border-light px-6 py-4 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-text-primary text-xl font-bold tracking-tight">Análise Avançada e Predição GDD</h1>
          <div className="flex flex-wrap items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="material-symbols-outlined text-[16px] text-sage">location_on</span> Setor 02-B • Estufa Premium
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="material-symbols-outlined text-[16px] text-amber-muted">update</span> Última sync: 2 min atrás
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-border-light rounded-lg px-3 py-2 text-sm font-medium hover:border-sage transition-colors cursor-pointer min-w-[140px]">
              <span className="material-symbols-outlined text-[18px] text-sage">potted_plant</span>
              <span>Soja (Glicine)</span>
              <span className="material-symbols-outlined text-[18px] ml-auto">expand_more</span>
            </button>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-border-light rounded-lg px-3 py-2 text-sm font-medium hover:border-sage transition-colors cursor-pointer min-w-[220px]">
              <span className="material-symbols-outlined text-[18px] text-coral-muted">coronavirus</span>
              <span className="flex-1 truncate text-left">Ferrugem, Míldio...</span>
              <span className="bg-sage/10 text-sage text-[10px] px-1.5 py-0.5 rounded-full">+2</span>
              <span className="material-symbols-outlined text-[18px] ml-auto">expand_more</span>
            </button>
          </div>

          <div className="h-8 w-px bg-border-light mx-2 hidden sm:block"></div>

          <div className="flex items-center bg-white border border-border-light rounded-lg overflow-hidden p-1 shadow-sm">
            <button className="p-2 text-text-secondary hover:text-sage transition-colors" title="Export JSON">
              <span className="material-symbols-outlined text-[20px]">code</span>
            </button>
            <button className="p-2 text-text-secondary hover:text-sage transition-colors" title="Export CSV">
              <span className="material-symbols-outlined text-[20px]">csv</span>
            </button>
            <button className="bg-sage text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-sage-dark transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> PDF
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;