import React from 'react';
import { Thermometer, Droplets, CloudSun, CloudRain, Sun, Filter, Search, Tractor, FileText, MoreHorizontal } from 'lucide-react';
import { RegistryItem } from '../../types';

const DetailedRegistryTable: React.FC = () => {
  const tableData: RegistryItem[] = [
    {
      id: '1',
      dateTime: '12/10/23 14:00',
      temp: 24,
      humidity: 60,
      weather: 'Nublado',
      risk: 'ALTO',
      intervention: 'Pulverização',
      hasAction: true,
    },
    {
      id: '2',
      dateTime: '12/10/23 10:00',
      temp: 21,
      humidity: 55,
      weather: 'Ensolarado',
      risk: 'BAIXO',
      intervention: null,
      hasAction: true,
    },
    {
      id: '3',
      dateTime: '11/10/23 18:00',
      temp: 19,
      humidity: 70,
      weather: 'Chuva Leve',
      risk: 'MÉDIO',
      intervention: 'Nota de Campo',
      hasAction: true,
    },
  ];

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'Nublado': return <CloudSun size={18} className="text-slate-400" />;
      case 'Ensolarado': return <Sun size={18} className="text-amber-500" />;
      case 'Chuva Leve': return <CloudRain size={18} className="text-blue-400" />;
      default: return <Sun size={18} />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const styles = {
      'ALTO': 'bg-red-50 text-red-600 border-red-100',
      'BAIXO': 'bg-green-50 text-green-600 border-green-100',
      'MÉDIO': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    };
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold border ${styles[risk as keyof typeof styles]}`}>
        {risk}
      </span>
    );
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900">Registro Detalhado</h3>
        <div className="flex gap-2">
          <button className="p-1.5 rounded hover:bg-slate-50 text-slate-500 transition-colors">
            <Filter size={18} />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-50 text-slate-500 transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data / Hora</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Temp / Hum (DHT22)</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Previsão Web</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risco Calc.</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Intervenções</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tableData.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-4 font-mono text-slate-600 text-xs">{row.dateTime}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Thermometer size={14} className="text-orange-500" />
                      {row.temp}°C
                    </div>
                    <div className="w-px h-3 bg-slate-200"></div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Droplets size={14} className="text-blue-500" />
                      {row.humidity}%
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    {getWeatherIcon(row.weather)}
                    <span>{row.weather}</span>
                  </div>
                </td>
                <td className="px-5 py-4">{getRiskBadge(row.risk)}</td>
                <td className="px-5 py-4">
                    {row.intervention ? (
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                            {row.intervention === 'Pulverização' ? <Tractor size={16} className="text-slate-400"/> : <FileText size={16} className="text-slate-400"/>}
                            {row.intervention}
                        </div>
                    ) : (
                        <span className="text-slate-400 italic text-xs">Nenhuma ação</span>
                    )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-green-600 hover:text-green-700 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs text-slate-500">
        <span>Mostrando 1-3 de 148 registros</span>
        <div className="flex gap-2">
          <button className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 shadow-sm disabled:opacity-50">Anterior</button>
          <button className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 shadow-sm">Próximo</button>
        </div>
      </div>
    </section>
  );
};

export default DetailedRegistryTable;