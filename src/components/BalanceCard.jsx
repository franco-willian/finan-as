export default function BalanceCard({ saldo }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
      <p className="text-sm opacity-90 mb-2">Saldo Disponível</p>
      <h2 className="text-4xl font-bold">R$ {saldo.toFixed(2)}</h2>
      <p className="text-xs opacity-75 mt-4">Atualizado agora</p>
    </div>
  )
}
