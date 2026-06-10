import { supabase } from './supabaseClient'

const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

async function callAdminFunction(payload) {
  if (!supabase) throw new Error('Supabase client not configured')
  if (!adminPassword) throw new Error('Admin password not configured')

  const { data, error } = await supabase.functions.invoke('admin-data', {
    body: payload,
    headers: {
      'x-admin-secret': adminPassword,
    },
  })

  if (error) {
    console.error('[adminApi] Function error:', error)
    throw new Error(error.message || 'Admin request failed')
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data
}

export async function fetchAdminData(query, filters = {}) {
  try {
    console.log(`[adminApi] Fetching ${query} via admin-data...`)

    const data = await callAdminFunction({
      query,
      filters,
    })

    console.log(`[adminApi] Successfully fetched ${query}:`, data?.length || 0, 'records')
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error(`[adminApi] Exception fetching ${query}:`, err)
    throw err
  }
}

export async function updateMessageRead(messageId, read) {
  try {
    return await callAdminFunction({
      query: 'messages',
      action: 'update_read',
      id: messageId,
      read,
    })
  } catch (err) {
    console.error('[adminApi] Exception updating message:', err)
    throw err
  }
}

export async function saveProjects(categories, projects) {
  try {
    return await callAdminFunction({
      query: 'portfolio_projects',
      action: 'replace_all',
      projects,
    })
  } catch (err) {
    console.error('[adminApi] Save projects error:', err)
    throw err
  }
}
