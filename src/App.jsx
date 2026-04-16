import { useEffect, useState } from 'react'
import { ArrowUpDown, Plus, Minus, CreditCard as CreditCardIcon } from 'lucide-react'
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
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const [newTransactionTipo, setNewTransactionTipo] = useState('despesa')
  const [newTransactionCategoria, setNewTransactionCategoria] = useState('Alimentação')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [returnPage, setReturnPage] = useState('dashboard')
  const [notification, setNotification] = useState(null)
  const [highlightedTransactionId, setHighlightedTransactionId] = useState(null)

  console.log('App renderizando:', { currentPage, transacoes, isLoading, error, isActionMenuOpen, newTransactionTipo, newTransactionCategoria, returnPage, notification, highlightedTransactionId })

  useEffect(() => {
    console.log('useEffect executado')
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (!notification && !highlightedTransactionId) return

    const timer = setTimeout(() => {
      setNotification(null)
      setHighlightedTransactionId(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [notification, highlightedTransactionId])

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
      setEditingTransaction(null)
      setCurrentPage(returnPage || 'dashboard')
    } catch (err) {
      console.error(err)
      setError('Não foi possível salvar a transação')
    }
  }

  const updateTransaction = async (transaction) => {
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar transação')
      }

      const updatedTransaction = await response.json()
      setTransacoes((prev) => prev.map((item) => item.id === updatedTransaction.id ? updatedTransaction : item))
      setEditingTransaction(null)
      setHighlightedTransactionId(updatedTransaction.id)
      setNotification({ type: 'success', message: 'Transação atualizada com sucesso.' })
      setCurrentPage(returnPage || 'dashboard')
    } catch (err) {
      console.error(err)
      setError('Não foi possível atualizar a transação')
    }
  }

  const deleteTransaction = async (id) => {
    console.log('deleteTransaction:', id)
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir transação')
      }

      setTransacoes((prev) => prev.filter((item) => item.id !== id))
      setNotification({ type: 'success', message: 'Transação excluída com sucesso.' })
    } catch (err) {
      console.error(err)
      setError('Não foi possível excluir a transação')
    }
  }

  const actionItems = [
    { id: 'transferencia', label: 'Transferência', icon: ArrowUpDown, iconClass: 'bg-yellow-100 text-yellow-600', tipo: 'despesa', categoria: 'Transferência' },
    { id: 'receita', label: 'Receita', icon: Plus, iconClass: 'bg-green-100 text-green-600', tipo: 'receita', categoria: 'Salário' },
    { id: 'despesa', label: 'Despesa', icon: Minus, iconClass: 'bg-red-100 text-red-600', tipo: 'despesa', categoria: 'Alimentação' },
    { id: 'despesa-cartao', label: 'Despesa cartão', icon: CreditCardIcon, iconClass: 'bg-blue-100 text-blue-600', tipo: 'despesa', categoria: 'Despesa cartão' },
  ]

  const openActionMenu = () => {
    setIsActionMenuOpen(prev => !prev)
  }

  const handleActionSelect = (item) => {
    setReturnPage(currentPage)
    setEditingTransaction(null)
    setNewTransactionTipo(item.tipo)
    setNewTransactionCategoria(item.categoria)
    setCurrentPage('new')
    setIsActionMenuOpen(false)
  }

  const handleEditTransaction = (transaction) => {
    console.log('handleEditTransaction:', transaction)
    setReturnPage(currentPage)
    setEditingTransaction(transaction)
    setNewTransactionTipo(transaction.tipo)
    setNewTransactionCategoria(transaction.categoria)
    setCurrentPage('new')
    setIsActionMenuOpen(false)
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
            onAddClick={() => {
              setReturnPage(currentPage)
              setEditingTransaction(null)
              setNewTransactionTipo('despesa')
              setNewTransactionCategoria('Alimentação')
              setCurrentPage('new')
            }}
            onEdit={handleEditTransaction}
            onDelete={deleteTransaction}
            isLoading={isLoading}
            error={error}
          />
        )}

        {currentPage === 'categories' && <Categories transacoes={transacoes} />}
        {currentPage === 'accounts' && <Accounts />}
        {currentPage === 'transactions' && (
          <Transactions
            transacoes={transacoes}
            onEdit={handleEditTransaction}
            onDelete={deleteTransaction}
          />
        )}
        {currentPage === 'credit-card' && <CreditCard />}

        {currentPage === 'new' && (
          <NewTransaction
            addTransaction={addTransaction}
            defaultTipo={newTransactionTipo}
            defaultCategoria={newTransactionCategoria}
            editingTransaction={editingTransaction}
            onUpdate={updateTransaction}
            onCancel={() => {
              setEditingTransaction(null)
              setCurrentPage(returnPage || 'dashboard')
            }}
          />
        )}
        {currentPage === 'settings' && <Settings />}
      </main>

      {currentPage !== 'new' && currentPage !== 'settings' && (
        <>
          {isActionMenuOpen && (
            <div
              className="fixed inset-0 z-10 bg-black/10"
              onClick={() => setIsActionMenuOpen(false)}
            />
          )}

          <div className="fixed bottom-6 right-6 z-20 flex flex-col items-end gap-2">
            {isActionMenuOpen && (
              <div className="w-56 bg-white rounded-3xl shadow-xl border border-gray-200 py-2 overflow-hidden">
                {actionItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleActionSelect(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className={`p-3 rounded-full ${item.iconClass}`}>
                        <Icon size={16} />
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            <button
              onClick={openActionMenu}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={28} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
