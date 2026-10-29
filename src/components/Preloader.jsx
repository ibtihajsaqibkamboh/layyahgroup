import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, lockScroll, unlockScroll } from '../lib/motion.js'
import { site } from '../config/site.js'

/*
 * Opening sequence: an elevation drawing of a tower draws itself while the
 * level counter climbs, gold fills the building, then the two curtain panels
 * part to reveal the hero and the 3D tower begins assembling.
 */
export default function Preloader({ onReveal }) {
  const root = useRef(null)
  const tlRef = useRef(null)
  const [done, setDone] = useState(false)

  useLayoutEffect(() => {
    lockScroll()
    const reduce = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const num = root.current.querySelector('.pl-num')
      const counter = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          unlockScroll()
          setDone(true)
        },
      })
      tlRef.current = tl
      if (reduce) {
        tl.call(onReveal, null, 0.1).to(root.current, { autoAlpha: 0, duration: 0.4 }, 0.2)
        return
      }
      const paths = gsap.utils.toArray('.pl-draw')
      paths.forEach((p) => {
        const len = p.getTotalLength ? p.getTotalLength() : 400
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      tl.to(paths, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.025 }, 0.1)
        .to(counter, {
          v: 100,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, '0')),
        }, 0)
        .fromTo('.pl-fill', { scaleY: 0 }, { scaleY: 1, duration: 1.9, ease: 'power2.inOut' }, 0.1)
        .from('.pl-meta > *', { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0)
        .to('.pl-meta > *', { y: -12, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, 2.05)
        .to('.pl-stage', { scale: 1.35, autoAlpha: 0, duration: 0.8, ease: 'expo.in' }, 2.05)
        .to('.pl-panel.is-top', { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, 2.35)
        .to('.pl-panel.is-bottom', { yPercent: 100, duration: 1.15, ease: 'expo.inOut' }, 2.35)
        .call(onReveal, null, 2.6)
    }, root)
    return () => {
      ctx.revert()
      unlockScroll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (done) return null

  return (
    <div className="preloader" ref={root} role="status" aria-label="Loading website">
      <div className="pl-panel is-top" />
      <div className="pl-panel is-bottom" />
      <div className="pl-stage">
        <svg className="pl-svg" viewBox="0 0 220 300" aria-hidden="true">
          <defs>
            <clipPath id="pl-clip">
              <path d="M70 270V70l20-20h40l20 20v200z" />
            </clipPath>
          </defs>
          <g clipPath="url(#pl-clip)">
            <rect className="pl-fill" x="60" y="40" width="100" height="232" />
          </g>
          {/* grid bubbles A–C */}
          {[
            [70, 'A'],
            [110, 'B'],
            [150, 'C'],
          ].map(([x, l]) => (
            <g key={l}>
              <line className="pl-draw pl-grid" x1={x} y1="24" x2={x} y2="282" />
              <circle className="pl-draw" cx={x} cy="14" r="8" />
              <text x={x} y="17.5" className="pl-bubble">{l}</text>
            </g>
          ))}
          <path className="pl-draw pl-heavy" d="M70 270V70l20-20h40l20 20v200z" />
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i} className="pl-draw" x1="70" y1={250 - i * 20} x2="150" y2={250 - i * 20} />
          ))}
          <line className="pl-draw" x1="96.7" y1="70" x2="96.7" y2="270" />
          <line className="pl-draw" x1="123.3" y1="70" x2="123.3" y2="270" />
          <line className="pl-draw pl-heavy" x1="20" y1="270" x2="200" y2="270" />
          <path className="pl-draw" d="M150 250h18m-6-4 6 4-6 4" />
        </svg>
        <div className="pl-meta">
          <span className="pl-brand">{site.companyName}</span>
          <span className="pl-count">
            LEVEL <span className="pl-num">000</span>
          </span>
          <span className="pl-sheet">Sheet A-001 · Front elevation</span>
        </div>
      </div>
      <button type="button" className="pl-skip" onClick={() => tlRef.current && tlRef.current.timeScale(6)}>
        Skip intro
      </button>
    </div>
  )
}
