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

export default function TransactionList({ transacoes }) {
  return (
    <div className="space-y-2">
      {transacoes.map(transacao => (
        <TransactionItem 
          key={transacao.id} 
          transacao={transacao}
          icone={iconesPorCategoria[transacao.categoria]}
        />
      ))}
    </div>
  )
}
