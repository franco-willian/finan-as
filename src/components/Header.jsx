import { Menu, ChevronDown, BarChart3, Tag, CreditCard, Receipt, Wallet } from 'lucide-react'
import { useState } from 'react'

export default function Header({ title, currentPage, setCurrentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'categories', label: 'Categorias', icon: Tag },
    { id: 'accounts', label: 'Contas', icon: Wallet },
    { id: 'transactions', label: 'Transações', icon: Receipt },
    { id: 'credit-card', label: 'Cartão', icon: CreditCard },
  ]

  const handleMenuClick = (pageId) => {
    setCurrentPage(pageId)
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Finanças Pessoais</p>
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Minhas Finanças'}</h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-gray-600" />
            <ChevronDown size={16} className={`text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      currentPage === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Overlay para fechar o menu quando clicar fora */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  )
}
