import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea
} from 'recharts';

const data = [
  { time: '06:00', temp: 18, humidity: 80, risk: 20 },
  { time: '09:00', temp: 22, humidity: 75, risk: 25 },
  { time: '12:00', temp: 28, humidity: 60, risk: 40 },
  { time: '14:00', temp: 29.2, humidity: 72, risk: 60 }, // Special point
  { time: '15:00', temp: 30, humidity: 55, risk: 35 },
  { time: '18:00', temp: 26, humidity: 65, risk: 30 },
  { time: '21:00', temp: 22, humidity: 85, risk: 50 },
  { time: '00:00', temp: 20, humidity: 90, risk: 70 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border-light p-3 rounded-xl shadow-xl z-50">
        <p className="text-[10px] font-bold text-text-secondary uppercase mb-2">Detalhes: {label}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs gap-4">
            <span className="text-text-secondary">Temp:</span>
            <span className="font-bold text-sage">{payload[0].value}°C</span>
          </div>
          <div className="flex justify-between items-center text-xs gap-4">
            <span className="text-text-secondary">Umidade:</span>
            <span className="font-bold text-slate-blue">{payload[1].value}%</span>
          </div>
          <div className="flex justify-between items-center text-xs text-coral-muted gap-4">
            <span className="font-bold">Risco:</span>
            <span className="font-bold">{payload[2].value > 50 ? 'ALTO' : 'BAIXO'}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const MainChart: React.FC = () => {
  return (
    <div className="lg:col-span-3 card-gradient border border-border-light rounded-2xl p-8 shadow-executive relative overflow-hidden h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Análise Comparativa Temporal</h3>
          <p className="text-sm text-text-secondary font-medium">Multi-layered: Temp, Umidade e Limites de Risco</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-border-light">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-white transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-sage"></span> Temperatura
          </label>
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-white transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-blue"></span> Umidade
          </label>
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-border-light/50 text-xs font-bold text-text-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-coral-muted/40"></span> Área de Risco
          </label>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E76F51" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#E76F51" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }}
              dy={10}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            {/* Risk Area (Simulated with Area) */}
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="none" 
              fill="url(#colorRisk)" 
            />

            {/* Temperature Line */}
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#52B788" 
              strokeWidth={3} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, strokeWidth: 4, stroke: '#D8F3DC' }}
            />

            {/* Humidity Line (Dashed) */}
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#64748B" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={{ r: 0 }}
              activeDot={{ r: 4, fill: '#64748B' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainChart;