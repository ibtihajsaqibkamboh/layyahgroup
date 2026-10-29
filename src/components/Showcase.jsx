import { useRef } from 'react'
import { useReveal, tiltHandlers, scrollToId } from '../lib/motion.js'
import { projects, facadeFor } from '../data/projects.js'
import Media from './Media.jsx'
import { SplitWords, Fill, Eyebrow } from './Text.jsx'
import { IconArrow } from './Icons.jsx'

/* A project card: image reveal on scroll, zoom + drawn gold corners + caption lift on hover. */
export function ProjectCard({ project, size = 'md', onOpen, index = 0 }) {
  const interactive = !!onOpen
  return (
    <article
      className={`p-card p-card-${size} tilt ${interactive ? 'is-interactive' : ''}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onOpen(project) : undefined}
      onKeyDown={interactive ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(project)) : undefined}
      aria-label={interactive ? `View larger: ${project.title}` : undefined}
      {...tiltHandlers(4)}
    >
      <Media
        photo={project.photo}
        alt={project.title.replace('Sample: ', '')}
        variant={facadeFor(project.category)}
        seed={index + 2}
        sizes={size === 'lg' ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 30vw, 100vw'}
      />
      <span className="p-corner p-corner-tl" aria-hidden="true" />
      <span className="p-corner p-corner-br" aria-hidden="true" />
      <span className="p-caption">
        <span className="p-scope">{project.scope}</span>
        <span className="p-title">{project.title}</span>
        <span className="p-meta">
          <Fill>{project.place}</Fill> · <Fill>{project.year}</Fill>
        </span>
      </span>
    </article>
  )
}

/*
 * One category section (Residential, Commercial, High-Rise).
 * tone: 'light' | 'dark' — alternates the page rhythm.
 */
export default function Showcase({ id, tone, eyebrow, title, intro, category, deliverables, specs, cta, flip = false }) {
  const ref = useRef(null)
  useReveal(ref)
  const items = projects.filter((p) => p.category === category).slice(0, 3)
  return (
    <section id={id} className={`section section-${tone} showcase ${flip ? 'is-flipped' : ''}`} ref={ref}>
      <div className="container showcase-grid">
        <div className="showcase-copy">
          <Eyebrow light={tone === 'dark'}>{eyebrow}</Eyebrow>
          <h2 className="h2" data-reveal="split">
            <SplitWords text={title} />
          </h2>
          <p className="lead" data-reveal="up">
            {intro}
          </p>
          <span className="rule" data-reveal="line" />
          <ul className="deliverables" data-reveal="up">
            {deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <dl className="specs" data-reveal="up">
            {specs.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <a href="#contact" className="btn btn-gold" data-reveal="up" onClick={(e) => (e.preventDefault(), scrollToId('contact'))}>
            {cta} <IconArrow width={18} height={18} />
          </a>
        </div>

        <div className="showcase-cards">
          {items.map((p, i) => (
            <ProjectCard key={p.id} project={p} size={i === 0 ? 'lg' : 'sm'} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
