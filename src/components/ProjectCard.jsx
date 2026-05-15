export default function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group border border-border rounded-xl bg-surface p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <span className="inline-block bg-accent-subtle text-accent text-xs rounded-full px-2 py-0.5 mb-3">
        {project.category}
      </span>

      <h4 className="font-display text-xl text-text-primary mt-2 mb-2">
        {project.title}
      </h4>

      <p className="font-sans text-sm text-text-secondary line-clamp-3 mb-4">
        {project.description}
      </p>

      <span className="font-sans text-sm text-accent group-hover:underline">
        View details →
      </span>
    </div>
  )
}
