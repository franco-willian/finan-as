import { Receipt, Filter, Search, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import TransactionList from './TransactionList'

export default function Transactions({ transacoes }) {
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState('data-desc')

  // Filtrar transações
  let transacoesFiltradas = transacoes

  if (filtro !== 'todas') {
    transacoesFiltradas = transacoesFiltradas.filter(t => t.tipo === filtro)
  }

  if (busca) {
    transacoesFiltradas = transacoesFiltradas.filter(t =>
      t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      (t.categoria && t.categoria.toLowerCase().includes(busca.toLowerCase()))
    )
  }

  // Ordenar transações
  transacoesFiltradas = [...transacoesFiltradas].sort((a, b) => {
    switch (ordenacao) {
      case 'data-desc':
        return new Date(b.data) - new Date(a.data)
      case 'data-asc':
        return new Date(a.data) - new Date(b.data)
      case 'valor-desc':
        return Math.abs(b.valor) - Math.abs(a.valor)
      case 'valor-asc':
        return Math.abs(a.valor) - Math.abs(b.valor)
      default:
        return 0
    }
  })

  const totalFiltrado = transacoesFiltradas.reduce((sum, t) => sum + (typeof t.valor === 'string' ? parseFloat(t.valor) : t.valor), 0)

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Todas as Transações</h2>
            <p className="text-sm text-gray-600">Total: {transacoesFiltradas.length} transações</p>
          </div>
          <Receipt className="text-blue-600" size={24} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Valor total:</span>
          <span className={`font-bold ${totalFiltrado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {totalFiltrado.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por descrição ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>

            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="data-desc">Data ↓</option>
              <option value="data-asc">Data ↑</option>
              <option value="valor-desc">Valor ↓</option>
              <option value="valor-asc">Valor ↑</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-lg shadow-sm">
        <TransactionList transacoes={transacoesFiltradas} showAll={true} />
      </div>

      {transacoesFiltradas.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <Receipt size={48} className="mx-auto mb-2 opacity-50" />
          <p>Nenhuma transação encontrada</p>
          {busca && <p className="text-sm">Tente ajustar os filtros de busca</p>}
        </div>
      )}
    </div>
  )
}