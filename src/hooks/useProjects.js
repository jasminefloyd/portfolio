import { useEffect, useState } from 'react'
import projectsData from '../data/projects.json'
import { fetchPublishedProjects } from '../lib/projectsApi'

export function useProjects() {
  const [data, setData] = useState(projectsData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const result = await fetchPublishedProjects()
        if (!active) return
        setData(result)
      } catch {
        if (!active) return
        setData(projectsData)
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
  }, [])

  const { projects, categories } = data

  const getByCategory = (category) => projects.filter((p) => p.category === category)
  const getById = (id) => projects.find((p) => p.id === id) || null

  return { projects, categories, getByCategory, getById, loading }
}
