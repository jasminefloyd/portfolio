import { useState } from 'react'
import { useProjects } from '../../hooks/useProjects'
import ProjectCard from '../ProjectCard'
import ProjectModal from '../ProjectModal'

export default function Projects() {
  const { categories, getByCategory } = useProjects()
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto w-full">
      <h2 className="font-display text-3xl text-text-primary mb-16">
        Projects
      </h2>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h3 className="font-sans text-sm uppercase tracking-wider text-text-secondary mb-8">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {getByCategory(category).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
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
