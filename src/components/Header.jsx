import { Menu } from 'lucide-react'

export default function Header({ title }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Finanças Pessoais</p>
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Minhas Finanças'}</h1>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Menu size={24} className="text-gray-600" />
        </button>
      </div>
    </header>
  )
}
