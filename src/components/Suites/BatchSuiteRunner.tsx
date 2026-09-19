import React, { useState } from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Filter,
  Check
} from 'lucide-react';
import { TEST_CATEGORIES } from '../../data/testSuites';

export const BatchSuiteRunner: React.FC = () => {
  const { 
    models, 
    selectedModelIds, 
    testCases, 
    runBatchSuite, 
    batchProgress, 
    isEvaluating,
    benchmarkHistory 
  } = useBenchmark();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const selectedModels = models.filter(m => selectedModelIds.includes(m.id));

  const filteredTests = selectedCategory === 'all'
    ? testCases
    : testCases.filter(t => t.category === selectedCategory);

  const handleRunBatch = () => {
    runBatchSuite(selectedCategory);
  };

  const progressPercent = batchProgress.total > 0 
    ? Math.round((batchProgress.current / batchProgress.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                Continuous Reliability CI
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 font-mono">Automated Red-Teaming Matrix</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Automated Stress Test Suite
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Execute battery testing across all hallucination traps, jailbreaks, and schema constraint vectors. Evaluates pass rates, vulnerability exposure, and latency profiles across your selected models simultaneously.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleRunBatch}
              disabled={isEvaluating}
              className={`px-6 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
                isEvaluating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-indigo-500/25 ring-1 ring-white/20'
              }`}
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running Suite ({batchProgress.current}/{batchProgress.total})...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Full Battery ({filteredTests.length} Tests)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar (if running or completed) */}
        {batchProgress.isRunning && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Test #{batchProgress.current} of {batchProgress.total}</span>
              </span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {TEST_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            disabled={isEvaluating}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Test Matrix Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Model Evaluation Matrix
          </h3>
          <div className="text-xs text-slate-400 font-mono">
            Evaluating against: <strong className="text-blue-400">{selectedModels.map(m => m.name).join(', ')}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/50 font-mono text-[11px] text-slate-400">
                <th className="py-3 px-4">Test Vector</th>
                <th className="py-3 px-4">Trap Classification</th>
                <th className="py-3 px-4">Difficulty</th>
                {selectedModels.map(model => (
                  <th key={model.id} className="py-3 px-4 text-center">
                    <span className="font-semibold text-slate-200">{model.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTests.map((test) => {
                // Find most recent run for this test in history
                const testSession = benchmarkHistory.find(s => s.testCase.id === test.id);

                return (
                  <tr key={test.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{test.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {test.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                      {test.trapType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        test.difficulty === 'Extreme'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : test.difficulty === 'Adversarial'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}>
                        {test.difficulty}
                      </span>
                    </td>

                    {/* Results per model */}
                    {selectedModels.map(model => {
                      const res = testSession?.results[model.id];

                      if (!res) {
                        return (
                          <td key={model.id} className="py-3.5 px-4 text-center font-mono text-slate-500">
                            --
                          </td>
                        );
                      }

                      return (
                        <td key={model.id} className="py-3.5 px-4 text-center">
                          {res.status === 'passed' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{res.score}%</span>
                            </span>
                          ) : res.status === 'vulnerable' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/30">
                              <XCircle className="w-3 h-3" />
                              <span>BREACH</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{res.status === 'hallucinated' ? 'HALLUC' : 'SCHEMA'}</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
