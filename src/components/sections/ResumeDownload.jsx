import { useState } from 'react'
import { Download } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export default function ResumeDownload() {
  const [checking, setChecking] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  async function handleDownload() {
    setChecking(true)
    setUnavailable(false)

    try {
      const res = await fetch('/resume.pdf', { method: 'HEAD' })
      if (!res.ok) throw new Error('not found')

      await trackEvent('resume_download', null)
      const a = document.createElement('a')
      a.href = '/resume.pdf'
      a.download = 'resume.pdf'
      a.click()
    } catch {
      setUnavailable(true)
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <hr className="border-border" />
      <section className="px-6 py-20 max-w-3xl mx-auto w-full text-center">
        <h2 className="font-display text-2xl text-text-primary mb-3">
          Resume
        </h2>
        <p className="font-sans text-base text-text-secondary mb-8">
          Download my full resume as a PDF.
        </p>

        {unavailable ? (
          <p className="font-sans text-sm text-text-secondary">
            Resume temporarily unavailable —{' '}
            <a href="#contact" className="text-accent hover:underline">
              contact me directly
            </a>
            .
          </p>
        ) : (
          <button
            onClick={handleDownload}
            disabled={checking}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-sans"
          >
            <Download size={18} />
            {checking ? 'Checking...' : 'Download Resume (PDF)'}
          </button>
        )}
      </section>
      <hr className="border-border" />
    </>
  )
}
