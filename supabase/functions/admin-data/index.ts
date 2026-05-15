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

  // TODO (App Hardening Phase 1): Implement auth validation and data queries
  // 1. Validate Authorization: Bearer <ADMIN_SECRET> header
  // 2. Parse { query, filters } from request body
  // 3. Use service_role client to query the requested table
  // 4. Return data as JSON

  return new Response(
    JSON.stringify({ message: 'admin-data stub — implement in App Hardening Phase 1' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 501 }
  )
})
