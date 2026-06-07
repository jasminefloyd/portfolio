import projectsData from '../data/projects.json'
import { supabase } from './supabaseClient'

function normalizeProjectRow(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    role: row.role,
    techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    aiAgentArch: row.ai_agent_arch || null,
    outcomes: Array.isArray(row.outcomes) ? row.outcomes : [],
    links: {
      github: row.github_url || null,
      demo: row.demo_url || null,
    },
  }
}

function buildFallbackData() {
  return projectsData
}

export async function fetchPublishedProjects() {
  if (!supabase) return buildFallbackData()

  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data?.length) {
    return buildFallbackData()
  }

  const projects = data.map(normalizeProjectRow)
  const categories = [...new Set(projects.map((project) => project.category))]

  return { categories, projects }
}
