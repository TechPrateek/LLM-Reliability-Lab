import React, { useState } from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { 
  X, 
  Key, 
  Check, 
  Trash2, 
  ExternalLink, 
  ShieldAlert, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useBenchmark();
  const [keyValue, setKeyValue] = useState<string>(apiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyValue.trim());
    onClose();
  };

  const handleClear = () => {
    setKeyValue('');
    setApiKey('');
    setTestStatus('idle');
  };

  const handleTestKey = async () => {
    if (!keyValue.trim()) return;
    setTestStatus('testing');
    setErrorMessage('');

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyValue.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Ping test. Reply with word PONG.' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        }
      );

      if (res.ok) {
        setTestStatus('success');
      } else {
        const data = await res.json();
        setTestStatus('failed');
        setErrorMessage(data?.error?.message || `API error (${res.status})`);
      }
    } catch (err: any) {
      setTestStatus('failed');
      setErrorMessage(err.message || 'Network connection failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              Configure Live LLM Engine
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-blue-200">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Zero-Barrier Testing Available!</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-300/80">
              You can explore all benchmark suites, radar graphs, and stress tests immediately using our pre-recorded high-fidelity simulation engine without entering any API key.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-300 font-medium">
              Google Gemini API Key (For Live Queries & Real Red-Teaming)
            </label>
            <div className="relative">
              <input
                type="password"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Keys are saved strictly to your local browser storage.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Test Status Indicator */}
          {testStatus === 'success' && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 font-mono text-[11px]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>API Key validated! Live Gemini calls active.</span>
            </div>
          )}

          {testStatus === 'failed' && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2 font-mono text-[11px]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Validation failed: {errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            {apiKey ? (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect Key</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestKey}
                disabled={!keyValue.trim() || testStatus === 'testing'}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Key</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
