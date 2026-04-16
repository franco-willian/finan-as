import { useEffect, useState } from 'react'

const categorias = [
  'Salário',
  'Alimentação',
  'Entretenimento',
  'Saúde',
  'Transporte',
  'Renda Extra',
  'Compras',
  'Transferência',
  'Despesa cartão',
]

export default function NewTransaction({ addTransaction, defaultTipo, defaultCategoria, editingTransaction, onUpdate, onCancel }) {
  const formatarDataInput = (dataStr) => {
    if (!dataStr) return new Date().toISOString().slice(0, 10);
    return dataStr.includes('T') ? dataStr.substring(0, 10) : dataStr;
  }

  const [titulo, setTitulo] = useState(editingTransaction?.titulo || '')
  const [valor, setValor] = useState(editingTransaction ? Math.abs(editingTransaction.valor).toString() : '')
  const [tipo, setTipo] = useState(editingTransaction?.tipo || defaultTipo || 'despesa')
  const [categoria, setCategoria] = useState(editingTransaction?.categoria || defaultCategoria || categorias[0])
  const [data, setData] = useState(editingTransaction?.data ? formatarDataInput(editingTransaction.data) : new Date().toISOString().slice(0, 10))

  useEffect(() => {
    if (editingTransaction) {
      setTitulo(editingTransaction.titulo || '')
      setValor(Math.abs(editingTransaction.valor).toString())
      setTipo(editingTransaction.tipo || defaultTipo || 'despesa')
      setCategoria(editingTransaction.categoria || defaultCategoria || categorias[0])
      setData(editingTransaction.data ? formatarDataInput(editingTransaction.data) : new Date().toISOString().slice(0, 10))
    } else {
      if (defaultTipo) {
        setTipo(defaultTipo)
      }
      if (defaultCategoria) {
        setCategoria(defaultCategoria)
      }
      setTitulo('')
      setValor('')
      setData(new Date().toISOString().slice(0, 10))
    }
  }, [defaultTipo, defaultCategoria, editingTransaction])

  const handleSubmit = (event) => {
    event.preventDefault()

    const valorNumerico = Number(valor)
    if (!titulo || !valor || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      return
    }

    const novaTransacao = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      titulo,
      valor: tipo === 'receita' ? valorNumerico : -valorNumerico,
      tipo,
      categoria,
      data,
    }

    if (editingTransaction && onUpdate) {
      onUpdate(novaTransacao)
    } else {
      addTransaction(novaTransacao)
    }

    setTitulo('')
    setValor('')
    setTipo('despesa')
    setCategoria(categorias[0])
    setData(new Date().toISOString().slice(0, 10))
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingTransaction ? 'Editar Transação' : 'Registrar Nova Transação'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Ex: Conta de Luz"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
              <input
                type="number"
                value={valor}
                onChange={(event) => setValor(event.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={tipo}
                onChange={(event) => setTipo(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              >
                {categorias.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                value={data}
                onChange={(event) => setData(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {editingTransaction ? 'Salvar Alterações' : 'Salvar Transação'}
            </button>
            {editingTransaction && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
