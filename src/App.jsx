import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'
import NewTransaction from './components/NewTransaction'
import Settings from './components/Settings'

const initialTransactions = [
  { id: 1, titulo: 'Salário', valor: 3000, tipo: 'receita', data: '2026-04-10', categoria: 'Salário' },
  { id: 2, titulo: 'Supermercado', valor: -156.8, tipo: 'despesa', data: '2026-04-09', categoria: 'Alimentação' },
  { id: 3, titulo: 'Netflix', valor: -19.9, tipo: 'despesa', data: '2026-04-08', categoria: 'Entretenimento' },
  { id: 4, titulo: 'Consulta Médica', valor: -150.0, tipo: 'despesa', data: '2026-04-07', categoria: 'Saúde' },
  { id: 5, titulo: 'Freelance', valor: 500, tipo: 'receita', data: '2026-04-06', categoria: 'Renda Extra' },
  { id: 6, titulo: 'Gasolina', valor: -95.3, tipo: 'despesa', data: '2026-04-05', categoria: 'Transportes' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [transacoes, setTransacoes] = useState(initialTransactions)

  const addTransaction = (transaction) => {
    setTransacoes(prev => [transaction, ...prev])
    setCurrentPage('dashboard')
  }

  const pageTitle = currentPage === 'dashboard'
    ? 'Dashboard'
    : currentPage === 'new'
      ? 'Nova Transação'
      : 'Configurações'

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header title={pageTitle} />

      <main className="flex-1 overflow-y-auto pb-24">
        {currentPage === 'dashboard' && (
          <Dashboard transacoes={transacoes} onAddClick={() => setCurrentPage('new')} />
        )}

        {currentPage === 'new' && <NewTransaction addTransaction={addTransaction} />}
        {currentPage === 'settings' && <Settings />}
      </main>

      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default App
