import { useMemo } from 'react'
import projectsData from '../data/projects.json'

const STORAGE_KEY = 'admin_projects_data'

export function useProjects() {
  const data = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return projectsData
      const parsed = JSON.parse(raw)
      if (!parsed?.projects || !Array.isArray(parsed.projects) || !Array.isArray(parsed.categories)) {
        return projectsData
      }
      return parsed
    } catch {
      return projectsData
    }
  }, [])

  const { projects, categories } = data

  const getByCategory = (category) => projects.filter((p) => p.category === category)
  const getById = (id) => projects.find((p) => p.id === id) || null

  return { projects, categories, getByCategory, getById }
}
