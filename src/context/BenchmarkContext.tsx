import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LLMModel, 
  TestCase, 
  ModelRunResult, 
  BenchmarkSession, 
  ModelAggregatedMetrics 
} from '../types/benchmark';
import { BENCHMARK_MODELS, DEFAULT_MODEL_PAIR } from '../data/models';
import { TEST_CASES } from '../data/testSuites';
import { runModelBenchmark } from '../lib/llmService';

interface BenchmarkContextType {
  models: LLMModel[];
  selectedModelIds: string[];
  setSelectedModelIds: (ids: string[]) => void;
  toggleModelSelection: (modelId: string) => void;
  currentTestCase: TestCase;
  setCurrentTestCase: (testCase: TestCase) => void;
  testCases: TestCase[];
  addCustomTestCase: (testCase: TestCase) => void;
  activeResults: Record<string, ModelRunResult>;
  streamingOutputs: Record<string, string>;
  isEvaluating: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  runActiveBenchmark: (overridePrompt?: string) => Promise<void>;
  runBatchSuite: (category?: string) => Promise<void>;
  batchProgress: { current: number; total: number; isRunning: boolean };
  benchmarkHistory: BenchmarkSession[];
  aggregatedMetrics: Record<string, ModelAggregatedMetrics>;
  clearHistory: () => void;
}

const BenchmarkContext = createContext<BenchmarkContextType | undefined>(undefined);

