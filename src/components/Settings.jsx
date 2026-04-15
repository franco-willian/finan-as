export default function Settings() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações</h2>
        <p className="text-sm text-gray-600 mb-6">
          Aqui você pode configurar preferências da sua conta, alertas e o modo de exibição do app.
        </p>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="font-medium text-gray-900">Tema</p>
            <p className="text-sm text-gray-500">Em breve: escolha entre claro ou escuro.</p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="font-medium text-gray-900">Notificações</p>
            <p className="text-sm text-gray-500">Em breve: ativar alertas de gastos e metas.</p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="font-medium text-gray-900">Backup e exportação</p>
            <p className="text-sm text-gray-500">Em breve: exportar dados em CSV ou sincronizar com nuvem.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
