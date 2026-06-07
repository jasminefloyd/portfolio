import { useEffect, useMemo, useState } from 'react'
import { fetchAdminData, saveProjects } from '../../lib/adminApi'
import baseProjectsData from '../../data/projects.json'
const DEFAULT_CATEGORY = 'Production Builds + Experiments'

const blankProject = {
  id: '',
  title: '',
  category: DEFAULT_CATEGORY,
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

function Field({ label, help, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block font-sans text-xs uppercase tracking-[0.12em] text-text-secondary">
        {label}
      </span>
      {children}
      {help && (
        <span className="block font-sans text-xs text-text-secondary">
          {help}
        </span>
      )}
    </label>
  )
}

export default function ProjectManager() {
  const initialData = useMemo(() => {
    return baseProjectsData
  }, [])

  const [categories] = useState(initialData.categories)
  const [projects, setProjects] = useState(initialData.projects)
  const [editingIndex, setEditingIndex] = useState(0)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const active = projects[editingIndex] || blankProject
  const keyOutcome = active.outcomes?.[1] || active.outcomes?.[0] || 'Add at least one outcome to populate the card preview.'

  useEffect(() => {
    let activeMount = true

    async function loadProjects() {
      try {
        const rows = await fetchAdminData('portfolio_projects')
        if (!activeMount) return

        if (Array.isArray(rows) && rows.length > 0) {
          const hydratedProjects = rows.map((row) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            description: row.description,
            role: row.role,
            techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
            aiAgentArch: row.ai_agent_arch || '',
            outcomes: Array.isArray(row.outcomes) ? row.outcomes : [],
            links: {
              github: row.github_url || '',
              demo: row.demo_url || '',
            },
          }))

          setProjects(hydratedProjects)
        }
      } catch {
        if (activeMount) {
          setError('Could not load projects from the database. Showing fallback data.')
        }
      } finally {
        if (activeMount) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      activeMount = false
    }
  }, [])

  async function persist(nextCategories, nextProjects) {
    setSaving(true)
    setError('')
    try {
      await saveProjects(nextCategories, nextProjects)
      setStatus('Saved to database')
      setTimeout(() => setStatus(''), 1600)
    } catch {
      setError('Failed to save projects to the database.')
    } finally {
      setSaving(false)
    }
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
          {error && <span className="text-xs text-red-600 font-sans">{error}</span>}
          <button onClick={addProject} className="text-xs px-3 py-2 rounded border border-border hover:bg-bg">Add New</button>
          <button onClick={() => persist(categories, projects)} disabled={saving || loading} className="text-xs px-3 py-2 rounded bg-text-primary text-surface disabled:opacity-60 disabled:cursor-not-allowed">{saving ? 'Saving...' : 'Save All'}</button>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-border bg-bg/60 p-4 mb-4 font-sans text-sm text-text-secondary">
          Loading projects from the database...
        </div>
      )}

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

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-bg/60 p-4">
            <h3 className="font-sans text-sm font-semibold text-text-primary mb-2">
              Editable Frontend Fields
            </h3>
            <p className="font-sans text-sm text-text-secondary">
              These inputs map directly to the public project card and project detail modal. No extra admin-only fields are included here.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Field
                label="Project ID"
                help="Used for analytics and project lookup. Keep this stable once the project is live."
              >
                <input value={active.id} onChange={(e) => updateActive({ id: e.target.value })} placeholder="project-id" className="w-full border border-border rounded px-3 py-2 text-sm bg-surface" />
              </Field>

              <Field label="Title" help="Shown on the project card and at the top of the detail modal.">
                <input value={active.title} onChange={(e) => updateActive({ title: e.target.value })} placeholder="Project title" className="w-full border border-border rounded px-3 py-2 text-sm bg-surface" />
              </Field>

              <Field label="Category" help="Shown as the section grouping and category pill in the detail modal.">
                <select value={active.category} onChange={(e) => updateActive({ category: e.target.value })} className="w-full border border-border rounded px-3 py-2 text-sm bg-surface">
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </Field>

              <Field label="Description" help="Used on the card and repeated as the opening summary in the detail modal.">
                <textarea value={active.description} onChange={(e) => updateActive({ description: e.target.value })} placeholder="Short project summary" rows={4} className="w-full border border-border rounded px-3 py-2 text-sm bg-surface resize-none" />
              </Field>

              <Field label="Role" help="Shown under the “My Role” section in the detail modal.">
                <input value={active.role} onChange={(e) => updateActive({ role: e.target.value })} placeholder="Your role" className="w-full border border-border rounded px-3 py-2 text-sm bg-surface" />
              </Field>
            </div>

            <div className="space-y-4">
              <Field label="Tech Stack" help="Shown in the detail modal as a comma-separated list. Enter one item per line.">
                <textarea value={(active.techStack || []).join('\n')} onChange={(e) => updateActive({ techStack: parseLines(e.target.value) })} placeholder="React&#10;Supabase&#10;Claude API" rows={5} className="w-full border border-border rounded px-3 py-2 text-sm bg-surface resize-none" />
              </Field>

              <Field label="Agent Architecture" help="Only shows in the detail modal when this field has content.">
                <textarea value={active.aiAgentArch || ''} onChange={(e) => updateActive({ aiAgentArch: e.target.value })} placeholder="Describe the workflow or agent system" rows={5} className="w-full border border-border rounded px-3 py-2 text-sm bg-surface resize-none" />
              </Field>

              <Field label="Outcomes" help="Shown in the detail modal. The project card uses the second outcome first, then falls back to the first. Enter one outcome per line.">
                <textarea value={(active.outcomes || []).join('\n')} onChange={(e) => updateActive({ outcomes: parseLines(e.target.value) })} placeholder="Outcome one&#10;Outcome two&#10;Outcome three" rows={6} className="w-full border border-border rounded px-3 py-2 text-sm bg-surface resize-none" />
              </Field>

              <Field label="GitHub Link" help="Shows a GitHub button in the detail modal when populated. Leave blank to hide it.">
                <input value={active.links?.github || ''} onChange={(e) => updateLinks('github', e.target.value)} placeholder="https://github.com/..." className="w-full border border-border rounded px-3 py-2 text-sm bg-surface" />
              </Field>

              <Field label="Live Demo Link" help="Shows a Live Demo button in the detail modal when populated. Leave blank to hide it.">
                <input value={active.links?.demo || ''} onChange={(e) => updateLinks('demo', e.target.value)} placeholder="https://example.com" className="w-full border border-border rounded px-3 py-2 text-sm bg-surface" />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="font-sans text-sm font-semibold text-text-primary mb-4">
                Card Preview
              </h3>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h4 className="font-display text-2xl text-text-primary mb-2 leading-tight">
                  {active.title || 'Project title'}
                </h4>
                <p className="font-sans text-sm text-text-secondary mb-5 min-h-[4rem]">
                  {active.description || 'Project description will appear here.'}
                </p>
                <div className="mt-auto flex items-start gap-2 text-xs text-text-secondary mb-4 min-h-[3.25rem]">
                  <span className="text-accent">Key outcome:</span>
                  <p>{keyOutcome}</p>
                </div>
                <div className="border-t border-border/80 pt-2 flex items-center justify-between text-sm text-text-secondary">
                  <span>View details</span>
                  <span>Open</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="font-sans text-sm font-semibold text-text-primary mb-4">
                Detail Modal Preview
              </h3>
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="border-b border-border px-4 py-4">
                  <span className="inline-block bg-accent-subtle text-accent text-xs rounded-full px-2 py-0.5 mb-3">
                    {active.category || DEFAULT_CATEGORY}
                  </span>
                  <h4 className="font-display text-xl text-text-primary leading-tight">
                    {active.title || 'Project title'}
                  </h4>
                </div>
                <div className="px-4 py-4 space-y-5">
                  <p className="font-sans text-sm text-text-secondary">
                    {active.description || 'Project description will appear here.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="border border-border rounded-lg p-3 bg-slate-50/60">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-1">Timeline</p>
                      <p className="text-sm text-text-primary">{active.category === 'Capstone + Learning' ? '4-8 weeks' : '6-12 weeks'}</p>
                    </div>
                    <div className="border border-border rounded-lg p-3 bg-slate-50/60">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-1">Team</p>
                      <p className="text-sm text-text-primary">{active.category === 'Capstone + Learning' ? 'Solo' : '2-6 collaborators'}</p>
                    </div>
                    <div className="border border-border rounded-lg p-3 bg-slate-50/60">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-1">Stage</p>
                      <p className="text-sm text-text-primary">{active.category === 'Capstone + Learning' ? 'Learning Build' : 'Production Pilot'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-2">My Role</p>
                      <p className="font-sans text-sm text-text-primary">{active.role || 'Role will appear here.'}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-2">Tech Stack</p>
                      <p className="font-sans text-sm text-text-primary">
                        {active.techStack?.length ? active.techStack.join(', ') : 'Tech stack will appear here.'}
                      </p>
                    </div>
                  </div>

                  {active.aiAgentArch ? (
                    <div className="bg-accent-subtle rounded-lg p-4">
                      <p className="font-sans text-xs uppercase tracking-wider text-accent mb-2">Agent Architecture</p>
                      <p className="font-sans text-sm text-text-primary leading-relaxed">{active.aiAgentArch}</p>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border rounded-lg p-4 text-sm text-text-secondary">
                      Agent Architecture stays hidden on the frontend until you add content here.
                    </div>
                  )}

                  <div>
                    <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-3">Outcomes</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(active.outcomes?.length ? active.outcomes : ['Add outcomes to preview this section.']).map((outcome, i) => (
                        <div key={`${outcome}-${i}`} className="border border-border rounded-lg p-3 bg-white">
                          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-2">Metric {i + 1}</p>
                          <p className="font-sans text-sm text-text-primary leading-relaxed">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(active.links?.github || active.links?.demo) && (
                    <div className="flex flex-wrap gap-3">
                      {active.links?.github && <span className="border border-border text-accent px-4 py-2 rounded-lg text-sm">GitHub</span>}
                      {active.links?.demo && <span className="border border-border text-accent px-4 py-2 rounded-lg text-sm">Live Demo</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
