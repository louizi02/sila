import { useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

// Un parcours en étapes : chaque étape est reliée à la suivante.
// Les liens déjà parcourus s'allument, les suivants restent éteints.
export default function StepsSlide({ slide }) {
  const t = useT()
  const [index, setIndex] = useState(0)
  const stage = slide.stages[index]
  const last = index === slide.stages.length - 1

  const wires = slide.stages.slice(1).map((s, i) => ({
    from: 'st-' + slide.stages[i].id,
    to: 'st-' + s.id,
    color: 'var(--cyan)',
    dim: i >= index,
  }))

  return (
    <div className="stack">
      <div className="wired stages" dir="ltr">
        <Wires wires={wires} />
        {slide.stages.map((s, i) => (
          <button
            key={s.id}
            data-w={'st-' + s.id}
            className={'stage-node' + (i === index ? ' on' : '') + (i < index ? ' done' : '')}
            aria-current={i === index ? 'step' : undefined}
            onClick={() => setIndex(i)}
          >
            <span className="stage-num">{i + 1}</span>
            <strong dir="auto"><T v={s.label} /></strong>
            <small>{s.sub}</small>
          </button>
        ))}
      </div>

      <div className="panel stage-detail" aria-live="polite">
        <strong><T v={stage.label} /></strong>
        <p><T v={stage.detail} /></p>
        {stage.code && <pre className="stage-code" dir="ltr">{stage.code}</pre>}
        <button className="nav primary stage-next" onClick={() => setIndex(last ? 0 : index + 1)}>
          {last ? t('restart') : t('nextStep')}
        </button>
      </div>
    </div>
  )
}
