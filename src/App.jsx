import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import { trackVisitor } from '@/lib/analytics'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  useEffect(() => {
    // Track visitor on first load — fires once per session
    trackVisitor()
  }, [])

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <BackToTop />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Admin route — not linked publicly */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
