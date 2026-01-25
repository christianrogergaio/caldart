import React, { useState } from 'react';
import { LayoutDashboard, Database, Sprout, Wifi, Settings, LogOut, ChevronDown, User, Bell } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import EnvironmentalChart from './components/Dashboard/EnvironmentalChart';
import DetailedRegistryTable from './components/Dashboard/DetailedRegistryTable';
import RightPanel from './components/Dashboard/RightPanel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('data-center');

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-800 font-sans bg-slate-50">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Center Column: Chart & Table */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            
            {/* Chart Section */}
            <EnvironmentalChart />

            {/* Table Section */}
            <DetailedRegistryTable />
            
          </main>

          {/* Right Column: Export & Logs */}
          <aside className="w-80 border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0 z-10 hidden xl:block shadow-sm">
            <RightPanel />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;