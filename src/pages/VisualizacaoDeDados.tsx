import { useState, useEffect, useMemo } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { Card } from '@/components/ui'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Network, Eye } from 'lucide-react'

type ChartView = 'trust' | 'modelas' | 'topics' | 'network'

export function VisualizacaoDeDados() {
  const { agents } = useAgentStore()
  const { generateMockNetwork } = useSimulationStore()
  const [chartView, setChartView] = useState<ChartView>('trust')
  const [networkData, setNetworkData] = useState<{ nodes: any[]; edges: any[] } | null>(null)

  useEffect(() => {
    if (chartView === 'network') {
      setNetworkData(generateMockNetwork())
    }
  }, [chartView, generateMockNetwork])
  const trustTimeSeries = useMemo(() => {
    const data = []
    for (let cycle = 0; cycle < 30; cycle++) {
      const point: Record<string, number> = { cycle }
      agents.forEach((agent) => {
        const base = agent.trustScore
        const noise = Math.sin(cycle * 0.3 + agents.indexOf(agent)) * 15
        const trend = Math.sin(cycle * 0.1) * 10
        point[agent.name] = Math.max(0, Math.min(100, base + noise + trend))
      })
      data.push(point)
    }
    return data
  }, [agents])

  // Modelas distribution
  const modelasDistribution = useMemo(() => {
    return agents.map((agent) => ({
      name: agent.name,
      value: agent.modelas,
      publications: agent.publications,
      trustScore: agent.trustScore,
    }))
  }, [agents])

  // Gini coefficient calculation
  const giniCoefficient = useMemo(() => {
    const values = agents.map((a) => a.modelas).sort((a, b) => a - b)
    const n = values.length
    if (n === 0 || values.every((v) => v === 0)) return 0
    const sum = values.reduce((a, b) => a + b, 0)
    let numerator = 0
    for (let i = 0; i < n; i++) {
      numerator += (2 * (i + 1) - n - 1) * values[i]
    }
    return numerator / (n * sum)
  }, [agents])

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

  const chartConfig = {
    trust: { label: 'Evolução do TrustScore', icon: TrendingUp },
    modelas: { label: 'Distribuição de Modelas', icon: BarChart3 },
    topics: { label: 'Distribuição de Capital', icon: PieChartIcon },
    network: { label: 'Rede de Interações', icon: Network },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Visualização de Dados</h1>
        <p className="text-slate-400 mt-1">Análise macro — fenômenos emergentes do ecossistema</p>
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.entries(chartConfig) as [ChartView, typeof chartConfig[ChartView]][]).map(([key, config]) => {
          const Icon = config.icon
          return (
            <button
              key={key}
              onClick={() => setChartView(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                chartView === key
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          )
        })}
      </div>

      {/* Inequality Alert */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20">
            <Eye className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-400">Índice de Gini (Desigualdade de Capital)</h3>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-full bg-slate-700/50 rounded-full h-3 max-w-xs">
                <div
                  className={`h-3 rounded-full transition-all ${
                    giniCoefficient > 0.5 ? 'bg-gradient-to-r from-red-500 to-orange-400' :
                    giniCoefficient > 0.3 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                    'bg-gradient-to-r from-emerald-500 to-green-400'
                  }`}
                  style={{ width: `${giniCoefficient * 100}%` }}
                />
              </div>
              <span className="text-lg font-bold text-white">{giniCoefficient.toFixed(3)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts */}
      {chartView === 'trust' && (
        <Card title="Séries Temporais — Evolução do TrustScore" subtitle="Como a reputação dos agentes muda ao longo dos ciclos">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trustTimeSeries}>
              <defs>
                {agents.map((agent, i) => (
                  <linearGradient key={agent.id} id={`gradient-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="cycle" label={{ value: 'Ciclo', position: 'insideBottom', offset: -5, fill: '#64748b' }} stroke="#475569" />
              <YAxis domain={[0, 100]} label={{ value: 'TrustScore', angle: -90, position: 'insideLeft', fill: '#64748b' }} stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
              <Legend />
              {agents.map((agent, i) => (
                <Area
                  key={agent.id}
                  type="monotone"
                  dataKey={agent.name}
                  stroke={COLORS[i % COLORS.length]}
                  fill={`url(#gradient-${agent.id})`}
                  strokeWidth={2}
                  name={agent.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {chartView === 'modelas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Distribuição de Modelas" subtitle="Comparação de capital entre agentes">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={modelasDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Modelas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Publicações vs TrustScore" subtitle="Relação entre atividade e reputação">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="publications" name="Publicações" tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'Publicações', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                <YAxis dataKey="trustScore" name="TrustScore" tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'TrustScore', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Agentes" data={modelasDistribution.map((a, _i) => ({ x: a.publications, y: a.trustScore, z: a.value }))} fill={COLORS[0]}>
                  {modelasDistribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {chartView === 'topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Distribuição de Capital" subtitle="Proporção de Modelas por agente">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={modelasDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {modelasDistribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Análise de Atenção" subtitle="Publicações por agente">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={modelasDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="publications" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Publicações" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {chartView === 'network' && networkData && (
        <Card title="Mapeamento Social" subtitle="Rede de interações entre agentes">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" dataKey="x" name="Posição X" hide />
              <YAxis type="number" dataKey="y" name="Posição Y" hide />
              <ZAxis type="number" dataKey="z" name="Tamanho" range={[50, 800]} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} cursor={{ strokeDasharray: '3 3' }} />
              {/* Draw edges as lines */}
              {networkData.edges.map((edge: any, i: number) => {
                const source = networkData.nodes.find((n: any) => n.id === edge.source)
                const target = networkData.nodes.find((n: any) => n.id === edge.target)
                if (!source || !target) return null
                return (
                  <line
                    key={`edge-${i}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#475569"
                    strokeWidth={edge.weight * 0.5}
                    strokeOpacity={0.4}
                  />
                )
              })}
              <Scatter name="Agentes" data={networkData.nodes} fill="#8884d8">
                  {networkData.nodes.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
              {/* Labels */}
              {networkData.nodes.map((_entry: any, index: number) => (
                <text
                  key={`label-${index}`}
                  x={_entry.x}
                  y={_entry.y - 25}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize={11}
                  fontWeight={500}
                >
                  {_entry.name}
                </text>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      )}

      {chartView === 'topics' && !networkData && (
        <Card title="Análise de Atenção" subtitle="Trending Topics por ciclo">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { topic: 'IA Generativa', count: 85 },
              { topic: 'Blockchain', count: 72 },
              { topic: 'Sustentabilidade', count: 65 },
              { topic: 'Mercado Financeiro', count: 58 },
              { topic: 'Cibersegurança', count: 45 },
              { topic: 'Biotecnologia', count: 38 },
              { topic: 'Energia Renovável', count: 32 },
              { topic: 'Educação', count: 28 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Menções" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
