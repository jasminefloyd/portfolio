import { useState } from 'react'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const success = onLogin(password)
    if (!success) {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="bg-surface border border-border rounded-xl p-8 max-w-sm w-full">
        <h1 className="font-display text-2xl text-text-primary mb-6">
          Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            className={`w-full border rounded-lg bg-surface px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/30 ${
              error ? 'ring-red-300' : 'border-border'
            }`}
          />
          {error && (
            <p className="text-red-600 text-xs font-sans -mt-2">
              Incorrect password.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-text-primary text-surface rounded-lg px-6 py-3 hover:bg-opacity-90 transition-colors font-sans font-medium"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
