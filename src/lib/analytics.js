import { supabase } from './supabaseClient'

const VISITOR_SESSION_KEY = 'visitor_id'
const USER_ID_KEY = 'portfolio_user_id'
const SESSION_START_KEY = 'profile_session_start'
const SESSION_TRACKED_KEY = 'profile_session_tracked'
const VISITOR_CONTEXT_KEY = 'visitor_context'
const ANALYTICS_APP_ID = 'floyd-portfolio'
let visitorTrackingPromise = null

function resetVisitorSession() {
  sessionStorage.removeItem(VISITOR_SESSION_KEY)
  sessionStorage.removeItem(SESSION_START_KEY)
  sessionStorage.removeItem(SESSION_TRACKED_KEY)
  sessionStorage.removeItem(VISITOR_CONTEXT_KEY)
}

function getDeviceType(userAgent = '') {
  const ua = typeof userAgent === 'string' ? userAgent.toLowerCase() : ''
  if (/ipad|tablet|playbook|silk/.test(ua)) return 'tablet'
  if (/mobi|android|iphone|ipod/.test(ua)) return 'phone'
  return 'computer'
}

function getStoredVisitorContext() {
  try {
    const raw = sessionStorage.getItem(VISITOR_CONTEXT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

async function insertAdminEvent({
  visitorId,
  userId,
  eventType,
  projectId,
  externalTarget,
  metadata,
  pagePath,
  locationData,
  referrer,
  params,
  userAgent,
}) {
  return supabase.from('admin_events').insert({
    app_id: ANALYTICS_APP_ID,
    action: eventType,
    visitor_id: visitorId,
    event_type: eventType,
    project_id: projectId,
    external_target: externalTarget,
    page_path: pagePath,
    country: locationData?.country || null,
    state: locationData?.state || null,
    city: locationData?.city || null,
    location_label: [locationData?.city, locationData?.state].filter(Boolean).join(', ') || null,
    device_type: getDeviceType(userAgent),
    user_agent: userAgent || null,
    referrer: referrer || null,
    utm_source: params?.get('utm_source') || null,
    utm_medium: params?.get('utm_medium') || null,
    utm_campaign: params?.get('utm_campaign') || null,
    utm_term: params?.get('utm_term') || null,
    utm_content: params?.get('utm_content') || null,
    metadata: {
      ...(metadata || {}),
      app_id: ANALYTICS_APP_ID,
      visitor_user_id: userId,
      location_label: [locationData?.city, locationData?.state].filter(Boolean).join(', ') || null,
      device_type: getDeviceType(userAgent),
      referrer: referrer || null,
      utm_source: params?.get('utm_source') || null,
      utm_medium: params?.get('utm_medium') || null,
      utm_campaign: params?.get('utm_campaign') || null,
      utm_term: params?.get('utm_term') || null,
      utm_content: params?.get('utm_content') || null,
    },
  })
}

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
    const referrer = document.referrer || null
    const userAgent = navigator.userAgent
    const pagePath = window.location.pathname

    try {
      const { error } = await insertAdminEvent({
        visitorId,
        userId,
        eventType: 'visit',
        projectId: null,
        externalTarget: null,
        metadata: null,
        pagePath,
        locationData,
        referrer,
        params,
        userAgent,
      })

      if (error) {
        console.warn('[analytics] Failed to track visitor:', error.message)
        return null
      }

      sessionStorage.setItem(VISITOR_SESSION_KEY, visitorId)
      sessionStorage.setItem(SESSION_START_KEY, String(Date.now()))
      sessionStorage.setItem(SESSION_TRACKED_KEY, 'false')
      sessionStorage.setItem(VISITOR_CONTEXT_KEY, JSON.stringify({
        visitorId,
        userId,
        locationData,
        referrer,
        params: Object.fromEntries(params.entries()),
        userAgent,
      }))
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
    const storedContext = getStoredVisitorContext()
    let visitorId = sessionStorage.getItem(VISITOR_SESSION_KEY) || await trackVisitor()
    const params = new URLSearchParams(window.location.search)
    const userId = storedContext?.userId || getOrCreateUserId()
    const locationData = storedContext?.locationData || {}
    const referrer = storedContext?.referrer || document.referrer || null
    const userAgent = storedContext?.userAgent || navigator.userAgent
    const externalTarget = eventType === 'external_profile_click'
      ? metadata?.profile || null
      : null

    let { error } = await insertAdminEvent({
      visitorId,
      userId,
      eventType,
      projectId,
      externalTarget,
      metadata,
      pagePath: window.location.pathname,
      locationData,
      referrer,
      params,
      userAgent,
    })

    if (error && visitorId) {
      console.warn(`[analytics] Retrying ${eventType} after resetting stale visitor session:`, error.message)
      resetVisitorSession()
      visitorId = await trackVisitor()
      const refreshedContext = getStoredVisitorContext()
      ;({ error } = await insertAdminEvent({
        visitorId,
        userId: refreshedContext?.userId || userId,
        eventType,
        projectId,
        externalTarget,
        metadata,
        pagePath: window.location.pathname,
        locationData: refreshedContext?.locationData || locationData,
        referrer: refreshedContext?.referrer || referrer,
        params,
        userAgent: refreshedContext?.userAgent || userAgent,
      }))
    }

    if (error) {
      console.warn(`[analytics] Failed to track ${eventType}:`, error.message)
    }
  } catch (error) {
    console.warn('[analytics] trackEvent failed silently', error)
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
