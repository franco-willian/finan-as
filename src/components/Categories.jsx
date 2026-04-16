import { PieChart, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'

export default function Categories({ transacoes }) {
  // Agrupar transações por categoria
  const categorias = transacoes.reduce((acc, transacao) => {
    const categoria = transacao.categoria || 'Outros'
    if (!acc[categoria]) {
      acc[categoria] = {
        nome: categoria,
        total: 0,
        receitas: 0,
        despesas: 0,
        count: 0
      }
    }

    const valor = typeof transacao.valor === 'string' ? parseFloat(transacao.valor) : transacao.valor

    acc[categoria].total += valor
    acc[categoria].count += 1

    if (transacao.tipo === 'receita') {
      acc[categoria].receitas += valor
    } else {
      acc[categoria].despesas += Math.abs(valor)
    }

    return acc
  }, {})

  const categoriasArray = Object.values(categorias).sort((a, b) => Math.abs(b.total) - Math.abs(a.total))

  const totalGeral = transacoes.reduce((sum, t) => sum + (typeof t.valor === 'string' ? parseFloat(t.valor) : t.valor), 0)

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Resumo por Categoria</h2>
        <p className="text-sm text-gray-600">Total de transações: {transacoes.length}</p>
      </div>

      <div className="space-y-3">
        {categoriasArray.map((categoria) => {
          const percentual = totalGeral !== 0 ? Math.abs((categoria.total / totalGeral) * 100) : 0

          return (
            <div key={categoria.nome} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{categoria.nome}</h3>
                <span className="text-sm text-gray-500">{categoria.count} transações</span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total</span>
                <span className={`font-bold ${categoria.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(categoria.total)}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${categoria.total >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(percentual, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Receitas: {formatCurrency(categoria.receitas)}</span>
                <span>Despesas: {formatCurrency(categoria.despesas)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {categoriasArray.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <PieChart size={48} className="mx-auto mb-2 opacity-50" />
          <p>Nenhuma transação encontrada</p>
        </div>
      )}
    </div>
  )
}