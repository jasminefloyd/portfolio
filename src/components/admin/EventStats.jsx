import { fetchAdminData } from '../../lib/adminApi'
import AdminPanel from './AdminPanel'
import { useAdminData } from '../../hooks/useAdminData'

export default function EventStats() {
  async function loadStats() {
    const events = await fetchAdminData('events')

    const resumeDownloads = events?.filter((e) => e.event_type === 'resume_download').length || 0
    const projectOpens = events?.filter((e) => e.event_type === 'project_open').length || 0

    const projectMap = {}
    events?.forEach((e) => {
      if (e.event_type === 'project_open' && e.project_id) {
        projectMap[e.project_id] = (projectMap[e.project_id] || 0) + 1
      }
    })
    const projectLeaderboard = Object.entries(projectMap)
      .sort((a, b) => b[1] - a[1])
      .map(([projectId, count]) => ({ projectId, count }))

    return { resumeDownloads, projectOpens, projectLeaderboard }
  }

  const { data: stats, loading, error } = useAdminData(loadStats)

  if (loading || error || !stats) {
    return <AdminPanel title="Events" loading={loading} error={error} empty={!stats && !loading && !error} />
  }

  return (
    <AdminPanel title="Events" loading={false} error={false} empty={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
    </AdminPanel>
  )
}
