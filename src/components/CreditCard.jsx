import { CreditCard, Plus, Calendar, DollarSign, AlertTriangle } from 'lucide-react'

export default function CreditCardPage() {
  // Dados mockados para cartões de crédito
  const cartoes = [
    {
      id: 1,
      nome: 'Nubank',
      numero: '**** **** **** 1234',
      limite: 5000.00,
      utilizado: 850.30,
      vencimento: '15',
      fechamento: '10',
      bandeira: 'Mastercard',
      ativo: true
    },
    {
      id: 2,
      nome: 'Inter',
      numero: '**** **** **** 5678',
      limite: 3000.00,
      utilizado: 1200.50,
      vencimento: '20',
      fechamento: '15',
      bandeira: 'Visa',
      ativo: true
    }
  ]

  const faturasPendentes = [
    {
      id: 1,
      cartao: 'Nubank',
      valor: 850.30,
      vencimento: '2024-04-15',
      status: 'pendente'
    },
    {
      id: 2,
      cartao: 'Inter',
      valor: 1200.50,
      vencimento: '2024-04-20',
      status: 'pendente'
    }
  ]

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Cartões de Crédito</h2>
            <p className="text-sm text-gray-600">Gerencie seus cartões e faturas</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Limite Total</p>
              <p className="text-xl font-bold text-gray-900">
                R$ {cartoes.reduce((sum, c) => sum + c.limite, 0).toFixed(2)}
              </p>
            </div>
            <CreditCard className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilizado</p>
              <p className="text-xl font-bold text-red-600">
                R$ {cartoes.reduce((sum, c) => sum + c.utilizado, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-red-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponível</p>
              <p className="text-xl font-bold text-green-600">
                R$ {(cartoes.reduce((sum, c) => sum + c.limite, 0) - cartoes.reduce((sum, c) => sum + c.utilizado, 0)).toFixed(2)}
              </p>
            </div>
            <AlertTriangle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Cartões */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Meus Cartões</h3>
        <div className="space-y-3">
          {cartoes.map((cartao) => {
            const percentualUtilizado = (cartao.utilizado / cartao.limite) * 100

            return (
              <div key={cartao.id} className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{cartao.nome}</h4>
                    <p className="text-blue-100">{cartao.numero}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-100">{cartao.bandeira}</p>
                    <p className="text-sm">Vence: {cartao.vencimento}</p>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Utilizado</span>
                    <span>{percentualUtilizado.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{ width: `${Math.min(percentualUtilizado, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>R$ {cartao.utilizado.toFixed(2)} / R$ {cartao.limite.toFixed(2)}</span>
                  <span>Disponível: R$ {(cartao.limite - cartao.utilizado).toFixed(2)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Faturas Pendentes */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Faturas Pendentes</h3>
        <div className="space-y-3">
          {faturasPendentes.map((fatura) => (
            <div key={fatura.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="text-red-500" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{fatura.cartao}</h4>
                    <p className="text-sm text-gray-600">Vence em {new Date(fatura.vencimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">R$ {fatura.valor.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{fatura.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {faturasPendentes.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <CreditCard size={48} className="mx-auto mb-2 opacity-50" />
            <p>Nenhuma fatura pendente</p>
          </div>
        )}
      </div>
    </div>
  )
}