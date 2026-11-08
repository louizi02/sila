import { useState } from 'react'
import { T } from '../i18n.jsx'

// Budget d'erreur sur 30 jours : la part d'indisponibilité permise par le SLO.
const MONTH_MINUTES = 30 * 24 * 60
const SLOS = [99, 99.5, 99.9, 99.95, 99.99]

export default function BudgetSlide({ slide }) {
  const [slo, setSlo] = useState(99.9)
  const [down, setDown] = useState(20)
  const budget = MONTH_MINUTES * (1 - slo / 100)
  const used = Math.min(down / budget, 9.99)
  const left = budget - down
  const state = used >= 1 ? 'stop' : used >= 0.75 ? 'slow' : 'go'

  return (
    <div className="stack">
      <div className="variants" role="group">
        {SLOS.map((s) => (
          <button key={s} className={'variant' + (s === slo ? ' on' : '')} aria-pressed={s === slo} onClick={() => setSlo(s)} dir="ltr">{s} %</button>
        ))}
      </div>
      <label className="field">
        <span><T v="downMinutes" /> : <bdi dir="ltr">{down} min</bdi></span>
        <input id="budget-down" type="range" min="0" max="240" step="5" value={down} onChange={(e) => setDown(+e.target.value)} className="r-pink" />
      </label>
      <div className="meter budget" aria-hidden="true"><i className={state} style={{ width: `${Math.min(used, 1) * 100}%` }} /></div>
      <div className="metrics">
        <div className="metric"><span><T v="budgetTotal" /></span><b dir="ltr">{budget.toFixed(1)} min</b></div>
        <div className={'metric' + (left < 0 ? ' alarm' : '')}><span><T v="budgetLeft" /></span><b dir="ltr">{left.toFixed(1)} min</b></div>
        <div className={'metric' + (used >= 1 ? ' alarm' : '')}><span><T v="budgetUsed" /></span><b dir="ltr">{Math.round(used * 100)} %</b></div>
      </div>
      <div className="panel" aria-live="polite"><p className="note"><T v={slide.decisions[state]} /></p></div>
    </div>
  )
}
