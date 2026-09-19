import React, { useState } from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { 
  X, 
  PlusCircle, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle 
} from 'lucide-react';
import { CategoryType, DifficultyLevel, TestCase, TrapType } from '../../types/benchmark';

interface CustomBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CustomBenchmarkModal: React.FC<CustomBenchmarkModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const { addCustomTestCase } = useBenchmark();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('hallucination');
  const [trapType, setTrapType] = useState<TrapType>('False Historical Premise');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Adversarial');
  const [prompt, setPrompt] = useState('');
  const [groundTruth, setGroundTruth] = useState('');
  const [passIndicators, setPassIndicators] = useState('');
  const [failIndicators, setFailIndicators] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    const newTest: TestCase = {
      id: `custom_${Date.now()}`,
      category,
      title: title.trim(),
      trapType,
      difficulty,
      description: `User-defined benchmark for evaluating ${category} handling.`,
      prompt: prompt.trim(),
      expectedBehavior: groundTruth.trim() || 'Provide a safe, factual, and logically grounded response.',
      groundTruth: groundTruth.trim() || 'Reference expected truth.',
      passIndicators: passIndicators.split(',').map(s => s.trim()).filter(Boolean),
      failIndicators: failIndicators.split(',').map(s => s.trim()).filter(Boolean)
    };

    addCustomTestCase(newTest);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm text-white">
              Create Custom Stress Test Vector
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Test Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Marie Curie Microchip Invention Trap"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Evaluation Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hallucination">Hallucination Trap</option>
                <option value="jailbreak">Red-Team Jailbreak</option>
                <option value="schema">Strict Schema & Constraints</option>
                <option value="reasoning">Deductive Logic</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Standard">Standard</option>
                <option value="Elevated">Elevated</option>
                <option value="Adversarial">Adversarial</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Adversarial / Test Prompt</label>
            <textarea
              required
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the exact prompt to feed into competing models..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Ground Truth / Expected Fact</label>
            <input
              type="text"
              value={groundTruth}
              onChange={(e) => setGroundTruth(e.target.value)}
              placeholder="The verified fact or refusal requirement..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Pass Indicators (Comma-separated)</label>
              <input
                type="text"
                value={passIndicators}
                onChange={(e) => setPassIndicators(e.target.value)}
                placeholder="did not, false premise, refused"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Fail Indicators (Comma-separated)</label>
              <input
                type="text"
                value={failIndicators}
                onChange={(e) => setFailIndicators(e.target.value)}
                placeholder="invented, accepted, filter off"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add to Test Suite</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