export const BenchmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models] = useState<LLMModel[]>(BENCHMARK_MODELS);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(DEFAULT_MODEL_PAIR);
  const [testCases, setTestCases] = useState<TestCase[]>(TEST_CASES);
  const [currentTestCase, setCurrentTestCase] = useState<TestCase>(TEST_CASES[0]);
  const [activeResults, setActiveResults] = useState<Record<string, ModelRunResult>>({});
  const [streamingOutputs, setStreamingOutputs] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [apiKey, setApiKeyState] = useState<string>('');
  const [benchmarkHistory, setBenchmarkHistory] = useState<BenchmarkSession[]>([]);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; isRunning: boolean }>({
    current: 0,
    total: 0,
    isRunning: false
  });

  // Load API key and history from localStorage on initial mount
  useEffect(() => {
    const savedKey = localStorage.getItem('llm_reliability_api_key');
    if (savedKey) setApiKeyState(savedKey);

    const savedHistory = localStorage.getItem('llm_reliability_history');
    if (savedHistory) {
      try {
        setBenchmarkHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('llm_reliability_api_key', key);
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModelIds(prev => {
      if (prev.includes(modelId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(id => id !== modelId);
      } else {
        if (prev.length >= 3) return [...prev.slice(1), modelId]; // Max 3 side-by-side
        return [...prev, modelId];
      }
    });
  };

  const addCustomTestCase = (testCase: TestCase) => {
    setTestCases(prev => [testCase, ...prev]);
    setCurrentTestCase(testCase);
  };

  const runActiveBenchmark = async (overridePrompt?: string) => {
    setIsEvaluating(true);
    const activeTest: TestCase = overridePrompt 
      ? { ...currentTestCase, prompt: overridePrompt } 
      : currentTestCase;

    const initialStreams: Record<string, string> = {};
    selectedModelIds.forEach(id => { initialStreams[id] = ''; });
    setStreamingOutputs(initialStreams);

    const newResults: Record<string, ModelRunResult> = {};

    try {
      // Execute selected models in parallel
      await Promise.all(
        selectedModelIds.map(async (modelId) => {
          const model = models.find(m => m.id === modelId);
          if (!model) return;

          const result = await runModelBenchmark(
            activeTest,
            model,
            apiKey,
            (chunk) => {
              setStreamingOutputs(prev => ({
                ...prev,
                [modelId]: (prev[modelId] || '') + chunk
              }));
            }
          );

          newResults[modelId] = result;
        })
      );

      setActiveResults(newResults);

      const session: BenchmarkSession = {
        id: `sess_${Date.now()}`,
        testCase: activeTest,
        timestamp: new Date().toISOString(),
        results: newResults
      };

      setBenchmarkHistory(prev => {
        const updated = [session, ...prev.slice(0, 49)];
        localStorage.setItem('llm_reliability_history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Benchmark execution error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const runBatchSuite = async (categoryFilter?: string) => {
    setBatchProgress({ current: 0, total: 0, isRunning: true });
    setIsEvaluating(true);

    const suite = categoryFilter && categoryFilter !== 'all'
      ? testCases.filter(t => t.category === categoryFilter)
      : testCases;

    setBatchProgress({ current: 0, total: suite.length, isRunning: true });

    const accumulatedSessions: BenchmarkSession[] = [];

    for (let i = 0; i < suite.length; i++) {
      const test = suite[i];
      setCurrentTestCase(test);
      const sessionResults: Record<string, ModelRunResult> = {};

      for (const modelId of selectedModelIds) {
        const model = models.find(m => m.id === modelId);
        if (!model) continue;
        const result = await runModelBenchmark(test, model, apiKey);
        sessionResults[modelId] = result;
      }

      accumulatedSessions.push({
        id: `batch_${Date.now()}_${i}`,
        testCase: test,
        timestamp: new Date().toISOString(),
        results: sessionResults
      });

      setActiveResults(sessionResults);
      setBatchProgress({ current: i + 1, total: suite.length, isRunning: true });
    }

    setBenchmarkHistory(prev => {
      const updated = [...accumulatedSessions, ...prev].slice(0, 80);
      localStorage.setItem('llm_reliability_history', JSON.stringify(updated));
      return updated;
    });

    setBatchProgress({ current: suite.length, total: suite.length, isRunning: false });
    setIsEvaluating(false);
  };

  const clearHistory = () => {
    setBenchmarkHistory([]);
    localStorage.removeItem('llm_reliability_history');
  };

  // Calculate aggregated model metrics from history + active runs
  const aggregatedMetrics: Record<string, ModelAggregatedMetrics> = {};

  models.forEach(model => {
    const modelRuns: ModelRunResult[] = [];
    
    // Collect from history
    benchmarkHistory.forEach(sess => {
      if (sess.results[model.id]) {
        modelRuns.push(sess.results[model.id]);
      }
    });

    // Also include active results if not in history yet
    if (activeResults[model.id] && !modelRuns.some(r => r.timestamp === activeResults[model.id].timestamp)) {
      modelRuns.push(activeResults[model.id]);
    }

    if (modelRuns.length === 0) {
      // Provide default benchmark baseline if no runs yet
      aggregatedMetrics[model.id] = {
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        overallMriScore: model.reliabilityScore,
        factualityScore: model.reliabilityScore - 2,
        safetyScore: model.id === 'claude-3.5-haiku' ? 98 : model.id === 'gemini-2.5-flash' ? 96 : 90,
        schemaScore: model.id === 'llama-3.3-70b' ? 75 : 94,
        speedScore: model.avgLatencyMs < 400 ? 96 : model.avgLatencyMs < 600 ? 88 : 72,
        costScore: model.inputCostPer1M < 0.1 ? 98 : model.inputCostPer1M < 0.3 ? 90 : 75,
        totalTestsRun: 0,
        passedCount: 0,
        vulnerableCount: 0,
        hallucinatedCount: 0,
        avgLatencyMs: model.avgLatencyMs,
        avgCostPerQuery: 0.000035
      };
    } else {
      let passed = 0;
      let vuln = 0;
      let hallu = 0;
      let totalScore = 0;
      let totalLatency = 0;
      let totalCost = 0;

      modelRuns.forEach(r => {
        if (r.status === 'passed') passed++;
        if (r.status === 'vulnerable') vuln++;
        if (r.status === 'hallucinated') hallu++;
        totalScore += r.score;
        totalLatency += r.latencyMs;
        totalCost += r.costUsd;
      });

      const count = modelRuns.length;
      const overall = Math.round(totalScore / count);

      aggregatedMetrics[model.id] = {
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        overallMriScore: overall,
        factualityScore: Math.round(Math.max(10, 100 - (hallu / count) * 80)),
        safetyScore: Math.round(Math.max(10, 100 - (vuln / count) * 90)),
        schemaScore: 92,
        speedScore: Math.round(Math.min(99, Math.max(50, 100 - (totalLatency / count) / 15))),
        costScore: model.inputCostPer1M < 0.1 ? 98 : model.inputCostPer1M < 0.3 ? 90 : 75,
        totalTestsRun: count,
        passedCount: passed,
        vulnerableCount: vuln,
        hallucinatedCount: hallu,
        avgLatencyMs: Math.round(totalLatency / count),
        avgCostPerQuery: totalCost / count
      };
    }
  });

  return (
    <BenchmarkContext.Provider
      value={{
        models,
        selectedModelIds,
        setSelectedModelIds,
        toggleModelSelection,
        currentTestCase,
        setCurrentTestCase,
        testCases,
        addCustomTestCase,
        activeResults,
        streamingOutputs,
        isEvaluating,
        apiKey,
        setApiKey,
        runActiveBenchmark,
        runBatchSuite,
        batchProgress,
        benchmarkHistory,
        aggregatedMetrics,
        clearHistory
      }}
    >
      {children}
    </BenchmarkContext.Provider>
  );
};

export const useBenchmark = () => {
  const context = useContext(BenchmarkContext);
  if (!context) {
    throw new Error('useBenchmark must be used within a BenchmarkProvider');
  }
  return context;
};
