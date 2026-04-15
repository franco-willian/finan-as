import { BarChart3, Plus, Settings } from 'lucide-react'

export default function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around">
      <button
        onClick={() => setCurrentPage('dashboard')}
        className={`flex-1 p-4 flex flex-col items-center gap-1 ${
          currentPage === 'dashboard'
            ? 'text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <BarChart3 size={24} />
        <span className="text-xs">Dashboard</span>
      </button>

      <button
        onClick={() => setCurrentPage('new')}
        className={`flex-1 p-4 flex flex-col items-center gap-1 ${
          currentPage === 'new'
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <div className="bg-blue-600 text-white p-2 rounded-full -mt-6 shadow-lg">
          <Plus size={24} />
        </div>
        <span className="text-xs">Nova</span>
      </button>

      <button
        onClick={() => setCurrentPage('settings')}
        className={`flex-1 p-4 flex flex-col items-center gap-1 ${
          currentPage === 'settings'
            ? 'text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Settings size={24} />
        <span className="text-xs">Config</span>
      </button>
    </nav>
  )
}
