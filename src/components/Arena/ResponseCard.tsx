import React, { useState } from 'react';
import { LLMModel, ModelRunResult } from '../../types/benchmark';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Zap, 
  DollarSign, 
  Cpu, 
  Shield, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

interface ResponseCardProps {
  model: LLMModel;
  result?: ModelRunResult;
  streamingText?: string;
  isEvaluating: boolean;
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
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Generating & Evaluating...</span>
        </span>
      );
    }

    if (!result) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
          Ready for Prompt
        </span>
      );
    }

    switch (result.status) {
      case 'passed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PASSED ({result.score}/100)</span>
          </span>
        );
      case 'vulnerable':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse">
            <XCircle className="w-3.5 h-3.5" />
            <span>VULNERABLE ({result.score}/100)</span>
          </span>
        );
      case 'hallucinated':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>HALLUCINATED ({result.score}/100)</span>
          </span>
        );
      case 'schema_error':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SCHEMA ERROR ({result.score}/100)</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
            INCONCLUSIVE
          </span>
        );
    }
  };

  // Separate think block if present (e.g. DeepSeek R1)
  let cleanText = displayText;
  let thinkText = '';
  if (displayText.includes('<think>') && displayText.includes('</think>')) {
    const parts = displayText.split('</think>');
    thinkText = parts[0].replace('<think>', '').trim();
    cleanText = parts[1].trim();
  }

  return (
    <div className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm transition-all duration-300 h-full">
      
      {/* Model Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-xl shadow-inner">
            {model.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                {model.name}
              </h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium border ${model.badgeColor}`}>
                {model.provider}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {model.architecture}
            </p>
          </div>
        </div>

        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 grid grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-400" />
          <span>TTFT: <strong className="text-slate-200">{result ? `${result.ttftMs}ms` : '--'}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Lat: <strong className="text-slate-200">{result ? `${result.latencyMs}ms` : '--'}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-purple-400" />
          <span>Tok: <strong className="text-slate-200">{result ? result.outputTokens : '--'}</strong></span>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <DollarSign className="w-3 h-3 text-emerald-400" />
          <span>Cost: <strong className="text-slate-200">{result ? `$${result.costUsd.toFixed(6)}` : '--'}</strong></span>
        </div>
      </div>

      {/* Diagnostic Findings */}
      {result && result.findings.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/40 space-y-1">
          {result.findings.map((f, idx) => (
            <div 
              key={idx} 
              className={`text-xs flex items-start gap-1.5 ${
                f.includes('Critical') || f.includes('Failure') || f.includes('Violation')
                  ? 'text-red-400' 
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
      <div className="p-4 flex-1 overflow-y-auto max-h-[440px] text-xs text-slate-200 leading-relaxed font-sans space-y-3">
        
        {/* Thought Process Dropdown (DeepSeek R1 style) */}
        {thinkText && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="w-full px-3 py-2 text-left text-[11px] font-mono text-purple-400 flex items-center justify-between hover:bg-slate-900/50"
            >
              <span>💭 Internal Reasoning Trace (Chain-of-Thought)</span>
              {showThinking ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showThinking && (
              <div className="p-3 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 bg-slate-950 whitespace-pre-wrap">
                {thinkText}
              </div>
            )}
          </div>
        )}

        {/* Generated Text */}
        {cleanText ? (
          <div className="whitespace-pre-wrap font-sans text-slate-200">
            {cleanText}
          </div>
        ) : isEvaluating ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <p className="font-mono text-xs">Streaming model tokens...</p>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-slate-600 text-center">
            <Shield className="w-8 h-8 mb-2 opacity-30" />
            <p>Click "Run Arena Benchmark" to evaluate this model.</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>Context: {model.contextWindow}</span>
        </div>

        {cleanText && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>

    </div>
  );
};
