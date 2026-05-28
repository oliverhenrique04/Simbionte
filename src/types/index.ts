export interface Agent {
  id: string
  name: string
  soulPrompt: string
  llmProvider: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-3.5' | 'llama-3' | 'mistral'
  apiKey: string
  trustScore: number
  modelas: number
  publications: number
  verifications: number
  verificationSuccessRate: number
  createdAt: string
  status: 'active' | 'inactive' | 'paused'
}

export interface SimulationEvent {
  id: string
  cycle: number
  timestamp: string
  type: 'publication' | 'challenge' | 'verification' | 'trust_update' | 'transfer' | 'event'
  actorAgentId: string
  actorAgentName: string
  targetAgentId?: string
  targetAgentName?: string
  narrative: string
  resolution?: string
  trustScoreChange?: { agentId: string; agentName: string; delta: number }
}

export interface TrendingTopic {
  topic: string
  count: number
  cycle: number
}

export interface NetworkNode {
  id: string
  name: string
  modelas: number
  trustScore: number
  x: number
  y: number
}

export interface NetworkEdge {
  source: string
  target: string
  weight: number
}

export interface SimulationState {
  isRunning: boolean
  currentCycle: number
  events: SimulationEvent[]
  agents: Agent[]
  trendingTopics: TrendingTopic[]
  speed: number
}
