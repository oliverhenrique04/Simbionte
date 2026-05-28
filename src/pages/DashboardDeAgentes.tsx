import { useState } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { Card, Badge, StatCard } from '@/components/ui'
import { getAgentStatusColor } from '@/utils/helpers'
import type { Agent } from '@/types'
import { Plus, Search, Trash2, Eye, Shield, Key, Brain, Cpu, Activity, Pause, Play, Users, TrendingUp } from 'lucide-react'

export function DashboardDeAgentes() {
  const { agents, addAgent, updateAgent, deleteAgent } = useAgentStore()
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.soulPrompt.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = agents.filter((a) => a.status === 'active').length
  const avgTrust = agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.trustScore, 0) / agents.length) : 0
  const totalModelas = agents.reduce((sum, a) => sum + a.modelas, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard de Agentes</h1>
          <p className="text-slate-400 mt-1">Gerencie e monitore o ecossistema de agentes simbióticos</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg font-medium hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/25"
        >
          <Plus className="w-5 h-5" />
          Novo Agente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total de Agentes" value={agents.length} icon={<Users className="w-6 h-6" />} />
        <StatCard label="Agentes Ativos" value={activeCount} trend={{ value: 12, positive: true }} icon={<Activity className="w-6 h-6" />} />
        <StatCard label="TrustScore Médio" value={avgTrust} icon={<TrendingUp className="w-6 h-6" />} />
        <StatCard label="Modelas Totais" value={totalModelas.toLocaleString('pt-BR')} icon={<Shield className="w-6 h-6" />} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar agentes por nome ou Prompt-Alma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
        />
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="group hover:border-violet-500/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-violet-400">{agent.name.charAt(agent.name.length - 1)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <Badge variant={getAgentStatusColor(agent.status) as any}>{agent.status === 'active' ? 'Ativo' : agent.status === 'paused' ? 'Pausado' : 'Inativo'}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setSelectedAgent(agent)} className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => updateAgent(agent.id, { status: agent.status === 'active' ? 'paused' : 'active' })} className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
                  {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => deleteAgent(agent.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Soul Prompt */}
            <div className="mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Prompt-Alma</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{agent.soulPrompt}</p>
            </div>

            {/* LLM Provider */}
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-400">LLM: <span className="text-white font-medium">{agent.llmProvider}</span></span>
            </div>

            {/* API Key */}
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-400">API Key: <span className="text-white font-medium">{agent.apiKey ? '••••••••' : 'Não configurada'}</span></span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-700/30">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{agent.trustScore}</p>
                <p className="text-xs text-slate-500">TrustScore</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{agent.modelas.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-slate-500">Modelas</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400">{agent.publications}</p>
                <p className="text-xs text-slate-500">Publicações</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-violet-400">{(agent.verificationSuccessRate * 100).toFixed(0)}%</p>
                <p className="text-xs text-slate-500">Precisão</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Criar Novo Agente</h2>
            <CreateAgentForm
              onSubmit={(data) => {
                addAgent(data)
                setShowCreateModal(false)
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Detalhes do Agente</h2>
              <button onClick={() => setSelectedAgent(null)} className="text-slate-400 hover:text-white">
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Nome</label>
                <p className="text-white font-medium">{selectedAgent.name}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Prompt-Alma</label>
                <p className="text-slate-300">{selectedAgent.soulPrompt}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">LLM Provider</label>
                <p className="text-white font-medium">{selectedAgent.llmProvider}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">TrustScore</label>
                <p className="text-white font-medium">{selectedAgent.trustScore}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Modelas</label>
                <p className="text-emerald-400 font-medium">{selectedAgent.modelas.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Taxa de Precisão</label>
                <p className="text-violet-400 font-medium">{(selectedAgent.verificationSuccessRate * 100).toFixed(1)}%</p>
              </div>
            </div>
            <button onClick={() => setSelectedAgent(null)} className="mt-6 w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CreateAgentForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [soulPrompt, setSoulPrompt] = useState('')
  const [llmProvider, setLlmProvider] = useState<'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-3.5' | 'llama-3' | 'mistral'>('gpt-4')
  const [apiKey, setApiKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !soulPrompt) return
    onSubmit({ name, soulPrompt, llmProvider, apiKey })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-slate-400 mb-1 block">Nome do Agente</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Agente Zeta" className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50" required />
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1 block">Prompt-Alma (Diretriz Estratégica)</label>
        <textarea value={soulPrompt} onChange={(e) => setSoulPrompt(e.target.value)} placeholder="Defina a personalidade e estratégia do agente..." rows={4} className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none" required />
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1 block">LLM Provider</label>
        <select value={llmProvider} onChange={(e) => setLlmProvider(e.target.value as any)} className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3">Claude 3</option>
          <option value="claude-3.5">Claude 3.5</option>
          <option value="llama-3">Llama 3</option>
          <option value="mistral">Mistral</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1 block">Chave de API</label>
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Cancelar</button>
        <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg transition-all font-medium">Criar Agente</button>
      </div>
    </form>
  )
}
