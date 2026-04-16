import { useEffect, useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'
import NewTransaction from './components/NewTransaction'
import Settings from './components/Settings'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [transacoes, setTransacoes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/transactions')
      if (!response.ok) {
        throw new Error('Erro ao carregar transações')
      }
      const data = await response.json()
      setTransacoes(data)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar as transações')
    } finally {
      setIsLoading(false)
    }
  }

  const addTransaction = async (transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar transação')
      }

      const newTransaction = await response.json()
      setTransacoes(prev => [newTransaction, ...prev])
      setCurrentPage('dashboard')
    } catch (err) {
      console.error(err)
      setError('Não foi possível salvar a transação')
    }
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
          <Dashboard
            transacoes={transacoes}
            onAddClick={() => setCurrentPage('new')}
            isLoading={isLoading}
            error={error}
          />
        )}

        {currentPage === 'new' && <NewTransaction addTransaction={addTransaction} />}
        {currentPage === 'settings' && <Settings />}
      </main>

      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default App
