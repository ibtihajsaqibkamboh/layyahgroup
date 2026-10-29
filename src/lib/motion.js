import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, Flip)

export { gsap, ScrollTrigger, Flip }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

/* ── Smooth scrolling (Lenis, synced to GSAP's ticker) ───────────── */
let lenis = null

export function initSmoothScroll() {
  if (prefersReducedMotion() || typeof Lenis !== 'function') return () => {}
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

export const lockScroll = () => {
  if (lenis) lenis.stop()
  document.documentElement.classList.add('is-locked')
}
export const unlockScroll = () => {
  if (lenis) lenis.start()
  document.documentElement.classList.remove('is-locked')
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = id === 'home' ? 0 : -64
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 })
  else
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY + offset,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
}

/* ── Scroll-triggered reveals, scoped to one section ─────────────
 * data-reveal="up"    fade + rise
 * data-reveal="img"   curtain wipe on a .media frame, inner image settles from scale 1.25
 * data-reveal="line"  hairline draws left to right
 * data-reveal="split" heading words rise from a mask (needs .split-word children)
 */
export function useReveal(scopeRef, deps = []) {
  useLayoutEffect(() => {
    if (!scopeRef.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, {
          y: 44,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
      gsap.utils.toArray('[data-reveal="img"]').forEach((el) => {
        const inner = el.querySelector('.media-inner')
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        tl.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'expo.inOut' },
        )
        if (inner) tl.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.15)
      })
      gsap.utils.toArray('[data-reveal="line"]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })
      gsap.utils.toArray('[data-reveal="split"]').forEach((el) => {
        gsap.from(el.querySelectorAll('.split-word > span'), {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    }, scopeRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ── Subtle 3D tilt for cards (pointer devices only) ─────────────── */
export function tiltHandlers(strength = 6) {
  if (isTouch() || prefersReducedMotion()) return {}
  return {
    onPointerMove: (e) => {
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--ry', `${x * strength}deg`)
      el.style.setProperty('--rx', `${-y * strength}deg`)
      el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
      el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
    },
    onPointerLeave: (e) => {
      e.currentTarget.style.setProperty('--ry', '0deg')
      e.currentTarget.style.setProperty('--rx', '0deg')
    },
  }
}
