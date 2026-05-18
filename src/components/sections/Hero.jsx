import { Linkedin, Github, FileText } from 'lucide-react'
import profile from '../../data/profile.json'
import CertificationsCarousel from '../CertificationsCarousel'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-5 sm:px-6 py-16 sm:py-20">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,560px)_360px] gap-12 lg:gap-16 items-center justify-center">
          {/* Left: Content */}
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl text-text-primary mb-6 leading-tight">
              {profile.name}
            </h1>

            <p className="font-sans text-xl text-text-secondary mb-6">
              {profile.title}
            </p>

            <p className="font-sans text-base text-text-secondary leading-relaxed mb-12">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6">
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

            <CertificationsCarousel className="mt-8" />
          </div>

          {/* Right: Profile Photo */}
          {profile.photo && (
            <div className="flex flex-col items-center">
              <div className="flex justify-center relative w-[17rem] h-[17.5rem] sm:w-[22rem] sm:h-[22.75rem]">
                <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 w-[17rem] h-[17.5rem] sm:w-[22rem] sm:h-[22.75rem] rounded-[1.5rem] sm:rounded-[2.1rem] bg-gradient-to-br from-blue-200/85 to-blue-100/70 shadow-[0_18px_44px_rgba(14,165,233,0.22)] z-0" />
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="relative z-10 w-[17rem] h-[17.5rem] sm:w-[22rem] sm:h-[22.75rem] rounded-[1.5rem] sm:rounded-[2.1rem] object-cover shadow-[0_14px_32px_rgba(15,23,42,0.18)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
