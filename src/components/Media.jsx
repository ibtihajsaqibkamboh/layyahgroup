import { useState } from 'react'
import FacadeArt from './FacadeArt.jsx'
import { photoUrl } from '../data/projects.js'
import { site } from '../config/site.js'

/*
 * Image frame used everywhere a photo appears.
 *  - responsive srcset, lazy loading
 *  - drawn facade underneath as the loading state and fallback
 *  - .media-inner is what the scroll reveal scales; the <img> is what hover zooms
 */
export default function Media({ photo, alt, variant = 'tower', seed = 1, sizes = '100vw', reveal = true, sample = true, className = '', eager = false }) {
  const [state, setState] = useState(photo ? 'loading' : 'failed')
  const widths = [640, 1000, 1600]
  return (
    <div className={`media ${className}`} data-reveal={reveal ? 'img' : undefined}>
      <div className="media-inner">
        <FacadeArt variant={variant} seed={seed} label={state === 'failed' ? 'Photo placeholder' : 'Loading photo'} />
        {state !== 'failed' && (
          <img
            src={photoUrl(photo, 1000)}
            srcSet={widths.map((w) => `${photoUrl(photo, w)} ${w}w`).join(', ')}
            sizes={sizes}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={state === 'loaded' ? 'is-loaded' : ''}
            onLoad={() => setState('loaded')}
            onError={() => setState('failed')}
          />
        )}
      </div>
      {sample && site.showSampleBadges && state === 'loaded' && <span className="sample-tag">Sample image</span>}
    </div>
  )
}
