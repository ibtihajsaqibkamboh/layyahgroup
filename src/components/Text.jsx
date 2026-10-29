import { isPlaceholder } from '../config/site.js'

// Wraps each word in a mask so headings can rise word by word.
export function SplitWords({ text, as: Tag = 'span', className = '' }) {
  const parts = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {parts.map((w, i) => (
        <span className="split-word" key={i} aria-hidden="true">
          <span>{w}</span>
          {i < parts.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

// Shows a value; marks it visibly when it is still a placeholder.
export function Fill({ children }) {
  const text = String(children)
  if (!isPlaceholder(text)) return text
  return (
    <span className="ph" title="Placeholder: replace in src/config/site.js">
      {text}
    </span>
  )
}

export function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>
}
