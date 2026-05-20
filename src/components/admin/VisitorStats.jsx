import { fetchAdminData } from '../../lib/adminApi'
import AdminPanel from './AdminPanel'
import { useAdminData } from '../../hooks/useAdminData'

export default function VisitorStats() {
  async function loadStats() {
    const visitors = await fetchAdminData('visitors')
    const countries = visitors.filter((v) => v.country)

    const totalVisitors = visitors?.length || 0

    const countryMap = {}
    countries?.forEach((v) => {
      countryMap[v.country] = (countryMap[v.country] || 0) + 1
    })
    const topCountries = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }))

    const referrerMap = {}
    visitors?.forEach((v) => {
      if (v.referrer) {
        referrerMap[v.referrer] = (referrerMap[v.referrer] || 0) + 1
      }
    })
    const topReferrers = Object.entries(referrerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count }))

    const utmSourceMap = {}
    visitors?.forEach((v) => {
      if (v.utm_source) {
        utmSourceMap[v.utm_source] = (utmSourceMap[v.utm_source] || 0) + 1
      }
    })
    const topSources = Object.entries(utmSourceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))

    const recentVisitors = visitors
      ?.slice(0, 10)
      .map((v) => ({
        id: v.id,
        user_id: v.user_id || 'unknown',
        location: [v.city, v.state].filter(Boolean).join(', ') || 'Unknown',
        source: v.referrer || 'Direct',
        utm: v.utm_source || '-',
        created_at: v.created_at,
      })) || []

    return { totalVisitors, topCountries, topReferrers, topSources, recentVisitors }
  }

  const { data: stats, loading, error } = useAdminData(loadStats)

  if (loading || error || !stats) {
    return <AdminPanel title="Visitor Analytics" loading={loading} error={error} empty={!stats && !loading && !error} />
  }

  return (
    <AdminPanel title="Visitor Analytics" loading={false} error={false} empty={false}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg rounded-lg p-4">
          <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
            Total Visitors
          </p>
          <p className="font-display text-3xl font-semibold text-text-primary">
            {stats.totalVisitors}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Top Countries
          </h4>
          <ul className="space-y-2">
            {stats.topCountries.map(({ country, count }) => (
              <li key={country} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary">{country}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Top UTM Sources
          </h4>
          <ul className="space-y-2">
            {stats.topSources.map(({ source, count }) => (
              <li key={source} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary">{source}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {stats.topReferrers.length > 0 && (
        <div className="mt-8">
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Top Referrers
          </h4>
          <ul className="space-y-2">
            {stats.topReferrers.map(({ referrer, count }) => (
              <li key={referrer} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary truncate">{referrer}</span>
                <span className="text-text-secondary ml-2">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.recentVisitors.length > 0 && (
        <div className="mt-8">
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Recent Visitors
          </h4>
          <ul className="space-y-2">
            {stats.recentVisitors.map((visitor) => (
              <li key={visitor.id} className="text-sm font-sans border-b border-border py-2 text-text-primary">
                {visitor.user_id} | {visitor.location} | {visitor.source} | UTM: {visitor.utm} | {new Date(visitor.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminPanel>
  )
}
