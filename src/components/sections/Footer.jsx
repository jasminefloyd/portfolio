import profile from '../../data/profile.json'

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 text-center text-text-secondary text-sm font-sans">
      {profile.name} · {new Date().getFullYear()} · Built with React & Magic UI
    </footer>
  )
}
