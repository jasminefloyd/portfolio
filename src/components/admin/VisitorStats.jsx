import { useCallback } from 'react'
import { fetchAdminData } from '../../lib/adminApi'
import AdminPanel from './AdminPanel'
import { useAdminData } from '../../hooks/useAdminData'

export default function VisitorStats() {
  function normalizeReferrer(referrer = '') {
    if (!referrer) return 'Direct'

    try {
      const hostname = new URL(referrer).hostname.replace(/^www\./, '')
      if (hostname.includes('linkedin.')) return 'LinkedIn'
      if (hostname.includes('github.')) return 'GitHub'
      if (hostname.includes('google.')) return 'Google'
      if (hostname.includes('substack.')) return 'Substack'
      return hostname
    } catch {
      return referrer
    }
  }

  function getDeviceType(userAgent = '') {
    const ua = userAgent.toLowerCase()
    if (/ipad|tablet|playbook|silk/.test(ua)) return 'Tablet'
    if (/mobi|android|iphone|ipod/.test(ua)) return 'Mobile'
    return 'Desktop'
  }

  const loadStats = useCallback(async () => {
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
        const referrer = normalizeReferrer(v.referrer)
        referrerMap[referrer] = (referrerMap[referrer] || 0) + 1
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

    const utmCampaignMap = {}
    visitors?.forEach((v) => {
      if (v.utm_campaign) {
        utmCampaignMap[v.utm_campaign] = (utmCampaignMap[v.utm_campaign] || 0) + 1
      }
    })
    const topCampaigns = Object.entries(utmCampaignMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([campaign, count]) => ({ campaign, count }))

    const cityMap = {}
    visitors?.forEach((v) => {
      const label = [v.city, v.country].filter(Boolean).join(', ')
      if (label) {
        cityMap[label] = (cityMap[label] || 0) + 1
      }
    })
    const topCities = Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }))

    const deviceMap = {}
    visitors?.forEach((v) => {
      const device = getDeviceType(v.user_agent)
      deviceMap[device] = (deviceMap[device] || 0) + 1
    })
    const deviceBreakdown = Object.entries(deviceMap)
      .sort((a, b) => b[1] - a[1])
      .map(([device, count]) => ({ device, count }))

    const recentVisitors = visitors
      ?.slice(0, 10)
      .map((v) => ({
        id: v.id,
        user_id: v.user_id || 'unknown',
        location: [v.city, v.state, v.country].filter(Boolean).join(', ') || 'Unknown',
        referrer: v.referrer || 'Direct',
        referrerLabel: normalizeReferrer(v.referrer),
        utm_source: v.utm_source || '-',
        utm_medium: v.utm_medium || '-',
        utm_campaign: v.utm_campaign || '-',
        device: getDeviceType(v.user_agent),
        created_at: v.created_at,
      })) || []

    return {
      totalVisitors,
      topCountries,
      topCities,
      topReferrers,
      topSources,
      topCampaigns,
      deviceBreakdown,
      recentVisitors,
    }
  }, [])

  const { data: stats, loading, error, reload } = useAdminData(loadStats)

  if (loading || error || !stats) {
    return <AdminPanel title="Visitor Analytics" loading={loading} error={error} empty={!stats && !loading && !error} onRetry={reload} />
  }

  return (
    <AdminPanel title="Visitor Analytics" loading={false} error={false} empty={false} onRetry={reload}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            Top Referrers
          </h4>
          <ul className="space-y-2">
            {stats.topReferrers.map(({ referrer, count }) => (
              <li key={referrer} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary truncate pr-2">{referrer}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Top UTM Sources
          </h4>
          <ul className="space-y-2">
            {stats.topSources.length > 0 ? stats.topSources.map(({ source, count }) => (
              <li key={source} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary">{source}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            )) : (
              <li className="text-sm font-sans text-text-secondary">No UTM source data yet.</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Top UTM Campaigns
          </h4>
          <ul className="space-y-2">
            {stats.topCampaigns.length > 0 ? stats.topCampaigns.map(({ campaign, count }) => (
              <li key={campaign} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary truncate pr-2">{campaign}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            )) : (
              <li className="text-sm font-sans text-text-secondary">No UTM campaign data yet.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Top Cities
          </h4>
          <ul className="space-y-2">
            {stats.topCities.length > 0 ? stats.topCities.map(({ city, count }) => (
              <li key={city} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary truncate pr-2">{city}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            )) : (
              <li className="text-sm font-sans text-text-secondary">No city data yet.</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Device Breakdown
          </h4>
          <ul className="space-y-2">
            {stats.deviceBreakdown.map(({ device, count }) => (
              <li key={device} className="flex justify-between text-sm font-sans border-b border-border py-2">
                <span className="text-text-primary">{device}</span>
                <span className="text-text-secondary">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {stats.recentVisitors.length > 0 && (
        <div className="mt-8">
          <h4 className="font-sans text-sm font-semibold text-text-primary mb-4">
            Recent Visitors
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm font-sans">
              <thead>
                <tr className="text-left text-text-secondary border-b border-border">
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">Who</th>
                  <th className="py-2 pr-4 font-medium">Where</th>
                  <th className="py-2 pr-4 font-medium">Referrer</th>
                  <th className="py-2 pr-4 font-medium">UTM Source</th>
                  <th className="py-2 pr-4 font-medium">UTM Medium</th>
                  <th className="py-2 pr-4 font-medium">UTM Campaign</th>
                  <th className="py-2 font-medium">Device</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVisitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-border text-text-primary align-top">
                    <td className="py-3 pr-4 whitespace-nowrap">{new Date(visitor.created_at).toLocaleString()}</td>
                    <td className="py-3 pr-4 break-all">{visitor.user_id}</td>
                    <td className="py-3 pr-4">{visitor.location}</td>
                    <td className="py-3 pr-4">
                      <div>{visitor.referrerLabel}</div>
                      {visitor.referrer !== 'Direct' && (
                        <div className="text-xs text-text-secondary break-all mt-1">{visitor.referrer}</div>
                      )}
                    </td>
                    <td className="py-3 pr-4">{visitor.utm_source}</td>
                    <td className="py-3 pr-4">{visitor.utm_medium}</td>
                    <td className="py-3 pr-4">{visitor.utm_campaign}</td>
                    <td className="py-3">{visitor.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminPanel>
  )
}
