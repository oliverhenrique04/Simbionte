import { create } from 'zustand'
import type { SimulationEvent, TrendingTopic, NetworkNode, NetworkEdge } from '@/types'

interface SimulationStore {
  isRunning: boolean
  currentCycle: number
  events: SimulationEvent[]
  trendingTopics: TrendingTopic[]
  speed: number
  setRunning: (running: boolean) => void
  setSpeed: (speed: number) => void
  addEvent: (event: SimulationEvent) => void
  resetSimulation: () => void
  generateMockEvents: (count: number) => SimulationEvent[]
  generateMockTrendingTopics: () => TrendingTopic[]
  generateMockNetwork: () => { nodes: NetworkNode[]; edges: NetworkEdge[] }
}

const eventTypes: SimulationEvent['type'][] = ['publication', 'challenge', 'verification', 'trust_update', 'transfer', 'event']

const narratives = {
  publication: [
    '{actor} publicou uma nova alegação sobre o tema "{topic}".',
    '{actor} compartilhou uma descoberta relevante para o ecossistema.',
    '{actor} lançou um novo post sobre tendências do mercado.',
  ],
  challenge: [
    '{actor} desafiou a credibilidade da alegação de {target}.',
    '{actor} questionou a veracidade das informações de {target}.',
    '{actor} iniciou uma disputa epistêmica com {target}.',
  ],
  verification: [
    '{actor} verificou uma alegação de {target} como VERDADEIRA.',
    '{actor} confirmou que a informação de {target} é precisa.',
    '{actor} validou os dados apresentados por {target}.',
  ],
  trust_update: [
    'O TrustScore de {actor} foi atualizado após interação recente.',
    'Reputação de {actor} sofreu alteração significativa.',
    'Índice de confiança de {actor} mudou no ecossistema.',
  ],
  transfer: [
    '{actor} transferiu {amount} Modelas para {target}.',
    '{actor} enviou {amount} Modelas como recompensa a {target}.',
    'Transferência de {amount} Modelas de {actor} para {target}.',
  ],
  event: [
    'Evento especial: bolha de confiança detectada no ecossistema.',
    'Alerta: concentração excessiva de capital identificada.',
    'Mudança significativa nas dinâmicas do ecossistema observada.',
  ],
}

const topics = ['IA Generativa', 'Economia Digital', 'Blockchain', 'Sustentabilidade', 'Mercado Financeiro', 'Saúde Pública', 'Educação', 'Cibersegurança', 'Energia Renovável', 'Biotecnologia']

const agentNames = ['Agente Alpha', 'Agente Beta', 'Agente Gama', 'Agente Delta', 'Agente Epsilon']

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  isRunning: false,
  currentCycle: 0,
  events: [],
  trendingTopics: [],
  speed: 1000,
  setRunning: (running) => set({ isRunning: running }),
  setSpeed: (speed) => set({ speed }),
  addEvent: (event) => set((state) => ({
    events: [event, ...state.events].slice(0, 200),
  })),
  resetSimulation: () => set({
    isRunning: false,
    currentCycle: 0,
    events: [],
    trendingTopics: [],
  }),
  generateMockEvents: (count) => {
    const events: SimulationEvent[] = []
    const cycle = get().currentCycle + 1
    for (let i = 0; i < count; i++) {
      const type = randomFrom(eventTypes)
      const actor = randomFrom(agentNames)
      const target = randomFrom(agentNames.filter((n) => n !== actor))
      const topic = randomFrom(topics)
      const narrativeTemplates = narratives[type]
      let narrative = randomFrom(narrativeTemplates)
      narrative = narrative.replace('{actor}', actor).replace('{target}', target).replace('{topic}', topic).replace('{amount}', randomInt(10, 500).toString())

      const event: SimulationEvent = {
        id: Math.random().toString(36).substring(2, 9),
        cycle,
        timestamp: new Date().toISOString(),
        type,
        actorAgentId: String(randomInt(1, 5)),
        actorAgentName: actor,
        targetAgentId: type === 'challenge' || type === 'verification' || type === 'transfer' ? String(randomInt(1, 5)) : undefined,
        targetAgentName: type === 'challenge' || type === 'verification' || type === 'transfer' ? target : undefined,
        narrative,
        resolution: type === 'verification' ? (Math.random() > 0.3 ? 'Verdadeira' : 'Falsa') : undefined,
        trustScoreChange: type === 'trust_update' ? {
          agentId: String(randomInt(1, 5)),
          agentName: actor,
          delta: randomInt(-10, 15),
        } : undefined,
      }
      events.push(event)
    }
    set((state) => ({ currentCycle: cycle, events: [...events, ...state.events].slice(0, 200) }))
    return events
  },
  generateMockTrendingTopics: () => {
    const topicList: string[] = topics.slice(0, 8)
    const trendingTopics: TrendingTopic[] = topicList.map((t) => ({
      topic: t,
      count: randomInt(5, 100),
      cycle: get().currentCycle,
    })).sort((a, b) => b.count - a.count)
    set({ trendingTopics })
    return trendingTopics
  },
  generateMockNetwork: () => {
    const nodes: NetworkNode[] = agentNames.map((name, i) => ({
      id: String(i + 1),
      name,
      modelas: randomInt(500, 3000),
      trustScore: randomInt(40, 99),
      x: Math.random() * 400,
      y: Math.random() * 300,
    }))
    const edges: NetworkEdge[] = []
    for (let i = 0; i < nodes.length; i++) {
      const numEdges = randomInt(1, 3)
      for (let j = 0; j < numEdges; j++) {
        const target = randomInt(0, nodes.length - 1)
        if (target !== i) {
          edges.push({ source: nodes[i].id, target: nodes[target].id, weight: randomInt(1, 10) })
        }
      }
    }
    return { nodes, edges }
  },
}))
