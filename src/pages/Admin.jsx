import { useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import VisitorStats from '../components/admin/VisitorStats'
import EventStats from '../components/admin/EventStats'
import MessagesInbox from '../components/admin/MessagesInbox'
import ProjectManager from '../components/admin/ProjectManager'

export default function Admin() {
  const isAuthed = sessionStorage.getItem('admin_auth') === 'true'
  const [authed, setAuthed] = useState(isAuthed)
  const [tab, setTab] = useState('analytics')

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
    <div className="min-h-screen bg-bg px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-12">
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
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setTab('analytics')}
            className={`text-sm px-3 py-1.5 rounded ${tab === 'analytics' ? 'bg-text-primary text-surface' : 'border border-border text-text-secondary'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setTab('projects')}
            className={`text-sm px-3 py-1.5 rounded ${tab === 'projects' ? 'bg-text-primary text-surface' : 'border border-border text-text-secondary'}`}
          >
            Manage Projects
          </button>
        </div>

        {tab === 'analytics' ? (
          <>
            <VisitorStats />
            <EventStats />
            <MessagesInbox />
          </>
        ) : (
          <ProjectManager />
        )}
      </div>
    </div>
  )
}
