import { supabase } from './supabaseClient'

export async function fetchAdminData(query, filters = {}) {
  if (!supabase) throw new Error('Supabase client not configured')

  try {
    console.log(`[adminApi] Fetching ${query}...`)
    let request = supabase.from(query).select('*')

    if (filters?.orderBy) {
      request = request.order(filters.orderBy, { ascending: Boolean(filters.ascending) })
    } else if (query === 'portfolio_projects') {
      request = request.order('sort_order', { ascending: true })
    }

    const { data, error } = await request

    if (error) {
      console.error(`[adminApi] Query error for ${query}:`, error)
      throw new Error(error.message || `Failed to fetch ${query}`)
    }

    console.log(`[adminApi] Successfully fetched ${query}:`, data?.length || 0, 'records')
    return data || []
  } catch (err) {
    console.error(`[adminApi] Exception fetching ${query}:`, err)
    throw err
  }
}

export async function updateMessageRead(messageId, read) {
  if (!supabase) throw new Error('Supabase client not configured')

  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ read })
      .eq('id', messageId)

    if (error) {
      console.error('[adminApi] Update error:', error.message)
      throw new Error(error.message || 'Failed to update message state')
    }

    return data
  } catch (err) {
    console.error('[adminApi] Exception:', err.message)
    throw err
  }
}

export async function saveProjects(categories, projects) {
  if (!supabase) throw new Error('Supabase client not configured')

  try {
    // Normalize projects
    const normalizedProjects = projects.map((project, index) => ({
      id: project.id,
      title: project.title,
      category: project.category,
      description: project.description,
      role: project.role,
      tech_stack: Array.isArray(project.techStack) ? project.techStack : [],
      ai_agent_arch: project.aiAgentArch || null,
      outcomes: Array.isArray(project.outcomes) ? project.outcomes : [],
      github_url: project.links?.github || null,
      demo_url: project.links?.demo || null,
      sort_order: index,
      updated_at: new Date().toISOString(),
    }))

    // Delete all existing projects
    const { error: deleteError } = await supabase
      .from('portfolio_projects')
      .delete()
      .neq('id', '')

    if (deleteError) throw deleteError

    // Insert new projects
    if (normalizedProjects.length > 0) {
      const { error: insertError } = await supabase
        .from('portfolio_projects')
        .insert(normalizedProjects)

      if (insertError) throw insertError
    }

    return { success: true }
  } catch (err) {
    console.error('[adminApi] Save projects error:', err.message)
    throw err
  }
}
