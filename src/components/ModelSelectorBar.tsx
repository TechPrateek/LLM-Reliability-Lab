import React from 'react';
import { useBenchmark } from '../context/BenchmarkContext';
import { Check, Zap, DollarSign, Cpu } from 'lucide-react';

export const ModelSelectorBar: React.FC = () => {
  const { models, selectedModelIds, toggleModelSelection } = useBenchmark();

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Select Competing Models</span>
            <span className="text-[11px] font-normal text-slate-400">
              (Choose 2 to 3 models for side-by-side evaluation)
            </span>
          </h3>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Active Arena Slots: <strong className="text-white">{selectedModelIds.length}</strong>/3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {models.map((model) => {
          const isSelected = selectedModelIds.includes(model.id);

          return (
            <div
              key={model.id}
              onClick={() => toggleModelSelection(model.id)}
              className={`relative cursor-pointer rounded-xl p-3 border transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-slate-800/90 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Checkbox indicator */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{model.avatar}</span>
                  <div>
                    <h4 className="font-semibold text-xs text-white leading-tight">
                      {model.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {model.provider}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{model.avgLatencyMs}ms</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>${model.inputCostPer1M}/M</span>
                </div>
              </div>

              {/* Bottom MRI score pill */}
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">MRI™ Baseline</span>
                <span className="font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {model.reliabilityScore}/100
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
