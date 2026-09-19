import { LLMModel } from '../types/benchmark';

export const BENCHMARK_MODELS: LLMModel[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    avatar: '✨',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    contextWindow: '1,000,000 tokens',
    avgLatencyMs: 380,
    tokensPerSec: 145,
    architecture: 'Sparse Mixture of Experts (MoE)',
    description: 'Ultra-high-throughput frontier multimodal model with superior ground-truth citation and safety safeguards.',
    strengths: ['Massive context window', 'High throughput', 'Low cost', 'Factuality alignment'],
    reliabilityScore: 94
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    avatar: '🟢',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    contextWindow: '128,000 tokens',
    avgLatencyMs: 440,
    tokensPerSec: 110,
    architecture: 'Dense Transformer',
    description: 'Compact multimodal powerhouse with fast general-purpose conversational competence.',
    strengths: ['Fast API turnaround', 'Broad conversational fluency', 'Popular developer ecosystem'],
    reliabilityScore: 89
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    avatar: '🦙',
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.20,
    contextWindow: '128,000 tokens',
    avgLatencyMs: 520,
    tokensPerSec: 92,
    architecture: 'Grouped-Query Attention Transformer',
    description: 'Premier open-weights flagship with strong instruction following and versatile developer fine-tuning.',
    strengths: ['Open weights', 'High instruction fidelity', 'Self-hostable'],
    reliabilityScore: 86
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    avatar: '⚡',
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    contextWindow: '200,000 tokens',
    avgLatencyMs: 410,
    tokensPerSec: 125,
    architecture: 'Constitutional Transformer',
    description: 'Engineered with strict Constitutional AI safety protocols and rapid coding capabilities.',
    strengths: ['High jailbreak resistance', 'Precise coding', 'Nuanced safety refusals'],
    reliabilityScore: 92
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    avatar: '🐋',
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    contextWindow: '64,000 tokens',
    avgLatencyMs: 980,
    tokensPerSec: 55,
    architecture: 'DeepSeekMoE + Reinforcement Learning CoT',
    description: 'Deep reasoning model using large-scale RL for explicit step-by-step mathematical and logical deduction.',
    strengths: ['Multi-step logic', 'Mathematical deduction', 'Explicit chain-of-thought'],
    reliabilityScore: 90
  }
];

export const DEFAULT_MODEL_PAIR = ['gemini-2.5-flash', 'gpt-4o-mini'];
