# Construction Company Website

React + Vite site with GSAP animations, Lenis smooth scrolling and a Three.js tower in the hero.

## 1. Add your details (one file)

Open `src/config/site.js` and replace every value in `[square brackets]`:
company name, phone, WhatsApp number, email, address, hours, year founded,
stats and credentials. Placeholders show on the site with a dashed gold underline
until you replace them.

- `whatsappNumber`: international format, digits only, e.g. `923001234567`
- `phoneDial`: e.g. `+923001234567`
- `formEndpoint`: optional (see step 4). Empty = the form opens WhatsApp pre-filled.

Also update the `<title>` and description in `index.html`.

## 2. Replace the sample photos

`src/data/projects.js` lists every project. The photos are free Unsplash stock images,
marked "Sample image" on the site. For each project:

1. Copy your photo to `public/projects/` (e.g. `public/projects/villa-dha.jpg`, ~2000px wide, JPG/WebP)
2. Set `photo: '/projects/villa-dha.jpg'`, and update `title`, `place`, `year`, `scope`

When every photo is your own, set `showSampleBadges: false` in `site.js`.
Showcase-section text (deliverables, "Typical timeline", "Rates from") is in `src/App.jsx`.

## 3. Preview on your computer

Requires Node.js 18+ (nodejs.org).

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). Edits reload instantly.
To check on your phone, run `npm run dev -- --host` and open the "Network" address on
a phone connected to the same Wi-Fi.

## 4. Make the inquiry form send emails (optional)

1. Create a free form at formspree.io (or a similar service) and copy its endpoint URL
2. Paste it into `formEndpoint` in `site.js`

Without it, submitting opens WhatsApp with the inquiry filled in.

## 5. Publish online

Build the production files:

```bash
npm run build
```

This creates a `dist/` folder. Any of these work:

**Netlify (simplest):** sign in at app.netlify.com → "Add new site" → "Deploy manually" →
drag the `dist` folder onto the page. You get a live link in seconds.

**Vercel or Netlify from GitHub (best for updates):** push this folder to a GitHub repo,
import it on vercel.com or netlify.com. Build command `npm run build`, output folder `dist`.
Every push redeploys automatically.

**Your own hosting (cPanel):** upload the contents of `dist/` into `public_html`.

**Custom domain:** buy a domain (e.g. from your registrar), then add it in the
Netlify/Vercel "Domains" settings and follow their DNS instructions. HTTPS is automatic.

## Project structure

```
src/
  config/site.js        company details (edit this)
  data/projects.js      projects and photos (edit this)
  App.jsx               page order and section copy
  styles.css            design tokens and all styles
  lib/motion.js         GSAP, ScrollTrigger, Flip, Lenis, reveal + tilt helpers
  three/towerScene.js   3D tower for the hero
  components/           Preloader, Nav, Hero, About, Services, Showcase,
                        Gallery (filters + lightbox), WhyUs, Contact, Footer
```

Animations respect the visitor's "reduce motion" setting, the 3D scene renders at lower
detail on phones and pauses when off-screen, and images lazy-load with responsive sizes.
