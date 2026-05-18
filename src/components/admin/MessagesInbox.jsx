import { useState } from 'react'
import { fetchAdminData, updateMessageRead } from '../../lib/adminApi'
import AdminPanel from './AdminPanel'
import { useAdminData } from '../../hooks/useAdminData'

export default function MessagesInbox() {
  const [messages, setMessages] = useState(null)
  const [markingRead, setMarkingRead] = useState({})

  async function loadMessages() {
    const data = await fetchAdminData('messages', { orderBy: 'created_at', ascending: false })
    return data || []
  }

  const { data: initialMessages, loading, error } = useAdminData(loadMessages)

  // Sync initial data to local state for mark-read mutations
  if (!messages && initialMessages) {
    setMessages(initialMessages)
  }

  async function toggleRead(messageId, currentRead) {
    setMarkingRead((prev) => ({ ...prev, [messageId]: true }))

    try {
      await updateMessageRead(messageId, !currentRead)
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, read: !currentRead } : m))
      )
    } catch {
      console.error('Failed to update message read status')
    } finally {
      setMarkingRead((prev) => ({ ...prev, [messageId]: false }))
    }
  }

  if (loading || error || !messages) {
    return <AdminPanel title="Messages" loading={loading} error={error} empty={messages && messages.length === 0} />
  }

  if (messages.length === 0) {
    return <AdminPanel title="Messages" loading={false} error={false} empty={true} />
  }

  return (
    <AdminPanel title="Messages" loading={false} error={false} empty={false}>
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`border rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4 ${
              msg.read ? 'bg-bg opacity-70' : 'bg-surface border-accent'
            }`}
          >
            {!msg.read && (
              <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0 mt-1"></div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div>
                  <p className={`font-sans ${msg.read ? 'font-normal' : 'font-semibold'} text-sm text-text-primary`}>
                    {msg.name}
                  </p>
                  <p className="font-sans text-xs text-text-secondary">
                    {msg.email}
                  </p>
                </div>
                <span className="font-sans text-xs text-text-secondary sm:whitespace-nowrap sm:ml-2">
                  {new Date(msg.created_at).toLocaleDateString()} at{' '}
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="font-sans text-sm text-text-primary leading-relaxed bg-bg rounded p-3 mt-2 whitespace-pre-wrap">
                {msg.message}
              </p>

              <button
                onClick={() => toggleRead(msg.id, msg.read)}
                disabled={markingRead[msg.id]}
                className={`font-sans text-xs mt-3 px-3 py-1 rounded border transition-colors ${
                  msg.read
                    ? 'border-border text-text-secondary hover:bg-surface'
                    : 'border-accent bg-accent-subtle text-accent hover:bg-accent hover:text-white'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {msg.read ? 'Mark unread' : 'Mark read'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminPanel>
  )
}
