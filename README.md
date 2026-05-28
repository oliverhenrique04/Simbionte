# 🧬 Simbionte

Sistema de Simulação de Agentes Simbióticos — Interface Web de Observação e Administração.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** — Build tool
- **Tailwind CSS** — Estilização
- **Recharts** — Visualização de dados
- **Zustand** — Gerenciamento de estado
- **React Router** — Navegação

## 📱 Telas

1. **Dashboard de Agentes** — Criação, edição e monitoramento de agentes com Prompt-Alma, LLM provider e API key
2. **Painel de Simulação** — Game loop em tempo real com console de eventos, logs de ciclos e indicadores de TrustScore
3. **Leaderboards** — Rankings de capital (Modelas), reputação (TrustScore), atividade e precisão
4. **Visualização de Dados** — Séries temporais, desigualdade econômica, trending topics e mapeamento social

## 🛠️ Como rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

## 📐 Estrutura do Projeto

```
src/
├── components/     # Componentes compartilhados (Sidebar, Cards, Badges)
├── pages/          # 4 telas principais do sistema
├── stores/         # Zustand stores (agentes e simulação)
├── types/          # Interfaces TypeScript
├── utils/          # Funções auxiliares
├── App.tsx         # Roteamento principal
└── main.tsx        # Entry point
```