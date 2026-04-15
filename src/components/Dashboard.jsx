 import { TrendingUp, TrendingDown, Plus } from 'lucide-react'
import BalanceCard from './BalanceCard'
import TransactionList from './TransactionList'

export default function Dashboard() {
  // Dados simulados
  const saldo = 2543.50
  const receitas = 5200.00
  const despesas = 2656.50

  const transacoes = [
    { id: 1, titulo: 'Salário', valor: 3000, tipo: 'receita', data: '2026-04-10', categoria: 'Salário' },
    { id: 2, titulo: 'Supermercado', valor: -156.80, tipo: 'despesa', data: '2026-04-09', categoria: 'Alimentação' },
    { id: 3, titulo: 'Netflix', valor: -19.90, tipo: 'despesa', data: '2026-04-08', categoria: 'Entretenimento' },
    { id: 4, titulo: 'Consulta Médica', valor: -150.00, tipo: 'despesa', data: '2026-04-07', categoria: 'Saúde' },
    { id: 5, titulo: 'Freelance', valor: 500, tipo: 'receita', data: '2026-04-06', categoria: 'Renda Extra' },
    { id: 6, titulo: 'Gasolina', valor: -95.30, tipo: 'despesa', data: '2026-04-05', categoria: 'Transportes' },
  ]

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Card de Saldo Principal */}
      <BalanceCard saldo={saldo} />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">R$ {receitas.toFixed(2)}</p>
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
              <p className="text-2xl font-bold text-red-600">R$ {despesas.toFixed(2)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Nova Transação */}
      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors">
        <Plus size={20} />
        Nova Transação
      </button>

      {/* Lista de Transações */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Últimas Transações</h2>
        <TransactionList transacoes={transacoes} />
      </div>
    </div>
  )
}