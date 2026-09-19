import React from 'react';
import { 
  ShieldCheck, 
  Key, 
  PlusCircle, 
  FileText, 
  Sparkles, 
  Play, 
  Activity
} from 'lucide-react';
import { useBenchmark } from '../context/BenchmarkContext';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  onOpenCustomTestModal: () => void;
  onOpenNutritionLabelModal: () => void;
  activeTab: 'arena' | 'batch' | 'dashboard';
  setActiveTab: (tab: 'arena' | 'batch' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApiKeyModal,
  onOpenCustomTestModal,
  onOpenNutritionLabelModal,
  activeTab,
  setActiveTab
}) => {
  const { apiKey } = useBenchmark();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                  LLM Reliability <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Lab</span>
                </span>
                <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase font-mono">
                  MRI™ 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden lg:block font-mono">
                AI Stress-Testing, Hallucination & Security Red-Teaming Arena
              </p>
            </div>
          </div>

          {/* Segmented Navigation Switcher */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800/90 shadow-inner">
            <button
              onClick={() => setActiveTab('arena')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'arena'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Battle Arena</span>
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'batch'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Stress Suites</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>MRI™ Analytics</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Live Engine Indicator Button */}
            <button 
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs hover:border-slate-700 transition"
              title="Click to toggle or configure API keys"
            >
              <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
              <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
                {apiKey ? 'Live Gemini' : 'Sim Replay'}
              </span>
            </button>

            <button
              onClick={onOpenApiKeyModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition text-xs flex items-center gap-1.5"
              title="Configure API Keys"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline text-xs">API Key</span>
            </button>

            <button
              onClick={onOpenCustomTestModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition text-xs flex items-center gap-1.5"
              title="Create Custom Benchmark"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline text-xs">New Trap</span>
            </button>

            <button
              onClick={onOpenNutritionLabelModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 ring-1 ring-white/20 transition"
              title="Generate Official Audit Label"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Report</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition hidden sm:flex"
              title="GitHub Repo"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>

        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('arena')}
            className={`text-xs font-medium py-1 px-3 rounded-lg ${
              activeTab === 'arena' ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-400'
            }`}
          >
            Battle Arena
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`text-xs font-medium py-1 px-3 rounded-lg ${
              activeTab === 'batch' ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-400'
            }`}
          >
            Stress Suites
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-xs font-medium py-1 px-3 rounded-lg ${
              activeTab === 'dashboard' ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-400'
            }`}
          >
            Analytics
          </button>
        </div>

      </div>
    </header>
  );
};
