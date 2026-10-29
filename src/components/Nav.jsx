import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, scrollToId, lockScroll, unlockScroll, prefersReducedMotion } from '../lib/motion.js'
import { site, telLink } from '../config/site.js'
import { IconPhone, IconClose } from './Icons.jsx'
import { Fill } from './Text.jsx'

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'high-rise', label: 'High-Rise' },
  { id: 'projects', label: 'Projects' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'contact', label: 'Contact' },
]

export function Logo() {
  return (
    <span className="logo">
      <svg viewBox="0 0 40 40" className="logo-mark" aria-hidden="true">
        <path d="M8 34V14l12-9 12 9v20" />
        <path d="M15 34V22h10v12M8 18h24" />
      </svg>
      <span className="logo-text">
        <Fill>{site.companyName}</Fill>
        <small>Construction &amp; Architecture</small>
      </span>
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState('home')
  const menuRef = useRef(null)
  const toggleRef = useRef(null)

  // Solid background after the hero; hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 400 && y > last + 4)
      if (y < last - 4) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section in view.
  useEffect(() => {
    const ids = ['home', ...NAV_LINKS.map((l) => l.id)]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Mobile menu animation + Escape to close.
  const wasOpen = useRef(false)
  useLayoutEffect(() => {
    if (!menuRef.current) return
    if (open) {
      wasOpen.current = true
      lockScroll()
      if (!prefersReducedMotion()) {
        gsap.fromTo(menuRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' })
        gsap.fromTo(menuRef.current.querySelectorAll('.mm-link'), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, delay: 0.25, ease: 'expo.out' })
      }
      const first = menuRef.current.querySelector('a, button')
      if (first) first.focus()
      const onKey = (e) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
    if (wasOpen.current) {
      wasOpen.current = false
      unlockScroll()
      if (toggleRef.current) toggleRef.current.focus({ preventScroll: true })
    }
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    // wait one frame so the menu's scroll lock releases first
    requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={go('home')} aria-label={`${site.companyName}, back to top`}>
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Main">
            {NAV_LINKS.slice(0, 7).map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className={active === l.id ? 'is-active' : ''}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <a className="nav-phone" href={telLink()} aria-label={`Call ${site.phoneDisplay}`}>
              <IconPhone width={18} height={18} />
              <span>
                <Fill>{site.phoneDisplay}</Fill>
              </span>
            </a>
            <a className="btn btn-gold btn-sm" href="#contact" onClick={go('contact')}>
              Request a Quote
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span className="nav-toggle-bars" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className="mobile-menu" ref={menuRef} hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <button type="button" className="mm-close" onClick={() => setOpen(false)}>
          <IconClose /> <span>Close</span>
        </button>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <a key={l.id} className="mm-link" href={`#${l.id}`} onClick={go(l.id)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mm-foot">
          <a href={telLink()} className="btn btn-outline-light">
            <IconPhone width={18} height={18} /> <Fill>{site.phoneDisplay}</Fill>
          </a>
          <a href="#contact" className="btn btn-gold" onClick={go('contact')}>
            Request a Quote
          </a>
        </div>
      </div>
    </>
  )
}
