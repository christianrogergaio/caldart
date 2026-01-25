import React from 'react';

const KpiSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: GDD */}
      <div className="card-gradient border border-border-light rounded-2xl p-6 shadow-executive relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Graus-Dia Acumulados</p>
            <h3 className="text-3xl font-black text-text-primary mt-1">842.5 <span className="text-sm font-normal text-text-secondary uppercase">GDD</span></h3>
          </div>
          <div className="bg-sage/10 p-2 rounded-xl">
            <span className="material-symbols-outlined text-sage">thermostat_auto</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-text-secondary">Progresso da Safra</span>
            <span className="text-sage">72%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div className="bg-sage h-full w-[72%] rounded-full shadow-[0_0_8px_rgba(82,183,136,0.4)]"></div>
          </div>
          <p className="text-[10px] text-text-secondary italic">Estágio atual: R1 (Início do Florescimento)</p>
        </div>
      </div>

      {/* Card 2: Spray Window */}
      <div className="card-gradient border border-border-light rounded-2xl p-6 shadow-executive">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Janela de Pulverização</p>
            <h3 className="text-xl font-bold text-sage mt-1">Favorável Agora</h3>
          </div>
          <div className="bg-sage/10 p-2 rounded-xl">
            <span className="material-symbols-outlined text-sage">air</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary uppercase font-bold">Vento</span>
            <span className="text-sm font-bold">6.2 km/h</span>
          </div>
          <div className="h-6 w-px bg-border-light"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary uppercase font-bold">Umidade</span>
            <span className="text-sm font-bold">65%</span>
          </div>
          <div className="h-6 w-px bg-border-light"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary uppercase font-bold">Delta T</span>
            <span className="text-sm font-bold">4.8</span>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-text-secondary flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">info</span> Próxima janela ideal: amanhã 05:00
        </p>
      </div>

      {/* Card 3: DHT22 Status */}
      <div className="card-gradient border border-border-light rounded-2xl p-6 shadow-executive">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">DHT22 Status</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-bold text-text-primary">28.4°C</h3>
              <div className="bg-sage/10 text-sage text-[10px] px-1.5 rounded font-bold">+0.4</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="relative flex h-2 w-2 mb-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
            </span>
            <span className="text-[9px] text-text-secondary font-bold uppercase">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] text-text-secondary"><span>Variação 1h</span></div>
            <div className="h-8 flex items-end gap-[2px]">
              <div className="w-full bg-sage-light h-[40%] rounded-t-sm"></div>
              <div className="w-full bg-sage-light h-[55%] rounded-t-sm"></div>
              <div className="w-full bg-sage-light h-[45%] rounded-t-sm"></div>
              <div className="w-full bg-sage h-[70%] rounded-t-sm"></div>
              <div className="w-full bg-sage h-[85%] rounded-t-sm"></div>
              <div className="w-full bg-sage h-[60%] rounded-t-sm"></div>
              <div className="w-full bg-sage h-[75%] rounded-t-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Pathogens */}
      <div className="card-gradient border border-border-light rounded-2xl p-6 shadow-executive">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Pressão Patógenos</p>
            <h3 className="text-2xl font-bold text-coral-muted mt-1">18% <span className="text-xs font-medium text-text-secondary tracking-normal">Alerta</span></h3>
          </div>
          <div className="bg-coral-muted/10 p-2 rounded-xl">
            <span className="material-symbols-outlined text-coral-muted">query_stats</span>
          </div>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Probabilidade de <strong>Ferrugem Asiática</strong> subindo devido ao orvalho noturno.
        </p>
        <div className="mt-4 flex gap-1">
          <div className="h-1 flex-1 bg-sage rounded-full"></div>
          <div className="h-1 flex-1 bg-amber-muted rounded-full"></div>
          <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
          <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default KpiSection;