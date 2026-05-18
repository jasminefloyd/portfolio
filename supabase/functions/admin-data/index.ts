// supabase/functions/admin-data/index.ts
// Admin data proxy — built in App Hardening Phase 1
//
// This Edge Function is the secure read path for the admin dashboard.
// It validates the admin password and uses the service_role key to query
// visitors, events, and messages tables (anon key has no SELECT on these).
//
// Deploy with:
//   supabase functions deploy admin-data --project-ref YOUR_PROJECT_REF
//
// Set secrets with:
//   supabase secrets set ADMIN_SECRET=your_password --project-ref YOUR_PROJECT_REF

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization') || ''
    const expectedSecret = Deno.env.get('ADMIN_SECRET') || ''

    if (!authHeader.startsWith('Bearer ') || !expectedSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const token = authHeader.replace('Bearer ', '').trim()
    if (token !== expectedSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const body = await req.json()
    const { query, filters, action, id, read } = body || {}

    if (query === 'messages' && action === 'update_read') {
      if (!id || typeof read !== 'boolean') {
        return new Response(JSON.stringify({ error: 'Invalid update payload' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      const { error } = await adminClient.from('messages').update({ read }).eq('id', id)
      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (!['visitors', 'events', 'messages'].includes(query)) {
      return new Response(JSON.stringify({ error: 'Invalid query target' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    let request = adminClient.from(query).select('*')
    if (filters?.orderBy) {
      request = request.order(filters.orderBy, { ascending: Boolean(filters.ascending) })
    }

    const { data, error } = await request
    if (error) throw error

    return new Response(JSON.stringify(data || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Request failed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
