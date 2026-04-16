import { BarChart3, Plus, Settings, Tag, CreditCard, Receipt, Wallet } from 'lucide-react'

export default function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around">
      <button
        onClick={() => setCurrentPage('dashboard')}
        className={`flex-1 p-3 flex flex-col items-center gap-1 ${
          currentPage === 'dashboard'
            ? 'text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <BarChart3 size={20} />
        <span className="text-xs">Dashboard</span>
      </button>

      <button
        onClick={() => setCurrentPage('categories')}
        className={`flex-1 p-3 flex flex-col items-center gap-1 ${
          currentPage === 'categories'
            ? 'text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Tag size={20} />
        <span className="text-xs">Categorias</span>
      </button>

      <button
        onClick={() => setCurrentPage('accounts')}
        className={`flex-1 p-3 flex flex-col items-center gap-1 ${
          currentPage === 'accounts'
            ? 'text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Wallet size={20} />
        <span className="text-xs">Contas</span>
      </button>

      <button
        onClick={() => setCurrentPage('new')}
        className={`flex-1 p-3 flex flex-col items-center gap-1 ${
          currentPage === 'new'
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <div className="bg-blue-600 text-white p-2 rounded-full -mt-6 shadow-lg">
          <Plus size={20} />
        </div>
        <span className="text-xs">Nova</span>
      </button>

      <button
        onClick={() => setCurrentPage('transactions')}
        className={`flex-1 p-3 flex flex-col items-center gap-1 ${
          currentPage === 'transactions'
            ? 'text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Receipt size={20} />
        <span className="text-xs">Transações</span>
      </button>

      <button
        onClick={() => setCurrentPage('credit-card')}
        className={`flex-1 p-3 flex flex-col items-center gap-1 ${
          currentPage === 'credit-card'
            ? 'text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <CreditCard size={20} />
        <span className="text-xs">Cartão</span>
      </button>
    </nav>
  )
}
