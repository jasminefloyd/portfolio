import { ArrowUpRight, Sparkles } from 'lucide-react'

const categoryStyles = {
  'Internal Tools': {
    bar: 'from-slate-500/40 to-sky-400/50',
    pill: 'bg-slate-100 text-slate-700',
    border: 'group-hover:border-sky-300/70 group-focus-visible:border-sky-300/70',
  },
  'Production Builds': {
    bar: 'from-teal-500/40 to-emerald-400/55',
    pill: 'bg-emerald-100 text-emerald-700',
    border: 'group-hover:border-emerald-300/70 group-focus-visible:border-emerald-300/70',
  },
  'Capstone + Learning': {
    bar: 'from-indigo-500/35 to-amber-300/55',
    pill: 'bg-indigo-100 text-indigo-700',
    border: 'group-hover:border-indigo-300/70 group-focus-visible:border-indigo-300/70',
  },
}

export default function ProjectCard({ project, onClick, index = 0 }) {
  const style = categoryStyles[project.category] ?? categoryStyles['Internal Tools']
  const keyOutcome = project.outcomes?.[1] ?? project.outcomes?.[0] ?? 'Shipped a meaningful result'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`project-card-enter group relative text-left border border-border rounded-xl bg-surface p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.09)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_16px_36px_rgba(15,23,42,0.09)] focus-visible:outline-none ${style.border} h-full flex flex-col`}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <span className={`absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r ${style.bar}`} />

      <h4 className="font-display text-[1.75rem] text-text-primary mt-4 mb-2 leading-[1.1] tracking-tight">
        {project.title}
      </h4>

      <p className="font-sans text-sm text-text-secondary mb-5 min-h-[3.9rem]">
        {project.description}
      </p>

      <div className="mt-auto flex items-start gap-2 text-xs text-text-secondary mb-4 min-h-[3.25rem]">
        <Sparkles size={14} className="mt-0.5 text-accent flex-shrink-0" />
        <p>
          Key outcome: {keyOutcome}
        </p>
      </div>

      <div className="border-t border-border/80 pt-2 flex items-center justify-between text-sm text-text-secondary group-hover:text-text-primary group-focus-visible:text-text-primary transition-colors">
        <span>View details</span>
        <ArrowUpRight size={15} />
      </div>
    </button>
  )
}
