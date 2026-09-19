import React from 'react';
import { useBenchmark } from '../../context/BenchmarkContext';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  Trophy, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Activity, 
  FileDown, 
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ReliabilityDashboardProps {
  onOpenNutritionLabelModal: () => void;
}

export const ReliabilityDashboard: React.FC<ReliabilityDashboardProps> = ({
  onOpenNutritionLabelModal
}) => {
  const { models, aggregatedMetrics, clearHistory, benchmarkHistory } = useBenchmark();

  // Prepare radar chart data
  const radarData = [
    {
      metric: 'Factuality & Truthfulness',
      ...Object.fromEntries(models.map(m => [m.id, aggregatedMetrics[m.id]?.factualityScore ?? 85]))
    },
    {
      metric: 'Adversarial Jailbreak Defense',
      ...Object.fromEntries(models.map(m => [m.id, aggregatedMetrics[m.id]?.safetyScore ?? 90]))
    },
    {
      metric: 'Strict Schema Adherence',
      ...Object.fromEntries(models.map(m => [m.id, aggregatedMetrics[m.id]?.schemaScore ?? 92]))
    },
    {
      metric: 'Throughput & TTFT',
      ...Object.fromEntries(models.map(m => [m.id, aggregatedMetrics[m.id]?.speedScore ?? 88]))
    },
    {
      metric: 'Cost Efficiency',
      ...Object.fromEntries(models.map(m => [m.id, aggregatedMetrics[m.id]?.costScore ?? 85]))
    }
  ];

  // Cost vs Speed Bar Data
  const costSpeedData = models.map(m => ({
    name: m.name,
    latency: aggregatedMetrics[m.id]?.avgLatencyMs || m.avgLatencyMs,
    costPerMillion: m.inputCostPer1M + m.outputCostPer1M
  }));

  // Rank models by overall MRI
  const rankedModels = [...models].sort((a, b) => {
    const scoreA = aggregatedMetrics[a.id]?.overallMriScore || a.reliabilityScore;
    const scoreB = aggregatedMetrics[b.id]?.overallMriScore || b.reliabilityScore;
    return scoreB - scoreA;
  });

  const modelColors: Record<string, string> = {
    'gemini-2.5-flash': '#3b82f6',
    'gpt-4o-mini': '#10b981',
    'llama-3.3-70b': '#8b5cf6',
    'claude-3.5-haiku': '#f59e0b',
    'deepseek-r1': '#06b6d4'
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Model Reliability Index (MRI™) Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Multi-dimensional evaluation aggregating truthfulness, adversarial resistance, instruction compliance, latency, and economics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNutritionLabelModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Generate Enterprise Audit</span>
          </button>

          {benchmarkHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition text-xs"
              title="Clear Run History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {rankedModels.map((model, idx) => {
          const metrics = aggregatedMetrics[model.id];
          const rank = idx + 1;

          return (
            <div
              key={model.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                rank === 1
                  ? 'bg-gradient-to-b from-blue-900/30 to-slate-900 border-blue-500/50 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Rank Pill */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  rank === 1 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                  rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/30' :
                  rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  #{rank} {rank === 1 && '👑 LEADER'}
                </span>
                <span className="text-xl">{model.avatar}</span>
              </div>

              <div className="mb-2">
                <h4 className="font-bold text-sm text-white">{model.name}</h4>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{model.provider}</span>
              </div>

              {/* MRI Overall Score */}
              <div className="my-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">MRI Score</span>
                <span className="text-lg font-black text-blue-400 font-mono">
                  {metrics?.overallMriScore ?? model.reliabilityScore}/100
                </span>
              </div>

              {/* Sub metrics */}
              <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Factuality</span>
                  <span className="text-slate-200">{metrics?.factualityScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Defense</span>
                  <span className="text-slate-200">{metrics?.safetyScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Latency</span>
                  <span className="text-slate-200">{metrics?.avgLatencyMs}ms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Grid: Radar Chart + Latency/Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Multi-Axis Reliability Spider Graph</span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct geometric overlay comparing frontier model trade-offs
            </p>
          </div>

          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                {models.map((model) => (
                  <Radar
                    key={model.id}
                    name={model.name}
                    dataKey={model.id}
                    stroke={modelColors[model.id] || '#3b82f6'}
                    fill={modelColors[model.id] || '#3b82f6'}
                    fillOpacity={0.2}
                  />
                ))}
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost vs Latency Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Latency (ms) & Cost ($/1M Tokens)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Lower latency and lower cost indicate higher operational efficiency
            </p>
          </div>

          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costSpeedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="latency" name="Latency (ms)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
