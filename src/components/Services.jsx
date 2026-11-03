import { useRef } from 'react'
import { useReveal, tiltHandlers, scrollToId } from '../lib/motion.js'
import { IconVilla, IconPlaza, IconTower, IconCrane, IconCompass, IconClipboard, IconArrow } from './Icons.jsx'
import { SplitWords, Eyebrow } from './Text.jsx'

const SERVICES = [
  {
    icon: IconVilla,
    title: 'Luxury Houses & Villas',
    text: 'Custom homes designed around how your family lives, built with premium materials and careful detailing.',
    items: ['Architectural & interior design', 'Grey structure & finishing', 'Landscaping & pools'],
  },
  {
    icon: IconPlaza,
    title: 'Commercial Plazas & Shopping Centres',
    text: 'Retail and office plazas planned for footfall, frontage and tenant flexibility.',
    items: ['Shop & office layouts', 'Glazed façades & signage bands', 'Parking & services planning'],
  },
  {
    icon: IconTower,
    title: 'Multi-Storey Buildings & Apartments',
    text: 'Apartment blocks and mixed-use towers engineered for structure, safety and long-term value.',
    items: ['RCC frame structures', 'Lifts, fire & MEP coordination', 'Typical floor optimisation'],
  },
  {
    icon: IconCrane,
    title: 'Concrete Pumping & Structural Works',
    text: 'Our own boom-pump fleet places concrete quickly and precisely, with reinforcement and grey structure done in-house.',
    items: ['Boom concrete pumping', 'Foundations, columns, beams & slabs', 'Grey structure & masonry'],
  },
  {
    icon: IconCompass,
    title: 'Architectural Design',
    text: 'Concept to working drawings, with 3D views so you can see the building before it is built.',
    items: ['Concept & 3D visualisation', 'Approval drawings', 'Structural & MEP drawings'],
  },
  {
    icon: IconClipboard,
    title: 'Project Management',
    text: 'One point of contact for budget, schedule and quality, with clear reporting at every stage.',
    items: ['Cost estimates & BOQ', 'Schedules & milestones', 'Progress reports'],
  },
]

export default function Services() {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section id="services" className="section section-dark services" ref={ref}>
      <div className="container">
        <div className="section-head">
          <Eyebrow light>Our services</Eyebrow>
          <h2 className="h2" data-reveal="split">
            <SplitWords text="Everything from the first sketch to the final key." />
          </h2>
          <p className="lead" data-reveal="up">
            Design, construction and management under one contract, for homes, commercial plazas and high-rise
            buildings.
          </p>
        </div>

        <div className="service-grid">
          {SERVICES.map((s, i) => (
            <article className="service-card tilt" key={s.title} data-reveal="up" data-delay={(i % 3) * 0.08} {...tiltHandlers(5)}>
              <div className="service-glow" aria-hidden="true" />
              <s.icon className="service-icon" width={36} height={36} />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <a href="#contact" className="link-arrow" onClick={(e) => (e.preventDefault(), scrollToId('contact'))}>
                Get a quote <IconArrow width={16} height={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
