import { useLayoutEffect, useRef } from 'react'
import { gsap, useReveal, prefersReducedMotion } from '../lib/motion.js'
import { sitePhotos } from '../data/projects.js'
import Media from './Media.jsx'
import { SplitWords, Eyebrow } from './Text.jsx'

const REASONS = [
  ['One contract, one team', 'Design, engineering and construction are coordinated in-house, so there is no gap between drawing and site.'],
  ['Transparent estimates', 'Itemised bills of quantities and written payment milestones before work begins.'],
  ['Engineered for safety', 'Structural design checked against the applicable building codes, with site safety on every shift.'],
  ['Premium materials', 'Approved brands and tested materials, with samples signed off by you before installation.'],
  ['On-schedule delivery', 'A written programme with milestones, and progress photos and reports at every stage.'],
  ['Support after handover', 'A defects period and maintenance guidance once you move in.'],
]

const PROCESS = [
  ['Consultation', 'Site visit, brief and budget discussion.'],
  ['Design', 'Concept, 3D views and working drawings.'],
  ['Estimate & approvals', 'BOQ, contract and authority approvals.'],
  ['Construction', 'Structure, services and finishing with QA checks.'],
  ['Handover', 'Snag list, documentation and keys.'],
]

export default function WhyUs() {
  const ref = useRef(null)
  const lineRef = useRef(null)
  useReveal(ref)

  // The process line draws as you scroll through it.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.process', start: 'top 75%', end: 'bottom 60%', scrub: true },
      })
      gsap.utils.toArray('.process li').forEach((li) => {
        gsap.from(li, { autoAlpha: 0.2, x: 20, duration: 0.8, scrollTrigger: { trigger: li, start: 'top 75%', toggleActions: 'play none none reverse' } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="why-us" className="section section-dark why" ref={ref}>
      <div className="container">
        <div className="section-head">
          <Eyebrow light>Why choose us</Eyebrow>
          <h2 className="h2" data-reveal="split">
            <SplitWords text="The quiet details are where buildings last." />
          </h2>
        </div>

        <div className="reasons">
          {REASONS.map(([t, d], i) => (
            <div className="reason" key={t} data-reveal="up" data-delay={(i % 3) * 0.08}>
              <span className="reason-mark" aria-hidden="true" />
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="why-split">
          <Media photo={sitePhotos.process} alt="Tower crane over a city construction site" variant="site" seed={9} sizes="(min-width: 900px) 40vw, 100vw" className="why-media" />
          <div>
            <h3 className="h3" data-reveal="up">How a project runs</h3>
            <ol className="process">
              <span className="process-line" ref={lineRef} aria-hidden="true" />
              {PROCESS.map(([t, d], i) => (
                <li key={t}>
                  <span className="process-step">Stage {String(i + 1).padStart(2, '0')}</span>
                  <strong>{t}</strong>
                  <span>{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
