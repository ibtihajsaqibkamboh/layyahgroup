/*
 * ─────────────────────────────────────────────────────────────
 *  YOUR COMPANY DETAILS — edit this one file.
 *  Anything in [square brackets] is a placeholder and is shown on
 *  the site with a dashed underline so it is easy to spot.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  companyName: '[Company Name]',
  shortName: '[Company]', // used in the logo on small screens

  // Phone shown on the site and used for the click-to-call button.
  phoneDisplay: '[+00 000 0000000]',
  phoneDial: '+000000000000', // full international number, digits only after "+"

  // WhatsApp number in international format, digits only (no "+", spaces or dashes).
  // Example for Pakistan: 923001234567
  whatsappNumber: '000000000000',
  whatsappGreeting: 'Hello, I would like to discuss a construction project.',

  email: '[info@yourcompany.com]',
  address: '[Office address, City, Country]',
  officeHours: '[Mon–Sat · 9:00 am – 6:00 pm]',
  foundedYear: '[Year founded]',

  // Optional: a form endpoint (for example https://formspree.io/f/xxxxxx).
  // When empty, the inquiry form opens WhatsApp with the details filled in.
  formEndpoint: '',

  // Figures shown in the About section. Replace with your real numbers.
  stats: [
    { value: '[00]+', label: 'Years in construction' },
    { value: '[000]+', label: 'Projects completed' },
    { value: '[00]', label: 'Engineers & architects' },
    { value: '[0.0M]', label: 'Sq. ft. delivered' },
  ],

  // Licences, registrations or memberships. Leave as placeholders until confirmed.
  credentials: ['[Registration / licence no.]', '[Professional body membership]', '[Quality certification]'],

  social: [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],

  // Shows a small "Sample image" tag on stock photos. Set to false once
  // every image is a photo of your own work.
  showSampleBadges: true,
}

export const isPlaceholder = (v) => typeof v === 'string' && /\[.*\]/.test(v)

export const whatsappLink = (text = site.whatsappGreeting) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`

export const telLink = () => `tel:${site.phoneDial}`
