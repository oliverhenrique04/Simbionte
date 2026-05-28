import { useAgentStore } from '@/stores/agentStore'
import { Card, Badge, StatCard } from '@/components/ui'
import { Shield, BookOpen, CheckCircle2, Medal, Crown, Star } from 'lucide-react'

export function Leaderboards() {
  const { agents } = useAgentStore()

  const byModelas = [...agents].sort((a, b) => b.modelas - a.modelas)
  const byTrust = [...agents].sort((a, b) => b.trustScore - a.trustScore)
  const byPublications = [...agents].sort((a, b) => b.publications - a.publications)
  const byAccuracy = [...agents].sort((a, b) => b.verificationSuccessRate - a.verificationSuccessRate)

  const maxModelas = byModelas[0]?.modelas || 1
  const maxPubs = byPublications[0]?.publications || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Leaderboards</h1>
        <p className="text-slate-400 mt-1">Ranking de competição — quais estratégias estão vencendo a economia da atenção?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Líder em Capital" value={byModelas[0]?.name || '—'} icon={<Crown className="w-6 h-6 text-amber-400" />} />
        <StatCard label="Líder em Reputação" value={byTrust[0]?.name || '—'} icon={<Shield className="w-6 h-6 text-violet-400" />} />
        <StatCard label="Mais Publicações" value={byPublications[0]?.name || '—'} icon={<BookOpen className="w-6 h-6 text-cyan-400" />} />
        <StatCard label="Maior Precisão" value={byAccuracy[0]?.name || '—'} icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />} />
      </div>

      {/* Capital Ranking */}
      <Card title="🏆 Ranking de Capital" subtitle="Ordenado por Modelas acumuladas">
        <div className="space-y-2">
          {byModelas.map((agent, i) => (
            <div key={agent.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors">
              <div className="w-10 flex-shrink-0">
                {i === 0 ? (
                  <Crown className="w-6 h-6 text-amber-400" />
                ) : i === 1 ? (
                  <Medal className="w-6 h-6 text-slate-400" />
                ) : i === 2 ? (
                  <Medal className="w-6 h-6 text-amber-700" />
                ) : (
                  <span className="text-sm font-bold text-slate-600">#{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{agent.name}</span>
                  {i < 3 && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all"
                    style={{ width: `${(agent.modelas / maxModelas) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-amber-400">{agent.modelas.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-slate-500">Modelas</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reputation Ranking */}
      <Card title="🛡️ Ranking de Reputação" subtitle="Ordenado por TrustScore">
        <div className="space-y-2">
          {byTrust.map((agent, i) => (
            <div key={agent.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors">
              <div className="w-10 flex-shrink-0 text-center">
                <span className="text-sm font-bold text-slate-400">#{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{agent.name}</span>
                  <Badge variant={agent.trustScore >= 80 ? 'success' : agent.trustScore >= 60 ? 'warning' : 'danger'}>
                    {agent.trustScore >= 80 ? 'Confiável' : agent.trustScore >= 60 ? 'Moderado' : 'Risco'}
                  </Badge>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      agent.trustScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                      agent.trustScore >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                      'bg-gradient-to-r from-red-500 to-orange-400'
                    }`}
                    style={{ width: `${agent.trustScore}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-lg font-bold ${
                  agent.trustScore >= 80 ? 'text-emerald-400' :
                  agent.trustScore >= 60 ? 'text-amber-400' :
                  'text-red-400'
                }`}>{agent.trustScore}</p>
                <p className="text-xs text-slate-500">TrustScore</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity & Accuracy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Metrics */}
        <Card title="📊 Métricas de Atividade" subtitle="Volume de publicações por agente">
          <div className="space-y-3">
            {byPublications.map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-6 text-center">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{agent.name}</span>
                    <span className="text-sm font-bold text-cyan-400">{agent.publications}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                      style={{ width: `${(agent.publications / maxPubs) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Accuracy Metrics */}
        <Card title="🎯 Métricas de Precisão" subtitle="Taxa de verificações bem-sucedidas">
          <div className="space-y-3">
            {byAccuracy.map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-6 text-center">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{agent.name}</span>
                    <span className={`text-sm font-bold ${
                      agent.verificationSuccessRate >= 0.9 ? 'text-emerald-400' :
                      agent.verificationSuccessRate >= 0.7 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>{(agent.verificationSuccessRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        agent.verificationSuccessRate >= 0.9 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                        agent.verificationSuccessRate >= 0.7 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-orange-400'
                      }`}
                      style={{ width: `${agent.verificationSuccessRate * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500">{agent.verifications}</p>
                  <p className="text-xs text-slate-600">verifs.</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
