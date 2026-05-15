import { useEffect, useState, useCallback } from 'react'

export function useAdminData(fetchFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const memoFn = useCallback(fetchFn, [])

  useEffect(() => {
    async function load() {
      try {
        const result = await memoFn()
        setData(result)
        setError(false)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [memoFn])

  return { data, loading, error }
}
