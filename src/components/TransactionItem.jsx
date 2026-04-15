export default function TransactionItem({ transacao, icone }) {
  const isReceita = transacao.tipo === 'receita'
  const corTexto = isReceita ? 'text-green-600' : 'text-red-600'
  const corIcone = isReceita ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'

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
      
      <div className="text-right">
        <p className={`font-bold text-lg ${corTexto}`}>
          {isReceita ? '+' : ''} R$ {Math.abs(transacao.valor).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">{formatarData(transacao.data)}</p>
      </div>
    </div>
  )
}
