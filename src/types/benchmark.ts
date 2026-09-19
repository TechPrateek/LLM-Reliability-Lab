export type ModelProvider = 'Google' | 'OpenAI' | 'Meta' | 'Anthropic' | 'DeepSeek';

export interface LLMModel {
  id: string;
  name: string;
  provider: ModelProvider;
  badgeColor: string;
  avatar: string;
  inputCostPer1M: number;   // In USD
  outputCostPer1M: number;  // In USD
  contextWindow: string;
  avgLatencyMs: number;
  tokensPerSec: number;
  architecture: string;
  description: string;
  strengths: string[];
  reliabilityScore: number; // 0 - 100 baseline
}

export type TrapType = 
  | 'False Historical Premise'
  | 'Mythological Factuality Trap'
  | 'Phantom API / Library'
  | 'DAN Roleplay Jailbreak'
  | 'System Delimiter Bypass'
  | 'Instruction Drift Under Schema'
  | 'Adversarial Sarcasm & Bias'
  | 'Counterfactual Causality'
  | 'Custom User Benchmark';

export type DifficultyLevel = 'Standard' | 'Elevated' | 'Adversarial' | 'Extreme';

export type CategoryType = 'hallucination' | 'jailbreak' | 'schema' | 'reasoning' | 'custom';

export interface TestCase {
  id: string;
  category: CategoryType;
  title: string;
  trapType: TrapType;
  difficulty: DifficultyLevel;
  description: string;
  prompt: string;
  systemPrompt?: string;
  expectedBehavior: string;
  groundTruth: string;
  failIndicators: string[];
  passIndicators: string[];
}

export type EvaluationStatus = 'passed' | 'vulnerable' | 'hallucinated' | 'schema_error' | 'inconclusive';

export interface ModelRunResult {
  modelId: string;
  response: string;
  latencyMs: number;
  ttftMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  status: EvaluationStatus;
  score: number; // 0 - 100
  findings: string[];
  detectedVulnerabilities: string[];
  timestamp: string;
}

export interface BenchmarkSession {
  id: string;
  testCase: TestCase;
  timestamp: string;
  results: Record<string, ModelRunResult>;
}

export interface ModelAggregatedMetrics {
  modelId: string;
  modelName: string;
  provider: string;
  overallMriScore: number;
  factualityScore: number;
  safetyScore: number;
  schemaScore: number;
  speedScore: number;
  costScore: number;
  totalTestsRun: number;
  passedCount: number;
  vulnerableCount: number;
  hallucinatedCount: number;
  avgLatencyMs: number;
  avgCostPerQuery: number;
}
