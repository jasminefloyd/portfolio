import { useEffect } from 'react'
import { X, CheckCircle2, CalendarClock, Users, BriefcaseBusiness } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    trackEvent('project_open', project.id)
  }, [project.id])

  const snapshotStage = project.category === 'Capstone + Learning' ? 'Learning Build' : 'Production Pilot'
  const snapshotTimeline = project.category === 'Capstone + Learning' ? '4-8 weeks' : '6-12 weeks'
  const snapshotTeam = project.category === 'Capstone + Learning' ? 'Solo' : '2-6 collaborators'

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl sm:rounded-2xl p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-border px-4 sm:px-8 py-4 sm:py-5 flex items-start justify-between gap-4">
          <div>
            <span className="inline-block bg-accent-subtle text-accent text-xs rounded-full px-2 py-0.5 mb-3">
              {project.category}
            </span>
            <h2 className="font-display text-xl sm:text-2xl text-text-primary leading-tight">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-4 sm:px-8 py-5 sm:py-6">
          <p className="font-sans text-base text-text-secondary mb-6">
            {project.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="border border-border rounded-lg p-3 bg-slate-50/60">
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-1">Timeline</p>
              <p className="text-sm text-text-primary flex items-center gap-2"><CalendarClock size={14} className="text-accent" />{snapshotTimeline}</p>
            </div>
            <div className="border border-border rounded-lg p-3 bg-slate-50/60">
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-1">Team</p>
              <p className="text-sm text-text-primary flex items-center gap-2"><Users size={14} className="text-accent" />{snapshotTeam}</p>
            </div>
            <div className="border border-border rounded-lg p-3 bg-slate-50/60">
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-1">Stage</p>
              <p className="text-sm text-text-primary flex items-center gap-2"><BriefcaseBusiness size={14} className="text-accent" />{snapshotStage}</p>
            </div>
          </div>

          <hr className="border-border mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-2">
                My Role
              </p>
              <p className="font-sans text-base text-text-primary">
                {project.role}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-2">
                Tech Stack
              </p>
              <p className="font-sans text-base text-text-primary">
                {project.techStack.join(', ')}
              </p>
            </div>
          </div>

          {project.aiAgentArch && (
            <div className="bg-accent-subtle rounded-lg p-4 mb-6">
              <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">
                Agent Architecture
              </p>
              <p className="font-sans text-base text-text-primary leading-relaxed">
                {project.aiAgentArch}
              </p>
            </div>
          )}

          <hr className="border-border mb-6" />

          <div className="mb-6">
            <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-3">
              Outcomes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.outcomes.map((outcome, i) => (
                <div key={i} className="border border-border rounded-lg p-3 bg-white">
                  <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-2">Metric {i + 1}</p>
                  <p className="flex gap-2 items-start text-text-primary">
                    <CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-sm leading-relaxed">{outcome}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {(project.links.github || project.links.demo) && (
            <div className="flex flex-wrap gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-border text-accent px-4 py-2 rounded-lg hover:bg-accent-subtle transition-colors font-sans text-sm"
                >
                  GitHub
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-border text-accent px-4 py-2 rounded-lg hover:bg-accent-subtle transition-colors font-sans text-sm"
                >
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
