export default function AdminPanel({ title, loading, error, empty, onRetry, children }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      {title && (
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="font-sans text-xs uppercase tracking-wider text-text-secondary">
            {title}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-sans text-xs text-accent hover:underline"
            >
              Refresh
            </button>
          )}
        </div>
      )}
      {loading && (
        <div className="space-y-3">
          <div className="h-4 bg-border rounded animate-pulse"></div>
          <div className="h-4 bg-border rounded animate-pulse"></div>
          <div className="h-4 bg-border rounded animate-pulse"></div>
        </div>
      )}
      {!loading && error && (
        <div className="flex flex-col items-start gap-3">
          <p className="font-sans text-sm text-red-600">
            Failed to load data. Try refreshing this panel.
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-sans text-sm text-accent hover:underline"
            >
              Retry
            </button>
          )}
        </div>
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
