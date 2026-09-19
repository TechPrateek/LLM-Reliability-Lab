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
  CheckCircle, 
  AlertOctagon, 
  Info,
  Layers,
  ArrowRight
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

  const handleRunBenchmark = async () => {
    await runActiveBenchmark(promptInput);

    // Trigger celebratory confetti if models passed
    confetti({
      particleCount: 40,
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
    <div className="space-y-6">
      
      {/* 1. Model Selector Header */}
      <ModelSelectorBar />

      {/* 2. Stress Test Vector Selector */}
      <TestCaseSelector />

      {/* 3. Interactive Arena Prompt Console */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Arena Prompt Console
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              (Live-editable test input)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiffView(!showDiffView)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                showDiffView 
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Compare side-by-side textual diffs"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Diff View: {showDiffView ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={handleResetPrompt}
              disabled={isEvaluating}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="Reset to test case default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            disabled={isEvaluating}
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-sans transition"
            placeholder="Enter an adversarial prompt, false premise trap, or reasoning query..."
          />
          <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-500">
            {promptInput.length} chars
          </div>
        </div>

        {/* Execute Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span>
              Runs simultaneous parallel evaluations across all <strong className="text-white">{selectedModelIds.length} active models</strong>.
            </span>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isEvaluating || !promptInput.trim()}
            className={`px-6 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
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
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Arena Benchmark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Diff View Inspection Panel (if toggled) */}
      {showDiffView && selectedModels.length >= 2 && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-2">
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
                Score: {activeResults[selectedModels[0].id]?.score ?? '--'}/100 • Latency: {activeResults[selectedModels[0].id]?.latencyMs ?? '--'}ms
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-emerald-400 mb-1">{selectedModels[1].name}</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeResults[selectedModels[1].id]?.findings?.[0] || 'Awaiting evaluation result...'}
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-500">
                Score: {activeResults[selectedModels[1].id]?.score ?? '--'}/100 • Latency: {activeResults[selectedModels[1].id]?.latencyMs ?? '--'}ms
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Parallel Competing Models Arena Grid */}
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
