import { site, telLink, whatsappLink } from '../config/site.js'
import { scrollToId } from '../lib/motion.js'
import { NAV_LINKS, Logo } from './Nav.jsx'
import { Fill } from './Text.jsx'
import { IconPhone, IconWhatsApp } from './Icons.jsx'

export function FloatingActions() {
  return (
    <div className="fab" aria-label="Quick contact">
      <a className="fab-btn fab-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <IconWhatsApp width={26} height={26} />
        <span className="fab-label">WhatsApp</span>
      </a>
      <a className="fab-btn fab-call" href={telLink()} aria-label={`Call ${site.phoneDisplay}`}>
        <IconPhone width={22} height={22} />
        <span className="fab-label">Call now</span>
      </a>
    </div>
  )
}

export default function Footer() {
  const go = (id) => (e) => (e.preventDefault(), scrollToId(id))
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cta">
          <p className="footer-big">
            Have a plot and a plan? <em>Let's build it.</em>
          </p>
          <a href="#contact" className="btn btn-gold" onClick={go('contact')}>
            Request a Quotation
          </a>
        </div>
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="footer-note">
              {site.legalName}: residential, commercial, plaza, structural and concrete construction services in
              Islamabad, Pakistan.
            </p>
          </div>
          <nav aria-label="Footer">
            <h4>Explore</h4>
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div>
            <h4>Contact</h4>
            {site.phones.map((p) => (
              <a key={p.dial} href={telLink(p.dial)}>
                <IconPhone width={16} height={16} /> {p.display}
              </a>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <IconWhatsApp width={16} height={16} /> WhatsApp
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`https://${site.website}`} target="_blank" rel="noopener noreferrer">
              {site.website}
            </a>
            <p>{site.address}</p>
            <p>{site.officeHours}</p>
          </div>
          <div>
            <h4>Follow</h4>
            {site.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-base">
          <span>
            © {new Date().getFullYear()} {site.companyName}. All rights reserved.
          </span>
          <span>{site.tagline}</span>
          <span>Sample photography: Unsplash</span>
        </div>
      </div>
    </footer>
  )
}
