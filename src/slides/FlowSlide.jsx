import { useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

// Diapositive réutilisable : un fichier source, ce qu'il produit, et les lignes entre les deux.
// Chaque version (variant) montre une façon d'écrire le même code.

const WIRE_COLOR = { php: 'var(--cyan)', html: 'var(--amber)', err: 'var(--red)' }
const list = (x) => (Array.isArray(x) ? x : x ? [x] : [])

function Segs({ segs }) {
  const t = useT()
  return segs.map(([text, kind], i) => (
    <span key={i} className={'k-' + kind}>{kind === 'none' ? t('nothingSent') : text}</span>
  ))
}

export default function FlowSlide({ slide }) {
  const t = useT()
  const [variantId, setVariantId] = useState(slide.variants[0].id)
  const v = slide.variants.find((x) => x.id === variantId)
  const kindOf = (id) => v.lines.find((l) => l.id === id)?.k

  const wires = v.output.flatMap((o, i) =>
    list(o.from).map((from) => ({
      from: 'src-' + from,
      to: 'out-' + i,
      color: WIRE_COLOR[kindOf(from)] ?? 'var(--cyan)',
      tick: variantId,
    })),
  )

  return (
    <div className="stack">
      {slide.variants.length > 1 && (
        <div className="variants" role="group">
          {slide.variants.map((x) => (
            <button
              key={x.id}
              className={'variant' + (x.id === variantId ? ' on' : '')}
              aria-pressed={x.id === variantId}
              onClick={() => setVariantId(x.id)}
            >
              <T v={x.label} />
            </button>
          ))}
        </div>
      )}

      <div className="wired flow" dir="ltr">
        <Wires wires={wires} gutter />
        <section className="pane">
          <header className="pane-head">{slide.sourceLabel}</header>
          <pre className="lines">
            {v.lines.map((line, i) => (
              <div key={i} className="line" data-w={line.id ? 'src-' + line.id : undefined}>
                <span className="ln">{i + 1}</span>
                <span className="code"><Segs segs={line.segs} /></span>
              </div>
            ))}
          </pre>
        </section>
        <section className="pane">
          <header className="pane-head label" dir="auto">{t(slide.outputLabel)}</header>
          <pre className="lines">
            {v.output.map((line, i) => (
              <div key={i} className="line" data-w={'out-' + i}>
                <span className="code"><Segs segs={line.segs} /></span>
              </div>
            ))}
          </pre>
        </section>
      </div>

      <div className="panel" aria-live="polite">
        <p className="note"><T v={v.note} /></p>
      </div>
    </div>
  )
}
