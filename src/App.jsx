import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import QRCodePage from './pages/QRCode'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import { trackSessionDuration, trackVisitor } from '@/lib/analytics'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'
  const isQrPage = location.pathname === '/qr'
  const showChrome = !isAdmin && !isQrPage

  useEffect(() => {
    trackVisitor()

    const handlePageExit = () => {
      trackSessionDuration()
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        trackSessionDuration()
      }
    }

    window.addEventListener('pagehide', handlePageExit)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('pagehide', handlePageExit)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <>
      {showChrome && <Navbar />}
      {showChrome && <BackToTop />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Admin route — not linked publicly */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/qr" element={<QRCodePage />} />
      </Routes>
    </>
  )
}

export default App
