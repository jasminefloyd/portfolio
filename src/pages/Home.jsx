import Hero from '../components/sections/Hero'
import Projects from '../components/sections/Projects'
import Contact from '../components/sections/Contact'
import Footer from '../components/sections/Footer'

export default function Home() {
  return (
    <main className="pt-16">
      <section id="hero">
        <Hero />
      </section>

      <section id="projects">
        <Projects />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </main>
  )
}
