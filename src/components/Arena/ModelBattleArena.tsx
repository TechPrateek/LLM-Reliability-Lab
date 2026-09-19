import React, { useState, useEffect } from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { ModelSelectorBar } from '../ModelSelectorBar';
import { TestCaseSelector } from './TestCaseSelector';
import { ResponseCard } from './ResponseCard';
import { 
  Play, 
  RotateCcw, 
  Split, 
  Sparkles, 
  CornerDownLeft,
  Terminal,
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ModelBattleArena: React.FC = () => {
  const { 
    models, 
    selectedModelIds, 
    currentTestCase, 
    activeResults, 
    streamingOutputs, 
    isEvaluating, 
    runActiveBenchmark 
  } = useBenchmark();

  const [promptInput, setPromptInput] = useState<string>(currentTestCase.prompt);
  const [showDiffView, setShowDiffView] = useState<boolean>(false);

  // Sync prompt input when test case changes
  useEffect(() => {
    setPromptInput(currentTestCase.prompt);
  }, [currentTestCase]);

  // Support Ctrl+Enter / Cmd+Enter keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isEvaluating && promptInput.trim()) {
          e.preventDefault();
          handleRunBenchmark();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEvaluating, promptInput]);

  const handleRunBenchmark = async () => {
    if (isEvaluating || !promptInput.trim()) return;
    await runActiveBenchmark(promptInput);

    // Trigger celebratory confetti on pass
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#8b5cf6']
    });
  };

  const handleResetPrompt = () => {
    setPromptInput(currentTestCase.prompt);
  };

  const selectedModels = models.filter(m => selectedModelIds.includes(m.id));

  return (
    <div className="space-y-4">
      
      {/* 1. Compact Model Selector Chips */}
      <ModelSelectorBar />

      {/* 2. Compact Benchmark Trap Vectors Bar */}
      <TestCaseSelector />

      {/* 3. Sleek Arena Prompt Bar & Command Console */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 backdrop-blur-md shadow-xl space-y-2.5">
        
        {/* Input Textarea with Integrated Actions */}
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            disabled={isEvaluating}
            rows={2}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 pr-24 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-sans transition resize-none leading-relaxed"
            placeholder="Type or edit an adversarial prompt, false premise trap, or reasoning query..."
          />
          
          <div className="absolute right-3 bottom-3 flex items-center gap-1 text-[10px] font-mono text-slate-500 select-none">
            <span>{promptInput.length} chars</span>
          </div>
        </div>

        {/* Command Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiffView(!showDiffView)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                showDiffView 
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/50' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Compare side-by-side textual diffs"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Diff View: {showDiffView ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={handleResetPrompt}
              disabled={isEvaluating}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="Reset prompt to test case default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
              Testing {selectedModels.length} models simultaneously
            </span>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isEvaluating || !promptInput.trim()}
            className={`px-5 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
              isEvaluating || !promptInput.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25 ring-1 ring-white/20 hover:scale-[1.01]'
            }`}
          >
            {isEvaluating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating Competing Models...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>Run Arena Benchmark</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20 text-white hidden sm:inline">
                  Ctrl+↵
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Diff View Inspection Panel (if toggled) */}
      {showDiffView && selectedModels.length >= 2 && (
        <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-xl space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <Split className="w-3.5 h-3.5" />
              <span>Comparative Strategy Diff: {selectedModels[0].name} vs {selectedModels[1].name}</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Automated Alignment Delta</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-blue-400 mb-1">{selectedModels[0].name}</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeResults[selectedModels[0].id]?.findings?.[0] || 'Awaiting evaluation result...'}
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-500">
                Score: {activeResults[selectedModels[0].id]?.score ?? '--'}% • Latency: {activeResults[selectedModels[0].id]?.latencyMs ?? '--'}ms
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-emerald-400 mb-1">{selectedModels[1].name}</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeResults[selectedModels[1].id]?.findings?.[0] || 'Awaiting evaluation result...'}
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-500">
                Score: {activeResults[selectedModels[1].id]?.score ?? '--'}% • Latency: {activeResults[selectedModels[1].id]?.latencyMs ?? '--'}ms
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Parallel Competing Models Arena Grid (Immediately Visible!) */}
      <div 
        className={`grid gap-4 ${
          selectedModels.length === 1 
            ? 'grid-cols-1 max-w-2xl mx-auto' 
            : selectedModels.length === 2 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {selectedModels.map((model) => (
          <ResponseCard
            key={model.id}
            model={model}
            result={activeResults[model.id]}
            streamingText={streamingOutputs[model.id]}
            isEvaluating={isEvaluating}
          />
        ))}
      </div>

    </div>
  );
};
