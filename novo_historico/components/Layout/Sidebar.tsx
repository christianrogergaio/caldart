import React from 'react';
import { LayoutDashboard, Database, Sprout, Wifi, Settings, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-center', label: 'Centro de Dados', icon: Database },
    { id: 'culturas', label: 'Culturas', icon: Sprout },
    { id: 'sensores', label: 'Sensores', icon: Wifi },
    { id: 'config', label: 'Configurações', icon: Settings },
  ];

  return (
    <nav className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 z-20">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-700 to-green-500 flex items-center justify-center text-white font-bold shadow-sm">
          <Sprout size={20} />
        </div>
        <div className="leading-tight">
          <h1 className="font-bold text-slate-900 text-base">AgroTech Solutions</h1>
          <span className="text-xs text-slate-500 font-medium">Admin Console</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-green-50 text-green-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon
                size={20}
                className={isActive ? 'text-green-600' : 'text-slate-400'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-xs border border-green-200">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">João da Silva</p>
            <p className="text-xs text-slate-500 truncate">Gerente Agrônomo</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;