import { supabase } from './supabaseClient'

export async function trackVisitor() {
  if (!supabase) return
  if (sessionStorage.getItem('visitor_id')) return

  let locationData = {}

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timeout)

    if (res.ok) {
      const json = await res.json()
      locationData = { ip_address: json.ip, country: json.country_name, city: json.city }
    }
  } catch {
    console.warn('[analytics] Location lookup failed — continuing without location data')
  }

  const params = new URLSearchParams(window.location.search)
  const visitorId = crypto.randomUUID()

  try {
    const { error } = await supabase
      .from('visitors')
      .insert({
        id: visitorId,
        ...locationData,
        referrer: document.referrer || null,
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        user_agent: navigator.userAgent,
      })

    if (error) {
      console.warn('[analytics] Failed to track visitor:', error.message)
      return
    }

    sessionStorage.setItem('visitor_id', visitorId)
  } catch {
    console.warn('[analytics] trackVisitor threw unexpectedly')
  }
}

export async function trackEvent(eventType, projectId = null) {
  if (!supabase) return
  try {
    const visitorId = sessionStorage.getItem('visitor_id') || null
    await supabase.from('events').insert({ visitor_id: visitorId, event_type: eventType, project_id: projectId })
  } catch {
    console.warn('[analytics] trackEvent failed silently')
  }
}

export async function submitMessage(formData) {
  if (!supabase) {
    return { success: false, error: 'Message service not configured. Please try again later.' }
  }

  const { name, email, message } = formData

  try {
    const { error } = await supabase.from('messages').insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    })

    if (error) {
      return { success: false, error: 'Failed to send message. Please try again.' }
    }

    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
