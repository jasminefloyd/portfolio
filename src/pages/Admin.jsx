import { useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import VisitorStats from '../components/admin/VisitorStats'
import EventStats from '../components/admin/EventStats'
import MessagesInbox from '../components/admin/MessagesInbox'

export default function Admin() {
  const isAuthed = sessionStorage.getItem('admin_auth') === 'true'
  const [authed, setAuthed] = useState(isAuthed)

  function handleLogin(password) {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
      return true
    }
    return false
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth')
    setAuthed(false)
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-display text-2xl text-text-primary">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="font-sans text-sm text-accent hover:underline bg-none border-none cursor-pointer"
        >
          Log out
        </button>
      </div>

      <div className="space-y-12">
        <VisitorStats />
        <EventStats />
        <MessagesInbox />
      </div>
    </div>
  )
}
