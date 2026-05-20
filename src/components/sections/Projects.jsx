import { useState } from 'react'
import { useProjects } from '../../hooks/useProjects'
import ProjectCard from '../ProjectCard'
import ProjectModal from '../ProjectModal'
import { trackEvent } from '@/lib/analytics'

export default function Projects() {
  const { categories, getByCategory } = useProjects()
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section className="projects-surface px-5 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto w-full rounded-[1.5rem] sm:rounded-[2rem]">
      <h2 className="font-display text-3xl md:text-4xl text-text-primary mb-12 sm:mb-16">
        Projects
      </h2>

      {categories.map((category, categoryIndex) => (
        <div key={category} className="mb-16 last:mb-0">
          <h3 className="font-sans text-base uppercase tracking-[0.14em] text-text-secondary mb-8">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {getByCategory(category).map((project, projectIndex) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={categoryIndex * 3 + projectIndex}
                onClick={() => {
                  trackEvent('project_open', project.id)
                  setSelectedProject(project)
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
