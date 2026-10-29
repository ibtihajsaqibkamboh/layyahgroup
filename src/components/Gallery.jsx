import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, Flip, ScrollTrigger, useReveal, prefersReducedMotion, lockScroll, unlockScroll } from '../lib/motion.js'
import { projects, categories, facadeFor } from '../data/projects.js'
import { ProjectCard } from './Showcase.jsx'
import Media from './Media.jsx'
import { SplitWords, Fill, Eyebrow } from './Text.jsx'
import { IconClose, IconArrow, IconArrowLeft } from './Icons.jsx'

function Lightbox({ list, index, onClose, onStep }) {
  const ref = useRef(null)
  const p = list[index]

  useEffect(() => {
    lockScroll()
    const prevFocus = document.activeElement
    ref.current.querySelector('.lb-close').focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
      if (e.key === 'Tab') {
        // keep focus inside the dialog
        const f = ref.current.querySelectorAll('button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus())
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus())
      }
    }
    window.addEventListener('keydown', onKey)
    if (!prefersReducedMotion()) gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
      if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(ref.current.querySelector('.lb-figure'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' })
  }, [index])

  return (
    <div className="lightbox" ref={ref} role="dialog" aria-modal="true" aria-label={p.title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="lb-close" onClick={onClose}>
        <IconClose /> <span>Close</span>
      </button>
      <figure className="lb-figure">
        <Media key={p.id} photo={p.photo} alt={p.title} variant={facadeFor(p.category)} seed={index + 7} reveal={false} sizes="90vw" eager />
        <figcaption>
          <span className="p-scope">{p.scope}</span>
          <strong>{p.title}</strong>
          <span>
            <Fill>{p.place}</Fill> · <Fill>{p.year}</Fill> · {index + 1} / {list.length}
          </span>
        </figcaption>
      </figure>
      <div className="lb-nav">
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous project">
          <IconArrowLeft />
        </button>
        <button type="button" onClick={() => onStep(1)} aria-label="Next project">
          <IconArrow />
        </button>
      </div>
    </div>
  )
}

export default function Gallery() {
  const ref = useRef(null)
  const gridRef = useRef(null)
  const flipState = useRef(null)
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(-1)
  useReveal(ref)

  const visible = projects.filter((p) => filter === 'all' || p.category === filter)

  const choose = (id) => {
    if (id === filter) return
    if (!prefersReducedMotion()) flipState.current = Flip.getState(gridRef.current.querySelectorAll('.g-item'))
    setFilter(id)
  }

  // Animate the re-layout after the filter changes.
  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.75,
      ease: 'power3.inOut',
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    })
    flipState.current = null
  }, [filter])

  // Cards cascade in the first time the grid scrolls into view.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.g-item .p-card', {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.from(batch, { y: 60, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }),
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  const count = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.category === id).length)

  return (
    <section id="projects" className="section section-light gallery" ref={ref}>
      <div className="container">
        <div className="gallery-head">
          <div>
            <Eyebrow>Completed projects</Eyebrow>
            <h2 className="h2" data-reveal="split">
              <SplitWords text="A portfolio measured in finished buildings." />
            </h2>
          </div>
          <div className="filters" role="group" aria-label="Filter projects by category">
            {categories.map((c) => (
              <button key={c.id} type="button" className={`filter ${filter === c.id ? 'is-active' : ''}`} aria-pressed={filter === c.id} onClick={() => choose(c.id)}>
                {c.label} <sup>{String(count(c.id)).padStart(2, '0')}</sup>
              </button>
            ))}
          </div>
        </div>

        <div className="g-grid" ref={gridRef}>
          {projects.map((p, i) => {
            const show = filter === 'all' || p.category === filter
            return (
              <div key={p.id} className={`g-item g-${i % 5} ${show ? '' : 'is-hidden'}`} data-flip-id={p.id} aria-hidden={!show}>
                <ProjectCard project={p} index={i} size="sm" onOpen={() => setOpen(visible.findIndex((v) => v.id === p.id))} />
              </div>
            )
          })}
        </div>
        <p className="gallery-note" aria-live="polite">
          Showing {visible.length} of {projects.length} projects
        </p>
      </div>

      {open > -1 && visible[open] && (
        <Lightbox list={visible} index={open} onClose={() => setOpen(-1)} onStep={(d) => setOpen((i) => (i + d + visible.length) % visible.length)} />
      )}
    </section>
  )
}
