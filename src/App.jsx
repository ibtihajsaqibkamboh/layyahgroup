import { useEffect, useState } from 'react'
import { initSmoothScroll, ScrollTrigger } from './lib/motion.js'
import Preloader from './components/Preloader.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Showcase from './components/Showcase.jsx'
import Gallery from './components/Gallery.jsx'
import WhyUs from './components/WhyUs.jsx'
import Contact from './components/Contact.jsx'
import Footer, { FloatingActions } from './components/Footer.jsx'

const PH = '[Add your figure]'

export default function App() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const stop = initSmoothScroll()
    // Recalculate trigger positions once fonts and images have settled.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh)
    return () => {
      stop()
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Preloader onReveal={() => setRevealed(true)} />
      <Nav />
      <main id="main">
        <Hero revealed={revealed} />
        <About />
        <Services />
        <Showcase
          id="residential"
          tone="light"
          eyebrow="Residential projects"
          title="Villas and homes, detailed for daily life."
          intro="Contemporary villas and family houses where natural light, privacy and craftsmanship are planned from the first drawing."
          category="residential"
          deliverables={['Architectural & interior design', 'Grey structure through to finishing', 'Plumbing, electrical & HVAC', 'Boundary walls, landscaping & pools']}
          specs={[['Typical timeline', PH], ['Rates from', PH]]}
          cta="Get a residential quote"
        />
        <Showcase
          id="commercial"
          tone="dark"
          flip
          eyebrow="Commercial plazas"
          title="Plazas and shopping centres that draw people in."
          intro="Retail and office buildings planned for visibility, footfall and flexible tenant layouts, with façades that work as the building's signboard."
          category="commercial"
          deliverables={['Shop & office floor planning', 'Glazed façades & signage bands', 'Basement parking & services', 'Fire safety & lift coordination']}
          specs={[['Typical timeline', PH], ['Rates from', PH]]}
          cta="Get a commercial quote"
        />
        <Showcase
          id="high-rise"
          tone="light"
          eyebrow="High-rise buildings"
          title="Multi-storey buildings engineered floor by floor."
          intro="Apartment blocks and mixed-use towers with structural design, vertical transport and services coordinated before the first column is poured."
          category="highrise"
          deliverables={['RCC frame & foundation design', 'Typical floor & unit planning', 'Lifts, water, fire & electrical risers', 'Phased construction & handover']}
          specs={[['Floors delivered', PH], ['Typical timeline', PH]]}
          cta="Discuss a high-rise project"
        />
        <Gallery />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
