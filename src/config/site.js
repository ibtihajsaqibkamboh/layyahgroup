/*
 * ─────────────────────────────────────────────────────────────
 *  COMPANY DETAILS — edit this one file.
 *  Anything in [square brackets] is a placeholder and is shown on
 *  the site with a dashed underline so it is easy to spot.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  companyName: 'Layyah Group',
  legalName: 'Layyah Group of Services®',
  shortName: 'Layyah Group',
  tagline: 'Building strong foundations.',

  // Logo shown in the header, footer and intro (file lives in /public/brand).
  logo: '/brand/layyah-group-logo.png',

  // Primary phone shown on the site and used for the click-to-call buttons.
  phoneDisplay: '+92 300 5389023',
  phoneDial: '+923005389023',

  // Every number the company can be reached on (shown in the Contact section and footer).
  phones: [
    { label: 'Mobile / WhatsApp', display: '+92 300 5389023', dial: '+923005389023' },
    { label: 'Mobile', display: '+92 321 845 2604', dial: '+923218452604' },
    { label: 'Office', display: '+92 51 222 7646', dial: '+92512227646' },
  ],

  // WhatsApp number in international format, digits only (no "+", spaces or dashes).
  whatsappNumber: '923005389023',
  whatsappGreeting: 'Hello Layyah Group, I would like to discuss a construction project.',

  email: 'layyahgroup.concrete@gmail.com',
  website: 'www.layyahgroup.com',
  address: 'G-15 Mall Road, Islamabad, Pakistan',
  officeHours: 'Mon–Sat · 9:00 am – 6:00 pm',

  // Google Maps embed for the office location.
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212633.6984089676!2d72.9214261928968!3d33.620829226266586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x602a6b7637439b83%3A0x1c305e3932aa12ea!2sLayyah%20Group%20of%20Services!5e0!3m2!1sen!2s!4v1788376006038!5m2!1sen!2s',

  // Optional: a form endpoint (for example https://formspree.io/f/xxxxxx).
  // When empty, the inquiry form opens WhatsApp with the details filled in.
  formEndpoint: '',

  // Figures shown in the About section.
  stats: [
    { value: '10+', label: 'Years experience' },
    { value: '150+', label: 'Projects completed' },
    { value: '100+', label: 'Happy clients' },
    { value: '25+', label: 'Professional team members' },
  ],

  // Short highlights shown under the About text.
  credentials: ['Layyah Group of Services®', 'Concrete pumping & placement fleet', 'Based in Islamabad, Pakistan'],

  social: [{ label: 'Facebook', href: 'https://www.facebook.com/share/1CVqbhGx5z/' }],

  // Shows a small "Sample image" tag on stock photos. Set to false once
  // every image is a photo of your own work.
  showSampleBadges: true,
}

export const isPlaceholder = (v) => typeof v === 'string' && /\[.*\]/.test(v)

export const whatsappLink = (text = site.whatsappGreeting) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`

export const telLink = (dial = site.phoneDial) => `tel:${dial}`
