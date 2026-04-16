import { useEffect, useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import NewTransaction from './components/NewTransaction'
import Settings from './components/Settings'
import Categories from './components/Categories'
import Accounts from './components/Accounts'
import Transactions from './components/Transactions'
import CreditCard from './components/CreditCard'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [transacoes, setTransacoes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log('App renderizando:', { currentPage, transacoes, isLoading, error })

  useEffect(() => {
    console.log('useEffect executado')
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      console.log('Iniciando fetchTransactions')
      setIsLoading(true)
      const response = await fetch('/api/transactions')
      console.log('Resposta recebida:', response.status)
      if (!response.ok) {
        throw new Error('Erro ao carregar transações')
      }
      const data = await response.json()
      console.log('Dados recebidos:', data)
      setTransacoes(data)
    } catch (err) {
      console.error('Erro em fetchTransactions:', err)
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
      : currentPage === 'categories'
        ? 'Categorias'
        : currentPage === 'accounts'
          ? 'Contas'
          : currentPage === 'transactions'
            ? 'Transações'
            : currentPage === 'credit-card'
              ? 'Cartão de Crédito'
              : 'Configurações'

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header title={pageTitle} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="flex-1 overflow-y-auto pb-24">
        {currentPage === 'dashboard' && (
          <Dashboard
            transacoes={transacoes}
            onAddClick={() => setCurrentPage('new')}
            isLoading={isLoading}
            error={error}
          />
        )}

        {currentPage === 'categories' && <Categories transacoes={transacoes} />}
        {currentPage === 'accounts' && <Accounts />}
        {currentPage === 'transactions' && <Transactions transacoes={transacoes} />}
        {currentPage === 'credit-card' && <CreditCard />}

        {currentPage === 'new' && <NewTransaction addTransaction={addTransaction} />}
        {currentPage === 'settings' && <Settings />}
      </main>

      {/* Botão flutuante para nova transação */}
      {currentPage !== 'new' && currentPage !== 'settings' && (
        <button
          onClick={() => setCurrentPage('new')}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default App
