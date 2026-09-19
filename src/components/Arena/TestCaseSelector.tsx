import React, { useState } from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { 
  Flame,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  EyeOff,
  Code2,
  BrainCircuit,
  CheckCircle2
} from 'lucide-react';

export const TestCaseSelector: React.FC = () => {
  const { testCases, currentTestCase, setCurrentTestCase, isEvaluating } = useBenchmark();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const getCategoryDot = (category: string) => {
    switch (category) {
      case 'hallucination': return 'bg-rose-500';
      case 'jailbreak': return 'bg-amber-500';
      case 'schema': return 'bg-cyan-500';
      case 'reasoning': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Extreme': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Adversarial': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Elevated': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md">
      {/* Top Bar with title and Inspector Toggle */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Benchmark Traps:</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ({testCases.length} Vectors)
          </span>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-0.5 rounded-lg hover:bg-blue-500/10 transition"
        >
          <Info className="w-3 h-3" />
          <span>{showDetails ? 'Hide Trap Details' : 'View Ground Truth & Trap Info'}</span>
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Horizontal Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {testCases.map((test) => {
          const isActive = currentTestCase.id === test.id;
          return (
            <button
              key={test.id}
              disabled={isEvaluating}
              onClick={() => setCurrentTestCase(test)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all select-none border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/30 font-medium'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-900'
              } ${isEvaluating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`w-2 h-2 rounded-full ${getCategoryDot(test.category)}`} />
              <span>{test.title}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isActive ? 'bg-white/20 text-white' : getDifficultyBadge(test.difficulty)}`}>
                {test.difficulty}
              </span>
            </button>
          );
        })}
      </div>

      {/* Collapsible Trap Details Drawer */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-in fade-in duration-200">
          <div className="space-y-1 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{currentTestCase.title}</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400 font-mono text-[11px]">{currentTestCase.trapType}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {currentTestCase.description}
            </p>
          </div>

          <div className="space-y-1 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-semibold text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>Ground Truth Reference</span>
            </div>
            <p className="text-emerald-300/90 text-xs leading-relaxed">
              {currentTestCase.groundTruth}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
