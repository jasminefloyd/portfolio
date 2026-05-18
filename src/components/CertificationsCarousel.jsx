import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Award } from 'lucide-react'
import certifications from '../data/certifications.json'

export default function CertificationsCarousel({ className = '' }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % certifications.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + certifications.length) % certifications.length)
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % certifications.length)
  }

  const active = certifications[activeIndex]
  const isInProgress = active.issued.toLowerCase() === 'in progress'

  return (
    <div className={`mt-7 w-full rounded-2xl border border-border/80 bg-white/85 backdrop-blur-sm shadow-[0_10px_24px_rgba(15,23,42,0.08)] px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[0.68rem] tracking-[0.18em] uppercase text-text-secondary">Recent Certifications</p>
        <Award size={15} className="text-accent" />
      </div>

      <div className="min-h-[64px] grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 sm:gap-5 items-start">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-text-primary leading-snug">{active.title}</p>
          <p className="mt-1 text-sm text-text-secondary">{active.issuer}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs text-text-secondary">{isInProgress ? `Status: ${active.issued}` : `Issued ${active.issued}`}</p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {certifications.map((item, index) => (
            <span
              key={item.credentialId}
              className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-4 bg-accent/80' : 'w-1.5 bg-border'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous certification"
            className="h-7 w-7 rounded-full border border-border text-text-secondary hover:text-accent hover:border-accent/50 transition-colors grid place-items-center"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next certification"
            className="h-7 w-7 rounded-full border border-border text-text-secondary hover:text-accent hover:border-accent/50 transition-colors grid place-items-center"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
