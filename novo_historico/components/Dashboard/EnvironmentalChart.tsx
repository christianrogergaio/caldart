import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { time: '06:00', temp: 18, humidity: 85 },
  { time: '08:00', temp: 20, humidity: 80 },
  { time: '10:00', temp: 22, humidity: 75 },
  { time: '12:00', temp: 25, humidity: 60, intervention: true, type: 'Pulverização' },
  { time: '14:00', temp: 28, humidity: 55 },
  { time: '16:00', temp: 27, humidity: 58 },
  { time: '18:00', temp: 24, humidity: 65, intervention: true, type: 'Adubação' },
  { time: '20:00', temp: 21, humidity: 75 },
  { time: '22:00', temp: 19, humidity: 80 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg text-xs">
        <p className="font-bold text-slate-700 mb-2">{label}</p>
        <p className="text-green-600 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Temp: {payload[0].value}°C
        </p>
        <p className="text-blue-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-blue-400 inline-block"></span>
          Humidade: {payload[1].value}%
        </p>
        {payload[0].payload.intervention && (
            <div className="mt-2 pt-2 border-t border-slate-100 text-slate-500 italic">
                {payload[0].payload.type}
            </div>
        )}
      </div>
    );
  }
  return null;
};

const EnvironmentalChart: React.FC = () => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[340px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="text-green-500" size={18} />
          Análise Ambiental vs. Intervenções
        </h3>
        <div className="flex items-center gap-5 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-green-500 rounded-full"></span>
            <span className="text-slate-500">Temperatura (°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-100 border border-blue-400 rounded-sm"></span>
            <span className="text-slate-500">Umidade (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border border-dashed border-slate-400 bg-white"></span>
            <span className="text-slate-500">Intervenção</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
            />
            <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                domain={[0, 40]}
                unit="°C"
            />
            <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                domain={[0, 100]}
                unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="humidity" 
                stroke="#60a5fa" 
                fillOpacity={1} 
                fill="url(#colorHum)" 
                strokeWidth={2}
            />
            <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="temp" 
                stroke="#22c55e" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
            />
            
            {/* Custom dots for interventions */}
            {data.map((entry, index) => {
                if (entry.intervention) {
                    return (
                        <ReferenceDot
                            key={index}
                            yAxisId="left"
                            x={entry.time}
                            y={entry.temp}
                            r={4}
                            fill="#1e293b"
                            stroke="white"
                            strokeWidth={2}
                        />
                    )
                }
                return null;
            })}

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default EnvironmentalChart;