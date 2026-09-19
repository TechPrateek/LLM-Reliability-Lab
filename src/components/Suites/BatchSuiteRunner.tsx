import React, { useState } from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Filter,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TEST_CATEGORIES } from '../../data/testSuites';

interface BatchSuiteRunnerProps {
  onSwitchToArena?: () => void;
}

export const BatchSuiteRunner: React.FC<BatchSuiteRunnerProps> = ({ onSwitchToArena }) => {
  const { 
    models, 
    selectedModelIds, 
    testCases, 
    runBatchSuite, 
    batchProgress, 
    isEvaluating,
    benchmarkHistory,
    setCurrentTestCase,
    runActiveBenchmark
  } = useBenchmark();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [runningRowId, setRunningRowId] = useState<string | null>(null);

  const selectedModels = models.filter(m => selectedModelIds.includes(m.id));

  const filteredTests = selectedCategory === 'all'
    ? testCases
    : testCases.filter(t => t.category === selectedCategory);

  const handleRunBatch = () => {
    runBatchSuite(selectedCategory);
  };

  const handleRunSingleTest = async (test: typeof testCases[0]) => {
    setRunningRowId(test.id);
    setCurrentTestCase(test);
    await runActiveBenchmark(test.prompt);
    setRunningRowId(null);
  };

  const progressPercent = batchProgress.total > 0 
    ? Math.round((batchProgress.current / batchProgress.total) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                Continuous Reliability CI
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 font-mono">Automated Red-Teaming Matrix</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Automated Stress-Testing Suite
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Execute battery testing across all hallucination traps, jailbreaks, and schema constraint vectors. Evaluates pass rates, vulnerability exposure, and latency profiles across your selected models simultaneously.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleRunBatch}
              disabled={isEvaluating}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
                isEvaluating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-indigo-500/25 ring-1 ring-white/20'
              }`}
            >
              {isEvaluating && batchProgress.isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running ({batchProgress.current}/{batchProgress.total})...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Full Battery ({filteredTests.length} Tests)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar (if running or completed) */}
        {batchProgress.isRunning && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Test #{batchProgress.current} of {batchProgress.total}</span>
              </span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono mr-1">
          <Filter className="w-3 h-3" />
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
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Test Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white tracking-tight">
            Stress Test Evaluation Matrix
          </h3>
          <div className="text-xs text-slate-400 font-mono">
            Evaluating: <strong className="text-blue-400">{selectedModels.map(m => m.name).join(', ')}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/60 font-mono text-[11px] text-slate-400">
                <th className="py-2.5 px-3.5">Test Vector</th>
                <th className="py-2.5 px-3.5">Trap Classification</th>
                <th className="py-2.5 px-3.5">Difficulty</th>
                {selectedModels.map(model => (
                  <th key={model.id} className="py-2.5 px-3.5 text-center">
                    <span className="font-semibold text-slate-200">{model.name}</span>
                  </th>
                ))}
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTests.map((test) => {
                const testSession = benchmarkHistory.find(s => s.testCase.id === test.id);
                const isThisRowRunning = runningRowId === test.id;

                return (
                  <tr key={test.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3.5">
                      <div className="font-medium text-white">{test.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {test.description}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 font-mono text-slate-300 text-[11px]">
                      {test.trapType}
                    </td>
                    <td className="py-3 px-3.5">
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
                          <td key={model.id} className="py-3 px-3.5 text-center font-mono text-slate-500">
                            --
                          </td>
                        );
                      }

                      return (
                        <td key={model.id} className="py-3 px-3.5 text-center">
                          {res.status === 'passed' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{res.score}%</span>
                            </span>
                          ) : res.status === 'vulnerable' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse">
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

                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => handleRunSingleTest(test)}
                        disabled={isEvaluating}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-medium transition border border-slate-700 flex items-center gap-1 ml-auto"
                      >
                        {isThisRowRunning ? (
                          <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                        ) : (
                          <Play className="w-2.5 h-2.5 fill-current" />
                        )}
                        <span>Run</span>
                      </button>
                    </td>
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
