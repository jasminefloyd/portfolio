import { useEffect } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    trackEvent('project_open', project.id)
  }, [project.id])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <span className="inline-block bg-accent-subtle text-accent text-xs rounded-full px-2 py-0.5 mb-4">
          {project.category}
        </span>

        <h2 className="font-display text-2xl text-text-primary mb-2">
          {project.title}
        </h2>

        <p className="font-sans text-base text-text-secondary mb-6">
          {project.description}
        </p>

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

        <div className="mb-6">
          <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-3">
            Outcomes
          </p>
          <ul className="space-y-2">
            {project.outcomes.map((outcome, i) => (
              <li key={i} className="flex gap-3 items-start">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="font-sans text-base text-text-primary leading-relaxed">
                  {outcome}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {(project.links.github || project.links.demo) && (
          <div className="flex gap-3">
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
  )
}
