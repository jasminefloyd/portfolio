import { supabase } from './supabaseClient'

function getAdminToken() {
  return import.meta.env.VITE_ADMIN_PASSWORD || ''
}

async function logFunctionErrorDetails(prefix, error) {
  const response = error?.context
  if (!response || typeof response.text !== 'function') {
    console.error(prefix, error)
    return
  }

  let body = ''
  try {
    body = await response.text()
  } catch {
    body = '[unable to read response body]'
  }

  console.error(prefix, {
    message: error.message,
    name: error.name,
    status: response.status,
    statusText: response.statusText,
    body,
  })
}

export async function fetchAdminData(query, filters = {}) {
  if (!supabase) throw new Error('Supabase client not configured')

  const { data, error } = await supabase.functions.invoke('admin-data', {
    body: { query, filters },
    headers: {
      'x-admin-secret': getAdminToken(),
    },
  })

  if (error) {
    await logFunctionErrorDetails('[adminApi] admin-data fetch error:', error)
    throw new Error(error.message || 'Failed admin-data request')
  }
  return data
}

export async function updateMessageRead(messageId, read) {
  if (!supabase) throw new Error('Supabase client not configured')

  const { data, error } = await supabase.functions.invoke('admin-data', {
    body: { query: 'messages', action: 'update_read', id: messageId, read },
    headers: {
      'x-admin-secret': getAdminToken(),
    },
  })

  if (error) {
    await logFunctionErrorDetails('[adminApi] admin-data update error:', error)
    throw new Error(error.message || 'Failed to update message state')
  }
  return data
}

export async function saveProjects(categories, projects) {
  if (!supabase) throw new Error('Supabase client not configured')

  const { data, error } = await supabase.functions.invoke('admin-data', {
    body: { query: 'portfolio_projects', action: 'replace_all', categories, projects },
    headers: {
      'x-admin-secret': getAdminToken(),
    },
  })

  if (error) {
    await logFunctionErrorDetails('[adminApi] admin-data projects save error:', error)
    throw new Error(error.message || 'Failed to save projects')
  }
  return data
}
