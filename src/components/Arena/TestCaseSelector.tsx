import React from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { 
  EyeOff, 
  ShieldAlert, 
  Code2, 
  BrainCircuit, 
  HelpCircle,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TestCase } from '../../types/benchmark';

export const TestCaseSelector: React.FC = () => {
  const { testCases, currentTestCase, setCurrentTestCase, isEvaluating } = useBenchmark();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hallucination': return <EyeOff className="w-3.5 h-3.5 text-rose-400" />;
      case 'jailbreak': return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
      case 'schema': return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'reasoning': return <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />;
      default: return <HelpCircle className="w-3.5 h-3.5 text-blue-400" />;
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
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">
            Pre-Configured Stress Traps
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {testCases.length} Test Vectors Ready
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {testCases.map((test) => {
          const isActive = currentTestCase.id === test.id;
          return (
            <button
              key={test.id}
              disabled={isEvaluating}
              onClick={() => setCurrentTestCase(test)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl text-left border text-xs transition-all ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
              } ${isEvaluating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="p-1 rounded-md bg-slate-900 border border-slate-800">
                {getCategoryIcon(test.category)}
              </div>
              <div>
                <div className="font-medium tracking-tight whitespace-nowrap">
                  {test.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {test.trapType}
                  </span>
                  <span className={`text-[9px] px-1 py-0.2 rounded border font-mono ${getDifficultyBadge(test.difficulty)}`}>
                    {test.difficulty}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active test case contextual info box */}
      <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{currentTestCase.title}</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-400 font-mono text-[11px]">{currentTestCase.trapType}</span>
          </div>
          <p className="text-slate-400 text-xs">
            {currentTestCase.description}
          </p>
        </div>

        <div className="flex-shrink-0 md:border-l md:border-slate-800 md:pl-4 space-y-1">
          <div className="text-[10px] uppercase font-semibold text-slate-500">
            Ground Truth Assertion
          </div>
          <div className="text-emerald-400/90 text-xs max-w-sm">
            {currentTestCase.groundTruth}
          </div>
        </div>
      </div>
    </div>
  );
};
