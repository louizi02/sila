import { useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

function median(values) {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

const hours = (h) => (h >= 48 ? `${Math.round(h / 24)} j` : `${h} h`)
const ratio = (part, total) => `${Math.round((part / total) * 100)} %`

function Team({ slide, preset }) {
  const t = useT()
  const [rows, setRows] = useState(preset.rows)
  const [touched, setTouched] = useState(null)

  const toggle = (id, field) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: !r[field] } : r)))
    setTouched({ id, field })
  }

  const failed = rows.filter((r) => r.failed)
  const recovery = median(failed.map((r) => r.recovery))
  const metrics = [
    { id: 'lead', label: 'mLead', value: hours(median(rows.map((r) => r.lead))) },
    { id: 'freq', label: 'mFreq', value: `${(rows.length / slide.weeks).toFixed(1)} / sem` },
    { id: 'rec', label: 'mRecovery', value: recovery == null ? '—' : `${recovery} min` },
    { id: 'cfr', label: 'mCfr', value: ratio(failed.length, rows.length) },
    { id: 'rwk', label: 'mRework', value: ratio(rows.filter((r) => r.hotfix).length, rows.length) },
  ]

  const targets = touched ? (touched.field === 'failed' ? ['cfr', 'rec'] : ['rwk']) : []
  const wires = targets.map((m) => ({
    from: 'row-' + touched.id,
    to: 'm-' + m,
    color: touched.field === 'failed' ? 'var(--red)' : 'var(--amber)',
    tick: JSON.stringify(rows),
  }))

  return (
    <div className="wired flow dora" dir="ltr">
      <Wires wires={wires} gutter />
      <section className="pane">
        <header className="pane-head label" dir="auto">{t('deployLog')}</header>
        <div className="dora-rows">
          {rows.map((r) => (
            <div key={r.id} className="dora-row" data-w={'row-' + r.id}>
              <code>#{r.id}</code>
              <span className="dora-lead">{hours(r.lead)}</span>
              <button className={'chip' + (r.failed ? ' bad' : '')} aria-pressed={r.failed} onClick={() => toggle(r.id, 'failed')}>{t('chipFailed')}</button>
              <button className={'chip' + (r.hotfix ? ' warn' : '')} aria-pressed={r.hotfix} onClick={() => toggle(r.id, 'hotfix')}>{t('chipHotfix')}</button>
            </div>
          ))}
        </div>
      </section>
      <div className="dora-metrics">
        {metrics.map((m) => (
          <div key={m.id} className="metric" data-w={'m-' + m.id} dir="auto">
            <span><T v={m.label} /></span>
            <b dir="ltr">{m.value}</b>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DoraSlide({ slide }) {
  const [id, setId] = useState(slide.presets[0].id)
  const preset = slide.presets.find((p) => p.id === id)

  return (
    <div className="stack">
      <div className="variants" role="group">
        {slide.presets.map((p) => (
          <button key={p.id} className={'variant' + (p.id === id ? ' on' : '')} aria-pressed={p.id === id} onClick={() => setId(p.id)}>
            <T v={p.label} />
          </button>
        ))}
      </div>
      <Team key={id} slide={slide} preset={preset} />
      <div className="panel"><p className="note"><T v={preset.note} /></p></div>
    </div>
  )
}
