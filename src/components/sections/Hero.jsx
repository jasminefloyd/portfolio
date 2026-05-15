import { Linkedin, Github, FileText } from 'lucide-react'
import profile from '../../data/profile.json'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-5xl text-text-primary mb-6 leading-tight">
              {profile.name}
            </h1>

            <p className="font-sans text-xl text-text-secondary mb-6">
              {profile.title}
            </p>

            <p className="font-sans text-base text-text-secondary leading-relaxed mb-12">
              {profile.bio}
            </p>

            <div className="flex gap-6">
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <Linkedin size={20} />
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <Github size={20} />
                  <span className="text-sm">GitHub</span>
                </a>
              )}
              {profile.socials.substack && (
                <a
                  href={profile.socials.substack}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <FileText size={20} />
                  <span className="text-sm">Substack</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: Profile Photo */}
          {profile.photo && (
            <div className="flex justify-center lg:justify-end relative w-80 h-80">
              <div className="absolute -bottom-8 -right-8 bg-blue-200/20 rounded-3xl w-80 h-80 -z-10" />
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-80 h-80 rounded-3xl object-cover shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
