import { PieChart, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'
import { useState } from 'react'

export default function Categories({ transacoes, categoriasList, onAdd, onEdit, onDelete }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  
  const [editingCatName, setEditingCatName] = useState(null)
  const [editInputValue, setEditInputValue] = useState('')

  // Agrupar transações por categoria
  const categoriasGastos = transacoes.reduce((acc, transacao) => {
    const categoria = transacao.categoria || 'Outros'
    if (!acc[categoria]) {
      acc[categoria] = {
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

  const allCategoryNames = new Set([
    ...(categoriasList?.map(c => c.nome) || []),
    ...Object.keys(categoriasGastos)
  ]);

  const categoriasArray = Array.from(allCategoryNames).map(nome => {
    const isCustom = categoriasList?.some(c => c.nome === nome);
    const data = categoriasGastos[nome] || { total: 0, receitas: 0, despesas: 0, count: 0 };
    return {
      nome,
      isCustom, // se vem do banco
      ...data
    };
  }).sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

  const totalGeral = transacoes.reduce((sum, t) => sum + (typeof t.valor === 'string' ? parseFloat(t.valor) : t.valor), 0)

  const handleSaveNovo = () => {
    if (newCatName.trim()) {
      onAdd(newCatName.trim())
    }
    setNewCatName('')
    setIsAdding(false)
  }

  const handleStartEdit = (nome) => {
    setEditingCatName(nome)
    setEditInputValue(nome)
  }

  const handleSaveEdit = (oldName) => {
    if (editInputValue.trim() && editInputValue !== oldName) {
      onEdit(oldName, editInputValue.trim())
    }
    setEditingCatName(null)
    setEditInputValue('')
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Gerenciar Categorias</h2>
          <p className="text-sm text-gray-600">Total de transações: {transacoes.length}</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nova Categoria</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4 border border-blue-100 flex gap-2">
          <input
            type="text"
            autoFocus
            placeholder="Nome da nova categoria"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSaveNovo} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <Check size={20} />
          </button>
          <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {categoriasArray.map((categoria) => {
          const isEditingThis = editingCatName === categoria.nome
          const percentual = totalGeral !== 0 ? Math.abs((categoria.total / totalGeral) * 100) : 0

          return (
            <div key={categoria.nome} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                
                {isEditingThis ? (
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <input
                      type="text"
                      autoFocus
                      value={editInputValue}
                      onChange={e => setEditInputValue(e.target.value)}
                      className="flex-1 px-3 py-1 border border-blue-300 rounded focus:outline-none"
                    />
                    <button onClick={() => handleSaveEdit(categoria.nome)} className="text-green-600 hover:text-green-700">
                      <Check size={18}/>
                    </button>
                    <button onClick={() => setEditingCatName(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={18}/>
                    </button>
                  </div>
                ) : (
                  <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    {categoria.nome}
                    {categoria.isCustom && (
                      <>
                        <button onClick={() => handleStartEdit(categoria.nome)} className="text-blue-500 hover:text-blue-700 ml-2" title="Renomear Categoria">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir '${categoria.nome}'? Transações antigas serão migradas para 'Outros'.`)) {
                              onDelete(categoria.nome)
                            }
                          }}
                          className="text-red-400 hover:text-red-600" title="Excluir Categoria"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </h3>
                )}
                
                <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">{categoria.count} transições</span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total movimentado</span>
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
          <p>Nenhuma categoria encontrada na sua base de dados</p>
        </div>
      )}
    </div>
  )
}