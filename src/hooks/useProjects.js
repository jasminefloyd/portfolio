import projectsData from '../data/projects.json'

export function useProjects() {
  const { projects, categories } = projectsData

  const getByCategory = (category) => projects.filter((p) => p.category === category)
  const getById = (id) => projects.find((p) => p.id === id) || null

  return { projects, categories, getByCategory, getById }
}
