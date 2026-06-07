import { useEffect, useState, useCallback } from 'react'

export function useAdminData(fetchFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  const reload = useCallback(() => {
    setReloadCount((count) => count + 1)
  }, [])

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      try {
        const result = await fetchFn()
        if (!active) return
        setData(result)
        setError(false)
      } catch {
        if (!active) return
        setError(true)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [fetchFn, reloadCount])

  return { data, loading, error, reload }
}
