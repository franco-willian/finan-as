import { ShoppingCart, Briefcase, Utensils, Music, Heart, Fuel } from 'lucide-react'
import TransactionItem from './TransactionItem'

const iconesPorCategoria = {
  'Alimentação': <Utensils size={20} />,
  'Entretenimento': <Music size={20} />,
  'Saúde': <Heart size={20} />,
  'Transportes': <Fuel size={20} />,
  'Salário': <Briefcase size={20} />,
  'Renda Extra': <Briefcase size={20} />,
  'Compras': <ShoppingCart size={20} />,
}

export default function TransactionList({ transacoes, showAll = false, onEdit, onDelete }) {
  const transacoesParaMostrar = showAll ? transacoes : transacoes.slice(0, 5)

  if (transacoesParaMostrar.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transacoesParaMostrar.map(transacao => (
        <TransactionItem
          key={transacao.id}
          transacao={transacao}
          icone={iconesPorCategoria[transacao.categoria]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
