 import { TrendingUp, TrendingDown, Plus } from 'lucide-react'
import BalanceCard from './BalanceCard'
import TransactionList from './TransactionList'
import { formatCurrency } from '../utils/formatCurrency'

export default function Dashboard({ transacoes, onAddClick, isLoading, error, onEdit, onDelete }) {
  console.log('Dashboard renderizando:', { transacoes, isLoading, error })

  const receitas = transacoes
    .filter(item => item.tipo === 'receita')
    .reduce((sum, item) => sum + (typeof item.valor === 'string' ? parseFloat(item.valor) : item.valor), 0)

  const despesas = transacoes
    .filter(item => item.tipo === 'despesa')
    .reduce((sum, item) => sum + Math.abs(typeof item.valor === 'string' ? parseFloat(item.valor) : item.valor), 0)

  const saldo = transacoes.reduce((sum, item) => sum + (typeof item.valor === 'string' ? parseFloat(item.valor) : item.valor), 0)

  const ultimasTransacoes = [...transacoes]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5)

  console.log('Cálculos:', { receitas, despesas, saldo, ultimasTransacoes })

  if (isLoading) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center text-gray-600">
        Carregando transações...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <BalanceCard saldo={saldo} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(receitas)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(despesas)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onAddClick}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
      >
        <Plus size={20} />
        Nova Transação
      </button>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Últimas Transações</h2>
          <span className="text-sm text-gray-500">Total: {transacoes.length}</span>
        </div>
        <TransactionList transacoes={ultimasTransacoes} />
      </div>
    </div>
  )
}