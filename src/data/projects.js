/*
 * PROJECT DATA
 * All images below are free stock photos from Unsplash (unsplash.com/license),
 * used as samples. Replace `photo` with your own project photos:
 *   - put files in /public/projects/ and set photo: '/projects/my-villa.jpg'
 *   - or keep using an Unsplash photo ID.
 * Titles beginning with "Sample" describe the photo only; they are not your projects.
 */

// Builds a sized Unsplash URL from a photo ID, or returns your own path unchanged.
export const photoUrl = (photo, width = 1200) =>
  photo && photo.startsWith('/')
    ? photo
    : `https://unsplash.com/photos/${photo}/download?w=${width}`

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'highrise', label: 'High-Rise' },
]

export const projects = [
  { id: 'r1', category: 'residential', photo: '-etw_RV6saw', title: 'Sample: Contemporary villa', place: '[City]', year: '[Year]', scope: 'Design & build' },
  { id: 'r2', category: 'residential', photo: 'YBfU7TAS8sU', title: 'Sample: Residence with pool', place: '[City]', year: '[Year]', scope: 'Turnkey construction' },
  { id: 'r3', category: 'residential', photo: 'dic4ij4eIeg', title: 'Sample: White courtyard house', place: '[City]', year: '[Year]', scope: 'Structure & finishing' },
  { id: 'r4', category: 'residential', photo: 'dpGoXaZis1o', title: 'Sample: Family villa', place: '[City]', year: '[Year]', scope: 'Design & build' },
  { id: 'c1', category: 'commercial', photo: 'LLvevMSZCD0', title: 'Sample: Glass-front plaza', place: '[City]', year: '[Year]', scope: 'Commercial build' },
  { id: 'c2', category: 'commercial', photo: 'fxtbAjHR4gU', title: 'Sample: Shopping centre', place: '[City]', year: '[Year]', scope: 'Retail construction' },
  { id: 'c3', category: 'commercial', photo: 'a37XH6aJqNw', title: 'Sample: Retail atrium', place: '[City]', year: '[Year]', scope: 'Interior fit-out' },
  { id: 'c4', category: 'commercial', photo: 'Xtl8rQMu1y8', title: 'Sample: Mall glazing', place: '[City]', year: '[Year]', scope: 'Façade works' },
  { id: 'h1', category: 'highrise', photo: '6fWb2V1UIZU', title: 'Sample: Twin towers', place: '[City]', year: '[Year]', scope: 'High-rise structure' },
  { id: 'h2', category: 'highrise', photo: 'KApqOYQW1EU', title: 'Sample: Residential tower', place: '[City]', year: '[Year]', scope: 'Apartments' },
  { id: 'h3', category: 'highrise', photo: 'mrx5BIvESTk', title: 'Sample: Office tower', place: '[City]', year: '[Year]', scope: 'Commercial high-rise' },
  { id: 'h4', category: 'highrise', photo: 't_Ca4D0NOvE', title: 'Sample: Mixed-use towers', place: '[City]', year: '[Year]', scope: 'Mixed use' },
]

export const sitePhotos = {
  about: 'qYyU_e_f8Xs', // construction crane, black & white
  process: 'yITq97usTGM', // crane over city
  site: 'QmW6MD2SeFM', // construction site
}

// Which drawn placeholder to show while a photo loads (or if it cannot load).
export const facadeFor = (category) =>
  ({ residential: 'villa', commercial: 'plaza', highrise: 'tower' })[category] || 'site'
