import React from 'react';

const HeatmapWidget: React.FC = () => {
  // Simulate grid cells with opacity/color intensity
  const cells = [
    { bg: 'bg-sage/10' }, { bg: 'bg-sage/20' }, { bg: 'bg-amber-muted/20' }, { bg: 'bg-coral-muted/10' },
    { bg: 'bg-sage/30' }, { bg: 'bg-sage/40' }, { bg: 'bg-amber-muted/30' }, { bg: 'bg-coral-muted/40' },
    { bg: 'bg-amber-muted/40' }, { bg: 'bg-amber-muted/50' }, { bg: 'bg-coral-muted/60' }, { bg: 'bg-coral-muted/30' },
    { bg: 'bg-sage/20' }, { bg: 'bg-amber-muted/30' }, { bg: 'bg-amber-muted/20' }, { bg: 'bg-sage/10' },
  ];

  return (
    <div className="lg:col-span-1 card-gradient border border-border-light rounded-2xl flex flex-col shadow-executive h-full">
      <div className="p-6 border-b border-border-light flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Mapa de Calor</h3>
          <p className="text-[10px] text-text-secondary font-medium">Pressão de Inóculos</p>
        </div>
        <span className="material-symbols-outlined text-text-secondary text-[20px]">layers</span>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden grid grid-cols-4 grid-rows-4 gap-1 p-1 border border-border-light">
          {cells.map((cell, idx) => (
            <div key={idx} className={`${cell.bg} rounded-sm transition-all hover:brightness-95 duration-300`}></div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-[10px] text-text-secondary">
          <span>Baixo Risco</span>
          <div className="flex-1 mx-3 h-1.5 rounded-full bg-gradient-to-r from-sage/40 via-amber-muted/40 to-coral-muted/60"></div>
          <span>Alto Risco</span>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-[11px] font-bold text-text-primary uppercase tracking-wide">Principais Alertas</p>
          
          <div className="flex items-center gap-3 p-3 bg-white border border-border-light rounded-xl hover:shadow-sm transition-shadow cursor-pointer group">
            <div className="w-2 h-2 rounded-full bg-coral-muted group-hover:animate-pulse"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-text-primary">Ponto 12-C</p>
              <p className="text-[10px] text-text-secondary">Foco de Míldio detectado</p>
            </div>
            <span className="material-symbols-outlined text-text-secondary text-[16px] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white border border-border-light rounded-xl hover:shadow-sm transition-shadow cursor-pointer group">
            <div className="w-2 h-2 rounded-full bg-amber-muted group-hover:animate-pulse"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-text-primary">Setor Sul</p>
              <p className="text-[10px] text-text-secondary">Anomalia de Microclima</p>
            </div>
            <span className="material-symbols-outlined text-text-secondary text-[16px] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapWidget;