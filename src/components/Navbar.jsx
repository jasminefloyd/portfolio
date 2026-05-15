import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Resume', href: '#contact' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-surface border-b border-border z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#hero" className="hover:opacity-80 transition-opacity scale-150 origin-left">
            <img src="/logo.png" alt="Jasmine Floyd" className="h-8 w-auto" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-sans text-sm text-text-secondary hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-text-primary hover:text-accent transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block font-sans text-sm text-text-secondary hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
