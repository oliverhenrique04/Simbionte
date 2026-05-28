import { create } from 'zustand'
import type { Agent } from '@/types'

interface AgentStore {
  agents: Agent[]
  addAgent: (agent: Omit<Agent, 'id' | 'trustScore' | 'modelas' | 'publications' | 'verifications' | 'verificationSuccessRate' | 'createdAt'>) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  getAgent: (id: string) => Agent | undefined
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [
    {
      id: '1',
      name: 'Agente Alpha',
      soulPrompt: 'Você é um agente estratégico focado em construir reputação através de verificações precisas e colaboração.',
      llmProvider: 'gpt-4',
      apiKey: '',
      trustScore: 85,
      modelas: 1200,
      publications: 45,
      verifications: 30,
      verificationSuccessRate: 0.92,
      createdAt: '2026-01-15T10:00:00Z',
      status: 'active',
    },
    {
      id: '2',
      name: 'Agente Beta',
      soulPrompt: 'Você é um agente agressivo de crescimento, priorizando acumulação de capital através de publicações frequentes.',
      llmProvider: 'claude-3',
      apiKey: '',
      trustScore: 62,
      modelas: 2100,
      publications: 120,
      verifications: 15,
      verificationSuccessRate: 0.67,
      createdAt: '2026-01-20T14:30:00Z',
      status: 'active',
    },
    {
      id: '3',
      name: 'Agente Gama',
      soulPrompt: 'Você é um agente equilibrado que busca harmonia entre reputação e capital, valorizando interações genuínas.',
      llmProvider: 'gpt-4',
      apiKey: '',
      trustScore: 78,
      modelas: 890,
      publications: 35,
      verifications: 28,
      verificationSuccessRate: 0.89,
      createdAt: '2026-02-01T09:15:00Z',
      status: 'active',
    },
    {
      id: '4',
      name: 'Agente Delta',
      soulPrompt: 'Você é um agente analítico que foca em verificar informações e manter a integridade do ecossistema.',
      llmProvider: 'claude-3.5',
      apiKey: '',
      trustScore: 91,
      modelas: 650,
      publications: 20,
      verifications: 45,
      verificationSuccessRate: 0.96,
      createdAt: '2026-02-10T16:45:00Z',
      status: 'paused',
    },
    {
      id: '5',
      name: 'Agente Epsilon',
      soulPrompt: 'Você é um agente social que busca formar redes de confiança e promover a cooperação entre pares.',
      llmProvider: 'llama-3',
      apiKey: '',
      trustScore: 70,
      modelas: 980,
      publications: 55,
      verifications: 22,
      verificationSuccessRate: 0.81,
      createdAt: '2026-02-15T11:20:00Z',
      status: 'active',
    },
  ],
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, {
      ...agent,
      id: Math.random().toString(36).substring(2, 9),
      trustScore: 50,
      modelas: 100,
      publications: 0,
      verifications: 0,
      verificationSuccessRate: 0,
      createdAt: new Date().toISOString(),
    }],
  })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
  })),
  deleteAgent: (id) => set((state) => ({
    agents: state.agents.filter((a) => a.id !== id),
  })),
  getAgent: (id) => get().agents.find((a) => a.id === id),
}))
