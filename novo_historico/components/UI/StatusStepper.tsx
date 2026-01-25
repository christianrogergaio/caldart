import React from 'react';
import { Check } from 'lucide-react';

const StatusStepper: React.FC = () => {
  const steps = [
    { label: 'Germinação', status: 'completed', id: 1 },
    { label: 'Cresc. Vegetativo', status: 'active', id: 2 },
    { label: 'Floração', status: 'pending', id: 3 },
    { label: 'Maturação', status: 'pending', id: 4 },
  ];

  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompleted = step.status === 'completed';
        const isActive = step.status === 'active';

        return (
          <React.Fragment key={step.id}>
            <div className="relative flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-sm'
                    : isActive
                    ? 'bg-green-500 text-white ring-4 ring-green-100 shadow-md'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={`absolute -bottom-5 whitespace-nowrap text-[10px] font-semibold ${
                  isActive ? 'text-slate-800' : isCompleted ? 'text-green-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-2 min-w-[40px] ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StatusStepper;