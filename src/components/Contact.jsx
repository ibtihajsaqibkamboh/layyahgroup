import { useRef, useState } from 'react'
import { useReveal } from '../lib/motion.js'
import { site, whatsappLink, telLink } from '../config/site.js'
import { SplitWords, Fill, Eyebrow } from './Text.jsx'
import { IconPhone, IconWhatsApp, IconMail, IconPin, IconClock, IconArrow, IconGlobe } from './Icons.jsx'

const PROJECT_TYPES = [
  'House / villa construction',
  'Commercial construction',
  'Plaza / shopping centre',
  'Multi-storey / apartments',
  'Concrete pumping & structural work',
  'Grey structure',
  'Renovation & remodeling',
  'Finishing work',
  'Project management',
  'Other',
]
const BUDGETS = ['Not sure yet', 'Under PKR 5M', 'PKR 5M–20M', 'PKR 20M–50M', 'PKR 50M+']

const EMPTY = { name: '', phone: '', email: '', type: '', location: '', budget: '', message: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[+\d][\d\s-]{6,}$/.test(v.phone.trim())) e.phone = 'Enter a phone number with at least 7 digits.'
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Check the email address, or leave it blank.'
  if (!v.type) e.type = 'Choose the type of project.'
  if (v.message.trim().length < 10) e.message = 'Tell us a little about the project (10 characters or more).'
  return e
}

function summary(v) {
  return [
    'New construction inquiry',
    `Name: ${v.name}`,
    `Phone: ${v.phone}`,
    v.email && `Email: ${v.email}`,
    `Project: ${v.type}`,
    v.location && `Location: ${v.location}`,
    v.budget && `Budget: ${v.budget}`,
    `Details: ${v.message}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | whatsapp | error
  const [waHref, setWaHref] = useState('')

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = e.currentTarget.querySelector(`#f-${Object.keys(found)[0]}`)
      if (first) first.focus()
      return
    }
    // With a form endpoint configured, post the inquiry there.
    if (site.formEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...values, _subject: `Construction inquiry from ${values.name}` }),
        })
        if (!res.ok) throw new Error(String(res.status))
        setStatus('sent')
        setValues(EMPTY)
      } catch (err) {
        setStatus('error')
      }
      return
    }
    // Otherwise hand the inquiry to WhatsApp, pre-filled.
    const href = whatsappLink(summary(values))
    setWaHref(href)
    setStatus('whatsapp')
    window.open(href, '_blank', 'noopener')
  }

  const field = (k, label, input, hint) => (
    <div className={`field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      {input}
      {errors[k] ? (
        <p className="field-error" id={`f-${k}-err`}>
          {errors[k]}
        </p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  )
  const aria = (k) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `f-${k}-err` : undefined })

  return (
    <section id="contact" className="section section-light contact" ref={ref}>
      <div className="container contact-grid">
        <div className="contact-info">
          <Eyebrow>Contact us</Eyebrow>
          <h2 className="h2" data-reveal="split">
            <SplitWords text="Request a construction quotation." />
          </h2>
          <p className="lead" data-reveal="up">
            Share a few details about your plot and plans. An engineer will call you back to discuss scope, timeline and
            a written estimate.
          </p>
          <ul className="contact-list" data-reveal="up">
            {site.phones.map((p) => (
              <li key={p.dial}>
                <IconPhone />
                <div>
                  <span>{p.label}</span>
                  <a href={telLink(p.dial)}>{p.display}</a>
                </div>
              </li>
            ))}
            <li>
              <IconWhatsApp />
              <div>
                <span>WhatsApp</span>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  Start a chat
                </a>
              </div>
            </li>
            <li>
              <IconMail />
              <div>
                <span>Email</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </li>
            <li>
              <IconGlobe />
              <div>
                <span>Website</span>
                <a href={`https://${site.website}`} target="_blank" rel="noopener noreferrer">
                  {site.website}
                </a>
              </div>
            </li>
            <li>
              <IconPin />
              <div>
                <span>Office</span>
                <p>
                  <Fill>{site.address}</Fill>
                </p>
              </div>
            </li>
            <li>
              <IconClock />
              <div>
                <span>Hours</span>
                <p>
                  <Fill>{site.officeHours}</Fill>
                </p>
              </div>
            </li>
          </ul>
          {site.mapEmbed && (
            <div className="contact-map" data-reveal="up">
              <iframe
                src={site.mapEmbed}
                title={`${site.companyName} office location on Google Maps`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <form className="quote-form" onSubmit={onSubmit} noValidate data-reveal="up" aria-labelledby="quote-title">
          <h3 id="quote-title" className="h3">
            Quotation request
          </h3>
          <div className="form-row">
            {field('name', 'Full name *', <input id="f-name" name="name" autoComplete="name" value={values.name} onChange={set('name')} {...aria('name')} />)}
            {field('phone', 'Phone / WhatsApp *', <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} {...aria('phone')} />)}
          </div>
          <div className="form-row">
            {field('email', 'Email', <input id="f-email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} {...aria('email')} />, 'Optional')}
            {field(
              'type',
              'Project type *',
              <select id="f-type" name="type" value={values.type} onChange={set('type')} {...aria('type')}>
                <option value="">Select…</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>,
            )}
          </div>
          <div className="form-row">
            {field('location', 'Plot location', <input id="f-location" name="location" placeholder="City, area" value={values.location} onChange={set('location')} />)}
            {field(
              'budget',
              'Estimated budget',
              <select id="f-budget" name="budget" value={values.budget} onChange={set('budget')}>
                <option value="">Select…</option>
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>,
            )}
          </div>
          {field(
            'message',
            'Project details *',
            <textarea id="f-message" name="message" rows={4} placeholder="Plot size, number of floors, timeline…" value={values.message} onChange={set('message')} {...aria('message')} />,
          )}
          <button type="submit" className="btn btn-gold btn-block" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Request My Quotation'} <IconArrow width={18} height={18} />
          </button>

          <div className="form-status" role="status" aria-live="polite">
            {status === 'sent' && <p className="ok">Thank you. Your request has been received and we will call you back.</p>}
            {status === 'error' && (
              <p className="err">
                The request could not be sent. Please call us on <Fill>{site.phoneDisplay}</Fill> or message us on WhatsApp.
              </p>
            )}
            {status === 'whatsapp' && (
              <p className="ok">
                Your inquiry is ready in WhatsApp. Press send there to reach us.{' '}
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  Open WhatsApp again
                </a>
              </p>
            )}
          </div>
          <p className="form-privacy">We only use your details to respond to this inquiry.</p>
        </form>
      </div>
    </section>
  )
}
