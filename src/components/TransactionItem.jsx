import { Edit3, Trash2 } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'

export default function TransactionItem({ transacao, icone, onEdit, onDelete }) {
  const isReceita = transacao.tipo === 'receita'
  const corTexto = isReceita ? 'text-green-600' : 'text-red-600'
  const corIcone = isReceita ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'

  const valorNumerico = typeof transacao.valor === 'string' ? parseFloat(transacao.valor) : transacao.valor
  const valorFormatado = formatCurrency(Math.abs(valorNumerico))

  const formatarData = (dataString) => {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <div className={`p-3 rounded-lg ${corIcone}`}>
          {icone}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{transacao.titulo}</p>
          <p className="text-sm text-gray-500">{transacao.categoria}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`font-bold text-lg ${corTexto}`}>
            {isReceita ? '+' : ''} {valorFormatado}
          </p>
          <p className="text-xs text-gray-400">{formatarData(transacao.data)}</p>
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(transacao)}
              className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Editar transação"
            >
              <Edit3 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Deseja realmente excluir esta transação?')) {
                  onDelete(transacao.id)
                }
              }}
              className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Excluir transação"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
