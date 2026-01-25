import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiSection from './components/KpiSection';
import MainChart from './components/MainChart';
import HeatmapWidget from './components/HeatmapWidget';

const App: React.FC = () => {
  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-bg-main text-text-primary font-display">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto scroll-smooth bg-[#F8FAFC]">
        <Header />
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
          <KpiSection />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
            <MainChart />
            <HeatmapWidget />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;