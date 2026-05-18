export default function AdminPanel({ title, loading, error, empty, children }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      {title && (
        <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-4">
          {title}
        </p>
      )}
      {loading && (
        <div className="space-y-3">
          <div className="h-4 bg-border rounded animate-pulse"></div>
          <div className="h-4 bg-border rounded animate-pulse"></div>
          <div className="h-4 bg-border rounded animate-pulse"></div>
        </div>
      )}
      {!loading && error && (
        <p className="font-sans text-sm text-red-600">
          Failed to load data. Refresh to try again.
        </p>
      )}
      {!loading && !error && empty && (
        <p className="font-sans text-sm text-text-secondary">
          No data yet.
        </p>
      )}
      {!loading && !error && !empty && children}
    </div>
  )
}
