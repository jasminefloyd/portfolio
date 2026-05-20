import { fetchAdminData } from '../../lib/adminApi'
import AdminPanel from './AdminPanel'
import { useAdminData } from '../../hooks/useAdminData'

export default function EventStats() {
  async function loadStats() {
    const events = await fetchAdminData('events')
    const visitors = await fetchAdminData('visitors')
    const visitorById = Object.fromEntries((visitors || []).map((v) => [v.id, v]))

    const resumeDownloads = events?.filter((e) => e.event_type === 'resume_download').length || 0
    const projectOpens = events?.filter((e) => e.event_type === 'project_open').length || 0
    const profileSessions = events?.filter((e) => e.event_type === 'profile_session') || []
    const avgSessionSeconds = profileSessions.length
      ? Math.round(
        profileSessions.reduce((sum, e) => sum + Number(e.metadata?.duration_seconds || 0), 0) /
          profileSessions.length,
      )
      : 0

    const projectMap = {}
    events?.forEach((e) => {
      if (e.event_type === 'project_open' && e.project_id) {
        projectMap[e.project_id] = (projectMap[e.project_id] || 0) + 1
      }
    })
    const projectLeaderboard = Object.entries(projectMap)
      .sort((a, b) => b[1] - a[1])
      .map(([projectId, count]) => ({ projectId, count }))

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

    return { resumeDownloads, projectOpens, avgSessionSeconds, projectLeaderboard, resumeDownloadDetails }
  }

  const { data: stats, loading, error } = useAdminData(loadStats)

  if (loading || error || !stats) {
    return <AdminPanel title="Events" loading={loading} error={error} empty={!stats && !loading && !error} />
  }

  return (
    <AdminPanel title="Events" loading={false} error={false} empty={false}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            Avg Profile Session (sec)
          </p>
          <p className="font-display text-3xl font-semibold text-text-primary">
            {stats.avgSessionSeconds}
          </p>
        </div>
      </div>

      {stats.projectLeaderboard.length > 0 && (
        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Project Opens Leaderboard
          </h4>
          <ul className="space-y-2">
            {stats.projectLeaderboard.map(({ projectId, count }) => (
              <li key={projectId} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary">{projectId}</span>
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
    </AdminPanel>
  )
}
