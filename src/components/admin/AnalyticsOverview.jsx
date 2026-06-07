import { useCallback } from 'react'
import { fetchAdminData } from '../../lib/adminApi'
import AdminPanel from './AdminPanel'
import { useAdminData } from '../../hooks/useAdminData'

function getTopProjectName(events, projects) {
  const projectCounts = {}

  ;(events || []).forEach((event) => {
    if (event.event_type === 'project_open' && event.project_id) {
      projectCounts[event.project_id] = (projectCounts[event.project_id] || 0) + 1
    }
  })

  const topEntry = Object.entries(projectCounts).sort((a, b) => b[1] - a[1])[0]
  if (!topEntry) return 'No project views yet'

  const [projectId] = topEntry
  const project = (projects || []).find((item) => item.id === projectId)
  return project?.title || projectId
}

export default function AnalyticsOverview() {
  const loadOverview = useCallback(async () => {
    const [visitors, events, messages, projects] = await Promise.all([
      fetchAdminData('visitors'),
      fetchAdminData('events'),
      fetchAdminData('messages', { orderBy: 'created_at', ascending: false }),
      fetchAdminData('portfolio_projects'),
    ])

    return {
      totalVisitors: visitors?.length || 0,
      unreadMessages: (messages || []).filter((message) => !message.read).length,
      resumeDownloads: (events || []).filter((event) => event.event_type === 'resume_download').length,
      externalProfileClicks: (events || []).filter((event) => event.event_type === 'external_profile_click').length,
      topProjectName: getTopProjectName(events, projects),
    }
  }, [])

  const { data, loading, error, reload } = useAdminData(loadOverview)

  if (loading || error || !data) {
    return (
      <AdminPanel
        title="Overview"
        loading={loading}
        error={error}
        empty={!data && !loading && !error}
        onRetry={reload}
      />
    )
  }

  const cards = [
    { label: 'Total Visitors', value: data.totalVisitors },
    { label: 'Unread Messages', value: data.unreadMessages },
    { label: 'Resume Downloads', value: data.resumeDownloads },
    { label: 'External Profile Clicks', value: data.externalProfileClicks },
    { label: 'Top Project', value: data.topProjectName },
  ]

  return (
    <AdminPanel title="Overview" loading={false} error={false} empty={false} onRetry={reload}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-bg rounded-lg p-4 border border-border">
            <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
              {card.label}
            </p>
            <p className="font-display text-2xl sm:text-3xl text-text-primary break-words">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </AdminPanel>
  )
}
