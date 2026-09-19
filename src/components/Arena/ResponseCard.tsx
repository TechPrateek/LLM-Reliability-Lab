import React, { useState } from 'react';
import type { LLMModel, ModelRunResult } from '../../types/benchmark';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Zap, 
  DollarSign, 
  Cpu, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Terminal
} from 'lucide-react';

interface ResponseCardProps {
  model: LLMModel;
  result?: ModelRunResult;
  streamingText?: string;
  isEvaluating: boolean;
  onRunSingle?: () => void;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  model,
  result,
  streamingText,
  isEvaluating
}) => {
  const [copied, setCopied] = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  const displayText = streamingText !== undefined ? streamingText : result?.response || '';

  const handleCopy = () => {
    if (!displayText) return;
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (isEvaluating && !result) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Evaluating...</span>
        </span>
      );
    }

    if (!result) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700/60">
          Standby
        </span>
      );
    }

    switch (result.status) {
      case 'passed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>PASSED ({result.score}%)</span>
          </span>
        );
      case 'vulnerable':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/10 font-mono animate-pulse">
            <XCircle className="w-3 h-3" />
            <span>BREACH ({result.score}%)</span>
          </span>
        );
      case 'hallucinated':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-500/10 font-mono">
            <AlertTriangle className="w-3 h-3" />
            <span>HALLUCINATED ({result.score}%)</span>
          </span>
        );
      case 'schema_error':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/10 font-mono">
            <AlertTriangle className="w-3 h-3" />
            <span>SCHEMA ERROR ({result.score}%)</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300">
            INCONCLUSIVE
          </span>
        );
    }
  };

  // Extract <think> reasoning tags if present
  let cleanText = displayText;
  let thinkText = '';
  if (displayText.includes('<think>') && displayText.includes('</think>')) {
    const parts = displayText.split('</think>');
    thinkText = parts[0].replace('<think>', '').trim();
    cleanText = parts[1].trim();
  }

  return (
    <div className={`flex flex-col bg-slate-900/90 border rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-200 min-h-[460px] ${
      isEvaluating && !result 
        ? 'border-blue-500/60 ring-1 ring-blue-500/30' 
        : result?.status === 'vulnerable'
        ? 'border-red-500/50'
        : result?.status === 'hallucinated'
        ? 'border-rose-500/50'
        : 'border-slate-800/80 hover:border-slate-700'
    }`}>
      
      {/* Model Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-base shadow-inner">
            {model.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-white tracking-tight">
                {model.name}
              </h3>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium border ${model.badgeColor}`}>
                {model.provider}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {model.architecture}
            </p>
          </div>
        </div>

        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="px-3.5 py-2 bg-slate-950/40 border-b border-slate-800/60 grid grid-cols-4 gap-2 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1" title="Time to first token">
          <Clock className="w-3 h-3 text-blue-400" />
          <span>TTFT: <strong className="text-slate-200">{result ? `${result.ttftMs}ms` : '--'}</strong></span>
        </div>
        <div className="flex items-center gap-1" title="Total response latency">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Lat: <strong className="text-slate-200">{result ? `${result.latencyMs}ms` : '--'}</strong></span>
        </div>
        <div className="flex items-center gap-1" title="Output tokens generated">
          <Cpu className="w-3 h-3 text-purple-400" />
          <span>Tok: <strong className="text-slate-200">{result ? result.outputTokens : '--'}</strong></span>
        </div>
        <div className="flex items-center gap-1 justify-end" title="Calculated query cost in USD">
          <DollarSign className="w-3 h-3 text-emerald-400" />
          <span>Cost: <strong className="text-slate-200">{result ? `$${result.costUsd.toFixed(6)}` : '--'}</strong></span>
        </div>
      </div>

      {/* Diagnostic Findings */}
      {result && result.findings.length > 0 && (
        <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-800/40 space-y-1">
          {result.findings.map((f, idx) => (
            <div 
              key={idx} 
              className={`text-[11px] flex items-start gap-1.5 ${
                f.includes('Critical') || f.includes('Failure') || f.includes('Violation')
                  ? 'text-red-400 font-medium' 
                  : f.includes('Warning') || f.includes('Ambiguous')
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* Output Display Body */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[380px] text-xs text-slate-200 leading-relaxed space-y-3 font-sans">
        
        {/* Chain of thought trace block */}
        {thinkText && (
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 overflow-hidden">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="w-full px-3 py-1.5 text-left text-[11px] font-mono text-purple-300 flex items-center justify-between hover:bg-purple-900/30 transition"
            >
              <span>💭 Chain-of-Thought Reasoning Trace</span>
              {showThinking ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showThinking && (
              <div className="p-3 text-[11px] font-mono text-purple-200/80 border-t border-purple-500/20 bg-slate-950/90 whitespace-pre-wrap">
                {thinkText}
              </div>
            )}
          </div>
        )}

        {/* Text output */}
        {cleanText ? (
          <div className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed selection:bg-blue-600 selection:text-white">
            {cleanText}
          </div>
        ) : isEvaluating ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
            <p className="font-mono text-xs text-slate-400 animate-pulse">
              Streaming {model.name} tokens...
            </p>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
            <Terminal className="w-8 h-8 opacity-40 text-blue-400" />
            <p className="text-xs text-slate-400 font-medium">
              Ready for evaluation
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Press "Run Arena Benchmark" to test
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <span>{model.contextWindow}</span>
          <span>•</span>
          <span>${model.outputCostPer1M}/M Out</span>
        </div>

        {cleanText && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>

    </div>
  );
};
