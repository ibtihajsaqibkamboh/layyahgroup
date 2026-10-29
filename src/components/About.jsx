import { useRef } from 'react'
import { useReveal } from '../lib/motion.js'
import { site } from '../config/site.js'
import { sitePhotos } from '../data/projects.js'
import Media from './Media.jsx'
import { SplitWords, Fill, Eyebrow } from './Text.jsx'

export default function About() {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section id="about" className="section section-light about" ref={ref}>
      <div className="container about-grid">
        <div className="about-copy">
          <Eyebrow>About our company</Eyebrow>
          <h2 className="h2" data-reveal="split">
            <SplitWords text="Built on drawings you can trust and sites you can visit." />
          </h2>
          <span className="rule" data-reveal="line" />
          <div className="about-text" data-reveal="up">
            <p>
              <Fill>{site.companyName}</Fill> is a design-and-build construction company delivering luxury homes,
              commercial plazas and multi-storey buildings. Architects, structural engineers and site teams work
              under one roof, so the building that gets drawn is the building that gets built.
            </p>
            <p>
              Established in <Fill>{site.foundedYear}</Fill>. Every project is run with a fixed scope, a written
              schedule and regular site reports, from foundation to final finishing.
            </p>
          </div>
          <ul className="credentials" data-reveal="up" aria-label="Registrations and memberships">
            {site.credentials.map((c) => (
              <li key={c}>
                <Fill>{c}</Fill>
              </li>
            ))}
          </ul>
        </div>

        <div className="about-visual">
          <Media photo={sitePhotos.about} alt="Tower crane above a building under construction" variant="site" seed={3} sizes="(min-width: 900px) 45vw, 100vw" className="about-media" />
          <div className="title-block" aria-hidden="true">
            <span>Project</span>
            <b>
              <Fill>{site.companyName}</Fill>
            </b>
            <span>Drawing</span>
            <b>Company profile</b>
            <span>Scale</span>
            <b>1 : 100</b>
          </div>
        </div>
      </div>

      <div className="container">
        <dl className="stats">
          {site.stats.map((s, i) => (
            <div className="stat" key={s.label} data-reveal="up" data-delay={i * 0.08}>
              <dt>{s.label}</dt>
              <dd>
                <Fill>{s.value}</Fill>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
