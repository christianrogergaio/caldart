import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-20 lg:w-72 flex-shrink-0 flex flex-col bg-white border-r border-border-light z-30 shadow-sm h-full">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-border-light">
          <div className="flex items-center gap-3">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-xl size-10 border border-border-light shadow-sm" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAT85F7FK09URnVe_O7jeFwiT7P4IAtY-gPqUMa5vgwX70MUhH1XMoy1NZO8AtKJ8xKMLHYCJiJBqgju0KSF2_VdYjmMCn71_-xZ5IpTJh3ydB4ZIx3vGXUoKG8GWH6G_GDVoV3ck88-sLQLiltGZDJJuRK0MW7EAjMxuTomV038Ct9W34umP81kYu8xgUgeZeeXTU8TnMc3vfzFc-KkD1ArNJ1GHt5NeojF0ITsPpKw7xoPMWcYutu55KkEYVsE8ziCBqRp_zvhWI")' }}
            ></div>
            <div className="hidden lg:block">
              <h1 className="text-text-primary text-sm font-extrabold tracking-tight uppercase">AgroIntelligence</h1>
              <p className="text-text-secondary text-[10px] font-medium tracking-widest">ADVANCED ANALYTICS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-text-secondary uppercase px-3 mb-2 tracking-wider">Módulos</p>
          
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-slate-50 transition-all group">
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <p className="text-sm font-medium hidden lg:block">Overview</p>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sage/10 text-sage border-r-2 border-sage transition-all">
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <p className="text-sm font-bold hidden lg:block">Command Center</p>
          </a>

          <div className="mt-8">
            <p className="text-[10px] font-bold text-text-secondary uppercase px-3 mb-2 tracking-wider">Deep Insights</p>
            <div className="space-y-4 px-3 py-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-secondary">Eficiência GDD</span>
                  <span className="text-sage font-bold">94%</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-sage h-full w-[94%]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-secondary">Risco Biológico</span>
                  <span className="text-amber-muted font-bold">Médio</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-muted h-full w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer / Profile */}
        <div className="p-4 border-t border-border-light">
          <div className="hidden lg:block bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold text-text-primary mb-1">Próxima Safra</p>
            <p className="text-[11px] text-text-secondary">Estimativa: 12 de Jan</p>
          </div>
          <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-coral-muted transition-colors">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <p className="text-sm font-medium hidden lg:block">Sair do Sistema</p>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;