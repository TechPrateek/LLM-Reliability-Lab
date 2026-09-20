import React, { useState } from 'react';
import { BenchmarkProvider } from './context/BenchmarkContext';
import { Navbar } from './components/Navbar';
import { ModelBattleArena } from './components/Arena/ModelBattleArena';
import { BatchSuiteRunner } from './components/Suites/BatchSuiteRunner';
import { ReliabilityDashboard } from './components/Analytics/ReliabilityDashboard';
import { ApiKeyModal } from './components/Modals/ApiKeyModal';
import { CustomBenchmarkModal } from './components/Modals/CustomBenchmarkModal';
import { NutritionLabelModal } from './components/Modals/NutritionLabelModal';
import { ShieldCheck, Heart, Sparkles, ExternalLink, Cpu } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'arena' | 'batch' | 'dashboard'>('arena');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isCustomTestModalOpen, setIsCustomTestModalOpen] = useState<boolean>(false);
  const [isNutritionLabelModalOpen, setIsNutritionLabelModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white bg-grid-pattern">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenCustomTestModal={() => setIsCustomTestModalOpen(true)}
        onOpenNutritionLabelModal={() => setIsNutritionLabelModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'arena' && <ModelBattleArena />}
        {activeTab === 'batch' && <BatchSuiteRunner />}
        {activeTab === 'dashboard' && (
          <ReliabilityDashboard
            onOpenNutritionLabelModal={() => setIsNutritionLabelModalOpen(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <CustomBenchmarkModal
        isOpen={isCustomTestModalOpen}
        onClose={() => setIsCustomTestModalOpen(false)}
        onCreated={() => setActiveTab('arena')}
      />

      <NutritionLabelModal
        isOpen={isNutritionLabelModalOpen}
        onClose={() => setIsNutritionLabelModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-400">LLM Reliability Lab</span>
            <span>• Open Innovation Project • Hack Devengers 2.0</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsNutritionLabelModalOpen(true)}
              className="hover:text-white transition"
            >
              Nutrition Label
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('batch')}
              className="hover:text-white transition"
            >
              Stress Battery
            </button>
            <span>•</span>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="hover:text-white transition"
            >
              Gemini API
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <BenchmarkProvider>
      <AppContent />
    </BenchmarkProvider>
  );
}
