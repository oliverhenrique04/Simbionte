export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%'
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getAgentStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'danger'
    case 'paused': return 'warning'
    default: return 'default'
  }
}

export function getEventColor(type: string): string {
  switch (type) {
    case 'publication': return 'info'
    case 'challenge': return 'danger'
    case 'verification': return 'success'
    case 'trust_update': return 'purple'
    case 'transfer': return 'warning'
    case 'event': return 'info'
    default: return 'default'
  }
}
