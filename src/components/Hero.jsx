import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion, isTouch, scrollToId } from '../lib/motion.js'
import { createTowerScene } from '../three/towerScene.js'
import { site, whatsappLink } from '../config/site.js'
import { IconArrow, IconWhatsApp } from './Icons.jsx'
import { Fill } from './Text.jsx'

const HEADLINE = [
  { text: 'We build', em: false },
  { text: 'landmarks', em: true },
  { text: 'for generations.', em: false },
]

export default function Hero({ revealed }) {
  const root = useRef(null)
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const [webgl, setWebgl] = useState(true)

  // Create the 3D tower once; render only while the hero is on screen.
  useEffect(() => {
    const lowPower = isTouch() || window.innerWidth < 760
    const scene = createTowerScene(canvasRef.current, { lowPower, reducedMotion: prefersReducedMotion() })
    if (!scene) {
      setWebgl(false)
      return
    }
    sceneRef.current = scene
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? scene.start() : scene.stop()))
    io.observe(canvasRef.current)
    const onVis = () => (document.hidden ? scene.stop() : scene.start())
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  // Opening: headline lines rise, details fade in, tower assembles.
  useLayoutEffect(() => {
    if (!revealed) return
    const ctx = gsap.context(() => {
      if (sceneRef.current) sceneRef.current.build(prefersReducedMotion() ? null : gsap)
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero-line > span', { yPercent: 115, rotate: 3, duration: 1.4, stagger: 0.12 }, 0.1)
        .from('.hero-eyebrow', { autoAlpha: 0, y: 14, duration: 1 }, 0.2)
        .from('.hero-sub, .hero-ctas, .hero-meta', { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.1 }, 0.55)
        .from('.hero-rule', { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut' }, 0.3)
        .from('.hero-ruler li', { autoAlpha: 0, x: -8, duration: 0.5, stagger: 0.04 }, 0.9)

      // Scroll: camera rises up the tower while the copy drifts away.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => sceneRef.current && sceneRef.current.setScroll(self.progress),
      })
      gsap.to('.hero-copy', {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [revealed])

  return (
    <section id="home" className="hero" ref={root} aria-label="Introduction">
      <div className="hero-backdrop" aria-hidden="true" />
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" hidden={!webgl} />
      <div className="hero-vignette" aria-hidden="true" />

      <ol className="hero-ruler" aria-hidden="true">
        {['+64.00', '+48.00', '+32.00', '+16.00', '±0.00'].map((l) => (
          <li key={l}>▽ {l}</li>
        ))}
      </ol>

      <div className="hero-copy">
        <p className="hero-eyebrow">
          {site.companyName} · Trusted construction partner in Islamabad
        </p>
        <h1 className="hero-title">
          {HEADLINE.map((l) => (
            <span className="hero-line" key={l.text}>
              <span className={l.em ? 'em' : undefined}>{l.text}</span>
            </span>
          ))}
        </h1>
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-sub">
          From residential homes to commercial plazas, concrete pumping and large-scale structures, Layyah Group
          delivers construction built around quality, precision and trust.
        </p>
        <div className="hero-ctas">
          <a href="#contact" className="btn btn-gold" onClick={(e) => (e.preventDefault(), scrollToId('contact'))}>
            Request a Quotation <IconArrow width={18} height={18} />
          </a>
          <a href="#projects" className="btn btn-ghost-light" onClick={(e) => (e.preventDefault(), scrollToId('projects'))}>
            View Projects
          </a>
          <a href={whatsappLink()} className="btn-icon-text" target="_blank" rel="noopener noreferrer">
            <IconWhatsApp width={20} height={20} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="hero-meta" aria-hidden="true">
        <span>Residential</span>
        <span>Commercial</span>
        <span>High-Rise</span>
        <span className="hero-scroll">
          Scroll <i />
        </span>
      </div>
    </section>
  )
}
