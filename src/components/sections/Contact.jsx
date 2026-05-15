import { useState } from 'react'
import { Download } from 'lucide-react'
import { submitMessage, trackEvent } from '@/lib/analytics'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [checkingResume, setCheckingResume] = useState(false)
  const [resumeUnavailable, setResumeUnavailable] = useState(false)

  function validate() {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Please enter a valid email.'
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.'
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setSubmitError(null)
    const result = await submitMessage(form)
    setLoading(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      setSubmitError(result.error)
    }
  }

  async function handleDownloadResume() {
    setCheckingResume(true)
    setResumeUnavailable(false)

    try {
      const res = await fetch('/resume.pdf', { method: 'HEAD' })
      if (!res.ok) throw new Error('not found')

      await trackEvent('resume_download', null)
      const a = document.createElement('a')
      a.href = '/resume.pdf'
      a.download = 'resume.pdf'
      a.click()
    } catch {
      setResumeUnavailable(true)
    } finally {
      setCheckingResume(false)
    }
  }

  if (submitted) {
    return (
      <section id="contact" className="px-6 py-20 max-w-3xl mx-auto w-full text-center">
        <h2 className="font-display text-2xl text-text-primary mb-3">
          Get in touch
        </h2>
        <p className="font-sans text-base text-text-secondary mb-8">
          Message received — I'll be in touch.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}
          className="font-sans text-sm text-accent hover:underline bg-none border-none cursor-pointer"
        >
          Send another message
        </button>
      </section>
    )
  }

  return (
    <section id="contact" className="px-6 py-20 max-w-lg mx-auto w-full">
      <h2 className="font-display text-2xl text-text-primary mb-3 text-center">
        Get in touch
      </h2>
      <p className="font-sans text-base text-text-secondary mb-8 text-center">
        Have a project in mind or want to connect?
      </p>

      {submitError && (
        <p className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 font-sans">
          {submitError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className={`w-full border rounded-lg bg-surface px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/30 ${
              errors.name ? 'ring-red-300' : 'border-border'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-sans mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full border rounded-lg bg-surface px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/30 ${
              errors.email ? 'ring-red-300' : 'border-border'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-sans mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            rows={5}
            className={`w-full border rounded-lg bg-surface px-4 py-3 text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 ${
              errors.message ? 'ring-red-300' : 'border-border'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs font-sans mt-1">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white rounded-lg px-6 py-3 hover:bg-sky-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-sans font-medium"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className="mt-12 pt-12 border-t border-border">
        <h3 className="font-display text-xl text-text-primary mb-3 text-center">
          Resume
        </h3>
        <p className="font-sans text-base text-text-secondary mb-6 text-center">
          Or download my full resume as a PDF.
        </p>

        {resumeUnavailable ? (
          <p className="font-sans text-sm text-text-secondary text-center">
            Resume temporarily unavailable.
          </p>
        ) : (
          <button
            onClick={handleDownloadResume}
            disabled={checkingResume}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-sans"
          >
            <Download size={18} />
            {checkingResume ? 'Checking...' : 'Download Resume (PDF)'}
          </button>
        )}
      </div>
    </section>
  )
}
