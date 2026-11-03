import { useMemo } from 'react'

/*
 * Drawn architectural elevation used as an image placeholder.
 * It sits under every photo, so the frame never shows an empty box
 * while a photo loads, or if a photo cannot be loaded.
 */
function rng(seed) {
  let s = (seed * 7919) % 233280 || 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function windows(x, y, w, h, cols, rows, key, lit) {
  const out = []
  const cw = w / cols
  const rh = h / rows
  for (let c = 1; c < cols; c++)
    out.push(<line key={`${key}v${c}`} x1={x + c * cw} y1={y} x2={x + c * cw} y2={y + h} className="fa-mull" />)
  for (let r = 1; r < rows; r++)
    out.push(<line key={`${key}h${r}`} x1={x} y1={y + r * rh} x2={x + w} y2={y + r * rh} className="fa-mull" />)
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++)
      if (lit()) out.push(<rect key={`${key}l${c}-${r}`} x={x + c * cw + 1.5} y={y + r * rh + 1.5} width={cw - 3} height={rh - 3} className="fa-lit" />)
  return out
}

export default function FacadeArt({ variant = 'tower', seed = 1, label = 'Project photo' }) {
  const shapes = useMemo(() => {
    const r = rng(seed)
    const lit = () => r() > 0.72
    const G = 238
    const els = []
    if (variant === 'villa') {
      const x0 = 60 + r() * 20
      els.push(<rect key="b1" x={x0} y={G - 62} width={170} height={62} className="fa-mass" />)
      els.push(...windows(x0 + 10, G - 52, 110, 44, 5, 2, 'w1', lit))
      els.push(<rect key="b2" x={x0 + 60} y={G - 118} width={200} height={52} className="fa-mass" />)
      els.push(...windows(x0 + 70, G - 110, 150, 38, 6, 1, 'w2', lit))
      els.push(<rect key="s1" x={x0 + 50} y={G - 124} width={222} height={6} className="fa-slab" />)
      els.push(<rect key="s2" x={x0 - 8} y={G - 66} width={186} height={5} className="fa-slab" />)
      els.push(<rect key="pool" x={x0 + 120} y={G + 4} width={150} height={10} className="fa-pool" />)
    } else if (variant === 'plaza') {
      const top = G - 120 - r() * 20
      els.push(<rect key="m" x={30} y={top} width={340} height={G - top} className="fa-mass" />)
      els.push(<rect key="band" x={30} y={top + 14} width={340} height={8} className="fa-band" />)
      els.push(...windows(40, top + 32, 320, G - top - 82, 10, 3, 'pw', lit))
      for (let i = 0; i < 7; i++) {
        const ax = 44 + i * 46
        els.push(<path key={`a${i}`} d={`M${ax} ${G} V${G - 30} a16 16 0 0 1 32 0 V${G}`} className="fa-arch" />)
      }
    } else if (variant === 'tower') {
      const towers = [
        { x: 70, w: 70, h: 150 + r() * 30 },
        { x: 160, w: 90, h: 205 + r() * 20 },
        { x: 268, w: 64, h: 120 + r() * 40 },
      ]
      towers.forEach((t, i) => {
        els.push(<rect key={`t${i}`} x={t.x} y={G - t.h} width={t.w} height={t.h} className="fa-mass" />)
        els.push(...windows(t.x + 6, G - t.h + 10, t.w - 12, t.h - 18, Math.round(t.w / 14), Math.round(t.h / 12), `tw${i}`, lit))
        els.push(<line key={`f${i}`} x1={t.x} y1={G - t.h} x2={t.x} y2={G} className="fa-fin" />)
      })
    } else {
      els.push(<rect key="core" x={150} y={G - 150} width={100} height={150} className="fa-frame" />)
      for (let i = 1; i < 6; i++)
        els.push(<line key={`fl${i}`} x1={150} y1={G - i * 25} x2={250} y2={G - i * 25} className="fa-mull" />)
      els.push(<path key="crane" d={`M300 ${G} V40 M300 40 H120 M300 40 L330 58 M300 64 L270 40 M180 40 V92`} className="fa-fin" />)
    }
    return els
  }, [variant, seed])

  return (
    <svg className="facade" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`fa-sky-${variant}-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1f23" />
          <stop offset="1" stopColor="#2a2a27" />
        </linearGradient>
        <radialGradient id={`fa-sun-${variant}-${seed}`} cx="0.8" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#28b9ef" stopOpacity="0.32" />
          <stop offset="1" stopColor="#28b9ef" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#fa-sky-${variant}-${seed})`} />
      <rect width="400" height="300" fill={`url(#fa-sun-${variant}-${seed})`} />
      {[60, 140, 220, 300].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="300" className="fa-grid" />
      ))}
      {shapes}
      <line x1="0" y1="238" x2="400" y2="238" className="fa-ground" />
      <text x="16" y="282" className="fa-label">▽ ±0.00 · {label.toUpperCase()}</text>
    </svg>
  )
}
