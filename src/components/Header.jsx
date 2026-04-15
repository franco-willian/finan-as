import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">💰 Minhas Finanças</h1>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Menu size={24} className="text-gray-600" />
        </button>
      </div>
    </header>
  )
}
