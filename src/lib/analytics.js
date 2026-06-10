import { supabase } from './supabaseClient'

const VISITOR_SESSION_KEY = 'visitor_id'
const USER_ID_KEY = 'portfolio_user_id'
const SESSION_START_KEY = 'profile_session_start'
const SESSION_TRACKED_KEY = 'profile_session_tracked'
let visitorTrackingPromise = null

function getOrCreateUserId() {
  const existing = localStorage.getItem(USER_ID_KEY)
  if (existing) return existing
  const generated = crypto.randomUUID()
  localStorage.setItem(USER_ID_KEY, generated)
  return generated
}

export async function trackVisitor() {
  if (!supabase) return null
  if (sessionStorage.getItem(VISITOR_SESSION_KEY)) return sessionStorage.getItem(VISITOR_SESSION_KEY)
  if (visitorTrackingPromise) return visitorTrackingPromise

  visitorTrackingPromise = (async () => {
    let locationData = {}

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
      clearTimeout(timeout)

      if (res.ok) {
        const json = await res.json()
        locationData = {
          ip_address: json.ip,
          country: json.country_name,
          city: json.city,
          state: json.region,
        }
      }
    } catch {
      console.warn('[analytics] Location lookup failed — continuing without location data')
    }

    const params = new URLSearchParams(window.location.search)
    const visitorId = crypto.randomUUID()
    const userId = getOrCreateUserId()

    try {
      const { error } = await supabase
        .from('visitors')
        .insert({
          id: visitorId,
          user_id: userId,
          ...locationData,
          referrer: document.referrer || null,
          utm_source: params.get('utm_source'),
          utm_medium: params.get('utm_medium'),
          utm_campaign: params.get('utm_campaign'),
          utm_term: params.get('utm_term'),
          utm_content: params.get('utm_content'),
          user_agent: navigator.userAgent,
        })

      if (error) {
        console.warn('[analytics] Failed to track visitor:', error.message)
        return null
      }

      sessionStorage.setItem(VISITOR_SESSION_KEY, visitorId)
      sessionStorage.setItem(SESSION_START_KEY, String(Date.now()))
      sessionStorage.setItem(SESSION_TRACKED_KEY, 'false')
      return visitorId
    } catch {
      console.warn('[analytics] trackVisitor threw unexpectedly')
      return null
    } finally {
      visitorTrackingPromise = null
    }
  })()

  return visitorTrackingPromise
}

export async function trackSessionDuration() {
  if (!supabase) return
  if (sessionStorage.getItem(SESSION_TRACKED_KEY) === 'true') return

  const visitorId = sessionStorage.getItem(VISITOR_SESSION_KEY)
  const startedAt = Number(sessionStorage.getItem(SESSION_START_KEY) || Date.now())
  if (!visitorId) return

  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))

  try {
    await trackEvent('profile_session', null, { duration_seconds: durationSeconds })
    sessionStorage.setItem(SESSION_TRACKED_KEY, 'true')
  } catch {
    console.warn('[analytics] trackSessionDuration failed silently')
  }
}

export async function trackEvent(eventType, projectId = null, metadata = null) {
  if (!supabase) return
  try {
    const visitorId = sessionStorage.getItem(VISITOR_SESSION_KEY) || await trackVisitor()
    const { error } = await supabase.from('events').insert({
      visitor_id: visitorId,
      event_type: eventType,
      project_id: projectId,
      metadata,
    })

    if (error) {
      console.warn(`[analytics] Failed to track ${eventType}:`, error.message)
    }
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
