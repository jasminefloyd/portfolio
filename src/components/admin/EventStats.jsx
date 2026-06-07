import { useCallback } from 'react'
import { fetchAdminData } from '../../lib/adminApi'
import AdminPanel from './AdminPanel'
import { useAdminData } from '../../hooks/useAdminData'

export default function EventStats() {
  function formatEventLabel(event) {
    if (event.event_type === 'project_open') return `Opened project: ${event.projectName || event.project_id || 'Unknown'}`
    if (event.event_type === 'resume_download') return 'Downloaded resume'
    if (event.event_type === 'external_profile_click') return `Clicked profile: ${event.metadata?.profile || 'Unknown'}`
    if (event.event_type === 'profile_session') return `Session ended (${Number(event.metadata?.duration_seconds || 0)} sec)`
    return event.event_type
  }

  const loadStats = useCallback(async () => {
    const events = await fetchAdminData('events')
    const visitors = await fetchAdminData('visitors')
    const projects = await fetchAdminData('portfolio_projects')
    const visitorById = Object.fromEntries((visitors || []).map((v) => [v.id, v]))
    const projectNameById = Object.fromEntries((projects || []).map((p) => [p.id, p.title]))

    const resumeDownloads = events?.filter((e) => e.event_type === 'resume_download').length || 0
    const projectOpens = events?.filter((e) => e.event_type === 'project_open').length || 0
    const externalProfileClicks = events?.filter((e) => e.event_type === 'external_profile_click').length || 0
    const profileSessions = events?.filter((e) => e.event_type === 'profile_session') || []
    const sessionDurations = profileSessions.map((e) => Number(e.metadata?.duration_seconds || 0)).filter((n) => n > 0)
    const avgSessionSeconds = sessionDurations.length
      ? Math.round(
        sessionDurations.reduce((sum, n) => sum + n, 0) / sessionDurations.length,
      )
      : 0
    const maxSessionSeconds = sessionDurations.length ? Math.max(...sessionDurations) : 0

    const projectMap = {}
    events?.forEach((e) => {
      if (e.event_type === 'project_open' && e.project_id) {
        projectMap[e.project_id] = (projectMap[e.project_id] || 0) + 1
      }
    })
    const projectLeaderboard = Object.entries(projectMap)
      .sort((a, b) => b[1] - a[1])
      .map(([projectId, count]) => ({ projectId, projectName: projectNameById[projectId] || projectId, count }))

    const profileClickMap = {}
    ;(events || []).forEach((e) => {
      if (e.event_type === 'external_profile_click') {
        const profile = e.metadata?.profile || 'unknown'
        profileClickMap[profile] = (profileClickMap[profile] || 0) + 1
      }
    })
    const profileClickBreakdown = Object.entries(profileClickMap)
      .sort((a, b) => b[1] - a[1])
      .map(([profile, count]) => ({ profile, count }))

    const resumeDownloadDetails = (events || [])
      .filter((e) => e.event_type === 'resume_download')
      .slice(0, 10)
      .map((e) => {
        const visitor = visitorById[e.visitor_id] || {}
        return {
          id: e.id,
          created_at: e.created_at,
          user_id: visitor.user_id || 'unknown',
          city: visitor.city || 'Unknown',
          state: visitor.state || 'Unknown',
        }
      })

    const recentProjectOpens = (events || [])
      .filter((e) => e.event_type === 'project_open' && e.project_id)
      .slice(0, 10)
      .map((e) => {
        const visitor = visitorById[e.visitor_id] || {}
        return {
          id: e.id,
          created_at: e.created_at,
          projectName: projectNameById[e.project_id] || e.project_id,
          user_id: visitor.user_id || 'unknown',
          location: [visitor.city, visitor.state, visitor.country].filter(Boolean).join(', ') || 'Unknown',
        }
      })

    const timelineByUser = {}
    ;(events || []).forEach((event) => {
      const visitor = visitorById[event.visitor_id] || {}
      const userId = visitor.user_id || 'unknown'
      if (!timelineByUser[userId]) {
        timelineByUser[userId] = {
          userId,
          location: [visitor.city, visitor.state, visitor.country].filter(Boolean).join(', ') || 'Unknown',
          source: visitor.referrer || 'Direct',
          events: [],
        }
      }
      timelineByUser[userId].events.push({
        ...event,
        projectName: event.project_id ? projectNameById[event.project_id] : null,
      })
    })

    const userActivity = Object.values(timelineByUser)
      .map((u) => ({
        ...u,
        events: u.events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 12),
        latestEventAt: u.events.length ? u.events.reduce((max, e) => (new Date(e.created_at) > new Date(max) ? e.created_at : max), u.events[0].created_at) : null,
      }))
      .sort((a, b) => new Date(b.latestEventAt || 0) - new Date(a.latestEventAt || 0))
      .slice(0, 8)

    return {
      resumeDownloads,
      projectOpens,
      externalProfileClicks,
      avgSessionSeconds,
      maxSessionSeconds,
      projectLeaderboard,
      profileClickBreakdown,
      resumeDownloadDetails,
      recentProjectOpens,
      userActivity,
    }
  }, [])

  const { data: stats, loading, error, reload } = useAdminData(loadStats)

  if (loading || error || !stats) {
    return <AdminPanel title="Events" loading={loading} error={error} empty={!stats && !loading && !error} onRetry={reload} />
  }

  return (
    <AdminPanel title="Events" loading={false} error={false} empty={false} onRetry={reload}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-bg rounded-lg p-4">
          <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
            Resume Downloads
          </p>
          <p className="font-display text-3xl font-semibold text-text-primary">
            {stats.resumeDownloads}
          </p>
        </div>
        <div className="bg-bg rounded-lg p-4">
          <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
            Project Opens
          </p>
          <p className="font-display text-3xl font-semibold text-text-primary">
            {stats.projectOpens}
          </p>
        </div>
        <div className="bg-bg rounded-lg p-4">
          <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
            External Profile Clicks
          </p>
          <p className="font-display text-3xl font-semibold text-text-primary">
            {stats.externalProfileClicks}
          </p>
        </div>
        <div className="bg-bg rounded-lg p-4">
          <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
            Avg Profile Session (sec)
          </p>
          <p className="font-display text-3xl font-semibold text-text-primary">
            {stats.avgSessionSeconds}
          </p>
        </div>
        <div className="bg-bg rounded-lg p-4">
          <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
            Longest Session (sec)
          </p>
          <p className="font-display text-3xl font-semibold text-text-primary">
            {stats.maxSessionSeconds}
          </p>
        </div>
      </div>

      {stats.projectLeaderboard.length > 0 && (
        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Project Opens Leaderboard
          </h4>
          <ul className="space-y-2">
            {stats.projectLeaderboard.map(({ projectId, projectName, count }) => (
              <li key={projectId} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary truncate pr-2">{projectName}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.recentProjectOpens.length > 0 && (
        <div className="mt-8">
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Recent Project Views
          </h4>
          <ul className="space-y-2">
            {stats.recentProjectOpens.map((event) => (
              <li key={event.id} className="text-sm font-sans border-b border-border py-2 text-text-primary">
                {event.projectName} | {event.user_id} | {event.location} | {new Date(event.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.profileClickBreakdown.length > 0 && (
        <div className="mt-8">
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            External Profile Click Breakdown
          </h4>
          <ul className="space-y-2">
            {stats.profileClickBreakdown.map(({ profile, count }) => (
              <li key={profile} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary capitalize">{profile}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.resumeDownloadDetails.length > 0 && (
        <div className="mt-8">
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Recent Resume Downloads
          </h4>
          <ul className="space-y-2">
            {stats.resumeDownloadDetails.map((download) => (
              <li key={download.id} className="text-sm font-sans border-b border-border py-2 text-text-primary">
                {download.user_id} | {download.city}, {download.state} | {new Date(download.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.userActivity.length > 0 && (
        <div className="mt-8">
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Per-User Activity Timeline
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stats.userActivity.map((user) => (
              <div key={user.userId} className="bg-bg rounded-lg p-4">
                <p className="text-sm font-semibold text-text-primary break-all">{user.userId}</p>
                <p className="text-xs text-text-secondary mt-1">{user.location} | {user.source}</p>
                <ul className="mt-3 space-y-2">
                  {user.events.map((event) => (
                    <li key={event.id} className="border-b border-border pb-2">
                      <p className="text-sm text-text-primary">{formatEventLabel(event)}</p>
                      <p className="text-xs text-text-secondary">{new Date(event.created_at).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminPanel>
  )
}
