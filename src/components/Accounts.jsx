import { Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react'

export default function Accounts() {
  // Dados mockados para contas - em uma aplicação real, isso viria do backend
  const contas = [
    {
      id: 1,
      nome: 'Conta Corrente',
      tipo: 'corrente',
      saldo: 2500.50,
      limite: null,
      ativo: true
    },
    {
      id: 2,
      nome: 'Poupança',
      tipo: 'poupanca',
      saldo: 15000.00,
      limite: null,
      ativo: true
    },
    {
      id: 3,
      nome: 'Cartão de Crédito',
      tipo: 'credito',
      saldo: -850.30,
      limite: 5000.00,
      ativo: true
    }
  ]

  const totalAtivos = contas
    .filter(conta => conta.ativo)
    .reduce((sum, conta) => sum + conta.saldo, 0)

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Minhas Contas</h2>
            <p className="text-sm text-gray-600">Gerencie suas contas bancárias</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Patrimônio Total</p>
            <p className={`text-2xl font-bold ${totalAtivos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {totalAtivos.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${totalAtivos >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            {totalAtivos >= 0 ? (
              <TrendingUp className="text-green-600" size={28} />
            ) : (
              <TrendingDown className="text-red-600" size={28} />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {contas.map((conta) => (
          <div key={conta.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Wallet className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{conta.nome}</h3>
                  <p className="text-sm text-gray-500 capitalize">{conta.tipo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${conta.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {conta.saldo.toFixed(2)}
                </p>
                {conta.limite && (
                  <p className="text-xs text-gray-500">
                    Limite: R$ {conta.limite.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {conta.limite && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Utilizado</span>
                  <span>{((Math.abs(conta.saldo) / conta.limite) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${Math.min((Math.abs(conta.saldo) / conta.limite) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors">
          <Plus size={20} />
          Adicionar Nova Conta
        </button>
      </div>
    </div>
  )
}