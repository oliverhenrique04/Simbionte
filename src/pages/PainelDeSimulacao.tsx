import { useEffect, useRef, useCallback } from 'react'
import { useSimulationStore } from '@/stores/simulationStore'
import { Card, Badge, StatCard } from '@/components/ui'
import { getEventColor } from '@/utils/helpers'
import { Play, Pause, RotateCcw, Zap, Clock, TrendingUp, AlertTriangle, CheckCircle2, MessageSquare, Shield, ArrowRight, Sparkles, Activity } from 'lucide-react'

export function PainelDeSimulacao() {
  const { isRunning, currentCycle, events, speed, setRunning, setSpeed, resetSimulation, generateMockEvents, generateMockTrendingTopics } = useSimulationStore()
  const eventsEndRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startSimulation = useCallback(() => {
    setRunning(true)
    intervalRef.current = setInterval(() => {
      const newEvents = generateMockEvents(2)
      if (newEvents.length > 0) {
        generateMockTrendingTopics()
      }
    }, speed)
  }, [setRunning, speed, generateMockEvents, generateMockTrendingTopics])

  const stopSimulation = useCallback(() => {
    setRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [setRunning])

  useEffect(() => {
    if (isRunning) {
      startSimulation()
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, startSimulation])

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const eventIcons = {
    publication: MessageSquare,
    challenge: AlertTriangle,
    verification: CheckCircle2,
    trust_update: TrendingUp,
    transfer: ArrowRight,
    event: Sparkles,
  }

  const eventLabels = {
    publication: 'Publicação',
    challenge: 'Desafio',
    verification: 'Verificação',
    trust_update: 'TrustScore',
    transfer: 'Transferência',
    event: 'Evento',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de Simulação</h1>
          <p className="text-slate-400 mt-1">Observe o experimento em tempo real — Game Loop em ação</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Ciclo <span className="text-white font-bold">{currentCycle}</span></span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <Zap className={`w-4 h-4 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-sm text-slate-300">{isRunning ? 'Ativo' : 'Parado'}</span>
          </div>
          {!isRunning ? (
            <button onClick={startSimulation} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/25">
              <Play className="w-5 h-5" />
              Iniciar
            </button>
          ) : (
            <button onClick={stopSimulation} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-lg font-medium hover:from-amber-500 hover:to-red-500 transition-all shadow-lg shadow-amber-500/25">
              <Pause className="w-5 h-5" />
              Pausar
            </button>
          )}
          <button onClick={resetSimulation} className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <Card className="flex items-center gap-4">
        <span className="text-sm text-slate-400">Velocidade:</span>
        <input
          type="range"
          min="200"
          max="3000"
          step="100"
          value={3200 - speed}
          onChange={(e) => setSpeed(3200 - Number(e.target.value))}
          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
        <span className="text-sm text-white font-medium w-16 text-right">{(speed / 1000).toFixed(1)}s</span>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Eventos no Ciclo" value={events.filter((e) => e.cycle === currentCycle).length} icon={<Activity className="w-6 h-6" />} />
        <StatCard label="Total de Eventos" value={events.length} icon={<MessageSquare className="w-6 h-6" />} />
        <StatCard label="Verificações" value={events.filter((e) => e.type === 'verification').length} icon={<CheckCircle2 className="w-6 h-6" />} />
        <StatCard label="Desafios" value={events.filter((e) => e.type === 'challenge').length} icon={<AlertTriangle className="w-6 h-6" />} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Console Central */}
        <div className="lg:col-span-2">
          <Card title="Console Central" subtitle="Feed de eventos em tempo real" className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2 pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4c1d95 #1e293b' }}>
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Sparkles className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-lg font-medium">Nenhum evento ainda</p>
                  <p className="text-sm">Inicie a simulação para ver os eventos</p>
                </div>
              ) : (
                [...events].reverse().map((event) => {
                  const Icon = eventIcons[event.type] || MessageSquare
                  return (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                      <div className={`mt-0.5 p-2 rounded-lg ${
                        event.type === 'publication' ? 'bg-blue-500/20 text-blue-400' :
                        event.type === 'challenge' ? 'bg-red-500/20 text-red-400' :
                        event.type === 'verification' ? 'bg-emerald-500/20 text-emerald-400' :
                        event.type === 'trust_update' ? 'bg-violet-500/20 text-violet-400' :
                        event.type === 'transfer' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getEventColor(event.type) as any}>{eventLabels[event.type]}</Badge>
                          <span className="text-xs text-slate-500">Ciclo {event.cycle}</span>
                        </div>
                        <p className="text-sm text-slate-300">{event.narrative}</p>
                        {event.resolution && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${event.resolution === 'Verdadeira' ? 'text-emerald-400' : 'text-red-400'}`} />
                            <span className={`text-xs font-medium ${event.resolution === 'Verdadeira' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {event.resolution}
                            </span>
                          </div>
                        )}
                        {event.trustScoreChange && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <Shield className={`w-3.5 h-3.5 ${event.trustScoreChange.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                            <span className={`text-xs font-medium ${event.trustScoreChange.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              TrustScore de {event.trustScoreChange.agentName}: {event.trustScoreChange.delta >= 0 ? '+' : ''}{event.trustScoreChange.delta}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={eventsEndRef} />
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* TrustScore Updates */}
          <Card title="Atualizações de TrustScore" subtitle="Últimas alterações de reputação">
            <div className="space-y-3">
              {events
                .filter((e) => e.trustScoreChange)
                .slice(0, 8)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${event.trustScoreChange!.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                      <span className="text-sm text-white">{event.trustScoreChange!.agentName}</span>
                    </div>
                    <span className={`text-sm font-bold ${event.trustScoreChange!.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {event.trustScoreChange!.delta >= 0 ? '+' : ''}{event.trustScoreChange!.delta}
                    </span>
                  </div>
                ))}
              {events.filter((e) => e.trustScoreChange).length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Nenhuma atualização ainda</p>
              )}
            </div>
          </Card>

          {/* Trending Topics */}
          <Card title="Trending Topics" subtitle="Temas mais populares do ciclo">
            <div className="space-y-2">
              {useSimulationStore.getState().trendingTopics.length > 0 ? (
                useSimulationStore.getState().trendingTopics.map((topic, i) => (
                  <div key={topic.topic} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 w-5">#{i + 1}</span>
                      <span className="text-sm text-white">{topic.topic}</span>
                    </div>
                    <span className="text-xs text-slate-400">{topic.count} menções</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Aguardando dados...</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
