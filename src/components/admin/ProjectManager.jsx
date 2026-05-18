import { useMemo, useState } from 'react'
import baseProjectsData from '../../data/projects.json'

const STORAGE_KEY = 'admin_projects_data'

const blankProject = {
  id: '',
  title: '',
  category: 'Production Builds',
  description: '',
  role: '',
  techStack: [],
  aiAgentArch: '',
  outcomes: [],
  links: { github: '', demo: '' },
}

function parseLines(value) {
  return value
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean)
}

export default function ProjectManager() {
  const initialData = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return baseProjectsData
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.categories)) return baseProjectsData
      return parsed
    } catch {
      return baseProjectsData
    }
  }, [])

  const [categories] = useState(initialData.categories)
  const [projects, setProjects] = useState(initialData.projects)
  const [editingIndex, setEditingIndex] = useState(0)
  const [status, setStatus] = useState('')

  const active = projects[editingIndex] || blankProject

  function persist(nextCategories, nextProjects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories: nextCategories, projects: nextProjects }))
    setStatus('Saved')
    setTimeout(() => setStatus(''), 1200)
  }

  function updateActive(patch) {
    const next = [...projects]
    next[editingIndex] = { ...active, ...patch }
    setProjects(next)
  }

  function updateLinks(field, value) {
    updateActive({
      links: {
        ...active.links,
        [field]: value,
      },
    })
  }

  function addProject() {
    const next = [...projects, { ...blankProject, id: `new-project-${projects.length + 1}` }]
    setProjects(next)
    setEditingIndex(next.length - 1)
  }

  function removeProject(index) {
    if (!projects[index]) return
    const next = projects.filter((_, i) => i !== index)
    setProjects(next)
    setEditingIndex(Math.max(0, Math.min(editingIndex, next.length - 1)))
  }

  function moveProject(index, direction) {
    const target = index + direction
    if (target < 0 || target >= projects.length) return
    const next = [...projects]
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    setProjects(next)
    setEditingIndex(target)
  }

  return (
    <section className="border border-border rounded-xl p-3 sm:p-5 bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-xl text-text-primary">Manage Projects</h2>
        <div className="flex items-center gap-2">
          {status && <span className="text-xs text-emerald-700 font-sans">{status}</span>}
          <button onClick={addProject} className="text-xs px-3 py-2 rounded border border-border hover:bg-bg">Add New</button>
          <button onClick={() => persist(categories, projects)} className="text-xs px-3 py-2 rounded bg-text-primary text-surface">Save All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4">
        <div className="border border-border rounded-lg p-3 max-h-[40vh] lg:max-h-[65vh] overflow-auto">
          {projects.map((project, index) => (
            <div key={`${project.id}-${index}`} className={`mb-2 p-2 rounded border ${index === editingIndex ? 'border-accent bg-accent-subtle' : 'border-border'}`}>
              <button className="text-left w-full" onClick={() => setEditingIndex(index)}>
                <p className="text-sm font-medium text-text-primary">{project.title || 'Untitled Project'}</p>
                <p className="text-xs text-text-secondary">{project.category}</p>
              </button>
              <div className="mt-2 flex gap-2">
                <button onClick={() => moveProject(index, -1)} className="text-xs px-2 py-1 border rounded">Up</button>
                <button onClick={() => moveProject(index, 1)} className="text-xs px-2 py-1 border rounded">Down</button>
                <button onClick={() => removeProject(index)} className="text-xs px-2 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <input value={active.id} onChange={(e) => updateActive({ id: e.target.value })} placeholder="id" className="w-full border border-border rounded px-3 py-2 text-sm" />
          <input value={active.title} onChange={(e) => updateActive({ title: e.target.value })} placeholder="title" className="w-full border border-border rounded px-3 py-2 text-sm" />
          <select value={active.category} onChange={(e) => updateActive({ category: e.target.value })} className="w-full border border-border rounded px-3 py-2 text-sm">
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <textarea value={active.description} onChange={(e) => updateActive({ description: e.target.value })} placeholder="description" rows={3} className="w-full border border-border rounded px-3 py-2 text-sm" />
          <input value={active.role} onChange={(e) => updateActive({ role: e.target.value })} placeholder="role" className="w-full border border-border rounded px-3 py-2 text-sm" />
          <textarea value={(active.techStack || []).join('\n')} onChange={(e) => updateActive({ techStack: parseLines(e.target.value) })} placeholder="tech stack (one per line)" rows={3} className="w-full border border-border rounded px-3 py-2 text-sm" />
          <textarea value={active.aiAgentArch || ''} onChange={(e) => updateActive({ aiAgentArch: e.target.value })} placeholder="aiAgentArch" rows={3} className="w-full border border-border rounded px-3 py-2 text-sm" />
          <textarea value={(active.outcomes || []).join('\n')} onChange={(e) => updateActive({ outcomes: parseLines(e.target.value) })} placeholder="outcomes (one per line)" rows={4} className="w-full border border-border rounded px-3 py-2 text-sm" />
          <input value={active.links?.github || ''} onChange={(e) => updateLinks('github', e.target.value)} placeholder="github link" className="w-full border border-border rounded px-3 py-2 text-sm" />
          <input value={active.links?.demo || ''} onChange={(e) => updateLinks('demo', e.target.value)} placeholder="demo link" className="w-full border border-border rounded px-3 py-2 text-sm" />
        </div>
      </div>
    </section>
  )
}
