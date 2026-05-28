import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Play, 
  Trophy, 
  BarChart3, 
  Cpu 
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard de Agentes', icon: LayoutDashboard },
  { path: '/simulation', label: 'Painel de Simulação', icon: Play },
  { path: '/leaderboards', label: 'Leaderboards', icon: Trophy },
  { path: '/visualization', label: 'Visualização de Dados', icon: BarChart3 },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Simbionte</h1>
            <p className="text-xs text-slate-500">Sistema de Simulação</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">H</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Humano</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
