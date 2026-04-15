import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-20">
        {currentPage === 'dashboard' && <Dashboard />}
      </main>

      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default App
