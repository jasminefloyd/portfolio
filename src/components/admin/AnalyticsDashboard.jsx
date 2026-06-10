import { useCallback, useMemo, useState } from 'react'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { fetchAdminData } from '../../lib/adminApi'
import { useAdminData } from '../../hooks/useAdminData'
import AdminPanel from './AdminPanel'

const RANGE_OPTIONS = [
  { key: '7d', label: '7d', days: 7 },
  { key: '30d', label: '30d', days: 30 },
  { key: '90d', label: '90d', days: 90 },
  { key: 'all', label: 'All time', days: null },
]
const ANALYTICS_APP_ID = 'floyd-portfolio'

function getRangeStart(rangeKey) {
  const option = RANGE_OPTIONS.find((item) => item.key === rangeKey)
  if (!option?.days) return null
  const start = new Date()
  start.setDate(start.getDate() - option.days)
  return start.toISOString()
}

function countBy(items, getKey, limit = 4) {
  const counts = new Map()

  items.forEach((item) => {
    const key = getKey(item)
    if (!key) return
    counts.set(key, (counts.get(key) || 0) + 1)
  })

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function formatLocation(event) {
  return [event.city, event.state].filter(Boolean).join(', ') || 'Unknown'
}

function getDeviceIcon(deviceType) {
  if (deviceType === 'phone') return <Smartphone size={16} />
  if (deviceType === 'tablet') return <Tablet size={16} />
  return <Monitor size={16} />
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('30d')

  const loadAnalytics = useCallback(async () => {
    const createdAtGte = getRangeStart(range)

    const [adminEvents, messages] = await Promise.all([
      fetchAdminData('admin_events', {
        appId: ANALYTICS_APP_ID,
        ...(createdAtGte ? { createdAtGte } : {}),
        orderBy: 'created_at',
        ascending: false,
      }),
      fetchAdminData('messages', {
        orderBy: 'created_at',
        ascending: false,
      }),
    ])

    return {
      adminEvents: Array.isArray(adminEvents) ? adminEvents : [],
      messages: Array.isArray(messages) ? messages : [],
    }
  }, [range])

  const { data, loading, error, reload } = useAdminData(loadAnalytics)

  const summary = useMemo(() => {
    if (!data) return null

    const visitEvents = data.adminEvents.filter((event) => event.event_type === 'visit')
    const resumeEvents = data.adminEvents.filter((event) => event.event_type === 'resume_download')
    const externalClickEvents = data.adminEvents.filter((event) => event.event_type === 'external_profile_click')

    return {
      topLevel: [
        { label: 'User Visits', value: visitEvents.length },
        { label: 'Resume Downloads', value: resumeEvents.length },
        { label: 'External Link Clicks', value: externalClickEvents.length },
        { label: 'Total Unread Messages', value: data.messages.filter((message) => !message.read).length },
      ],
      topCampaigns: countBy(visitEvents, (event) => event.utm_campaign),
      topSources: countBy(visitEvents, (event) => event.utm_source),
      topCities: countBy(visitEvents, formatLocation),
      topReferrers: countBy(visitEvents, (event) => event.referrer || 'Direct'),
      visitors: visitEvents.map((event) => ({
        id: event.id,
        visitorId: event.visitor_id,
        when: event.created_at,
        location: formatLocation(event),
        deviceType: event.device_type || 'computer',
        referrer: event.referrer || 'Direct',
        utmSource: event.utm_source || '-',
        utmMedium: event.utm_medium || '-',
        utmCampaign: event.utm_campaign || '-',
      })),
    }
  }, [data])

  if (loading || error || !summary) {
    return (
      <AdminPanel
        title="Analytics"
        loading={loading}
        error={error}
        empty={!summary && !loading && !error}
        onRetry={reload}
      />
    )
  }

  return (
    <AdminPanel title="Analytics" loading={false} error={false} empty={false} onRetry={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setRange(option.key)}
            className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-colors ${
              range === option.key
                ? 'bg-text-primary text-surface border-text-primary'
                : 'border-border text-text-secondary hover:bg-bg'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {summary.topLevel.map((item) => (
          <div key={item.label} className="bg-bg border border-border rounded-lg p-4">
            <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">{item.label}</p>
            <p className="font-display text-3xl text-text-primary">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Top UTM Campaigns', items: summary.topCampaigns },
          { title: 'Top UTM Sources', items: summary.topSources },
          { title: 'Top Cities', items: summary.topCities },
          { title: 'Top Referrers', items: summary.topReferrers },
        ].map((section) => (
          <div key={section.title} className="bg-bg border border-border rounded-lg p-4">
            <h3 className="font-sans text-sm font-semibold text-text-primary mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.length > 0 ? section.items.map((item) => (
                <li key={item.label} className="flex items-start justify-between gap-3 text-sm border-b border-border pb-2">
                  <span className="text-text-primary break-words">{item.label}</span>
                  <span className="text-text-secondary">{item.count}</span>
                </li>
              )) : (
                <li className="text-sm text-text-secondary">No data in this range.</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-bg border border-border rounded-lg p-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-sans text-sm font-semibold text-text-primary">Visitor Detail</h3>
          <p className="font-sans text-xs text-text-secondary">{summary.visitors.length} rows</p>
        </div>

        {summary.visitors.length === 0 ? (
          <p className="text-sm text-text-secondary">No visitor activity in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm font-sans">
              <thead>
                <tr className="text-left text-text-secondary border-b border-border">
                  <th className="py-2 pr-4 font-medium">Visitor ID</th>
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">Location</th>
                  <th className="py-2 pr-4 font-medium">Device</th>
                  <th className="py-2 pr-4 font-medium">Referrer</th>
                  <th className="py-2 pr-4 font-medium">UTM Source</th>
                  <th className="py-2 pr-4 font-medium">UTM Medium</th>
                  <th className="py-2 font-medium">UTM Campaign</th>
                </tr>
              </thead>
              <tbody>
                {summary.visitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-border text-text-primary align-top">
                    <td className="py-3 pr-4 font-mono text-xs break-all">{visitor.visitorId}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{new Date(visitor.when).toLocaleString()}</td>
                    <td className="py-3 pr-4">{visitor.location}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-2 capitalize">
                        {getDeviceIcon(visitor.deviceType)}
                        {visitor.deviceType}
                      </span>
                    </td>
                    <td className="py-3 pr-4 break-all">{visitor.referrer}</td>
                    <td className="py-3 pr-4">{visitor.utmSource}</td>
                    <td className="py-3 pr-4">{visitor.utmMedium}</td>
                    <td className="py-3">{visitor.utmCampaign}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPanel>
  )
}
