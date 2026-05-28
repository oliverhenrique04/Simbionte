import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { DashboardDeAgentes } from '@/pages/DashboardDeAgentes'
import { PainelDeSimulacao } from '@/pages/PainelDeSimulacao'
import { Leaderboards } from '@/pages/Leaderboards'
import { VisualizacaoDeDados } from '@/pages/VisualizacaoDeDados'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <Sidebar />
        <main className="ml-64 p-8">
          <Routes>
            <Route path="/" element={<DashboardDeAgentes />} />
            <Route path="/simulation" element={<PainelDeSimulacao />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/visualization" element={<VisualizacaoDeDados />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
