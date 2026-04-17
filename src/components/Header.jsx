import { useState } from 'react'
import { Menu, ChevronDown, BarChart3, Tag, Wallet, Receipt, CreditCard, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ title, currentPage, setCurrentPage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { logout, user } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'categories', label: 'Categorias', icon: Tag },
    { id: 'accounts', label: 'Contas', icon: Wallet },
    { id: 'transactions', label: 'Transações', icon: Receipt },
    { id: 'credit-card', label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Menu },
  ]

  const handleMenuClick = (pageId) => {
    setCurrentPage(pageId)
    setIsDropdownOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Olá, {user?.username || 'Usuário'}</p>
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Minhas Finanças'}</h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-gray-600" />
            <ChevronDown
              size={16}
              className={`text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-xl border border-gray-200 py-2 z-20">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => { setIsDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
      )}
    </header>
  )
}
