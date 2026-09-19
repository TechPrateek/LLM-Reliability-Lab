import React from 'react';
import { useBenchmark } from '../context/BenchmarkContext';
import { Check, Zap, DollarSign, Cpu } from 'lucide-react';

export const ModelSelectorBar: React.FC = () => {
  const { models, selectedModelIds, toggleModelSelection } = useBenchmark();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>Active Models:</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          (Select 2 to 3 to compare)
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {models.map((model) => {
          const isSelected = selectedModelIds.includes(model.id);

          return (
            <button
              key={model.id}
              onClick={() => toggleModelSelection(model.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 select-none ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span className="text-sm">{model.avatar}</span>
              <span className="font-semibold">{model.name}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                ${model.inputCostPer1M}/M
              </span>
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 ml-auto sm:ml-0">
        <span className={`w-2 h-2 rounded-full ${selectedModelIds.length >= 2 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <span>{selectedModelIds.length}/3 Selected</span>
      </div>
    </div>
  );
};
