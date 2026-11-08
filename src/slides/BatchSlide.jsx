import { useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

// Modèle : chaque changement a une probabilité p, indépendante, d'introduire un défaut.
const MAX_CELLS = 200

function drawBatch(n, p) {
  return Array.from({ length: n }, () => Math.random() < p)
}

const percent = (x) => (x >= 0.995 ? '> 99' : x < 0.1 ? (x * 100).toFixed(1) : (x * 100).toFixed(0)) + ' %'

export default function BatchSlide({ slide }) {
  const t = useT()
  const [n, setN] = useState(20)
  const [pPct, setPPct] = useState(2)
  const [draw, setDraw] = useState(null)

  const p = pPct / 100
  const failP = 1 - (1 - p) ** n
  const deploys = Math.ceil(slide.monthlyChanges / n)
  const failed = deploys * failP
  const bisect = n === 1 ? 0 : Math.ceil(Math.log2(n))
  const defects = draw ? draw.filter(Boolean).length : 0

  const change = (setter) => (value) => {
    setter(value)
    setDraw(null)
  }
  const updateN = change(setN)
  const updateP = change(setPPct)

  const wires = [
    { from: 'b-n', to: 'b-f', color: 'var(--cyan)', tick: n + '-' + pPct },
    { from: 'b-p', to: 'b-f', color: 'var(--pink)', tick: n + '-' + pPct },
    { from: 'b-f', to: 'b-r', color: 'var(--lime)', tick: n + '-' + pPct },
  ]

  return (
    <div className="stack">
      <div className="variants" role="group">
        {slide.presets.map((x) => (
          <button key={x.n} className={'variant' + (x.n === n ? ' on' : '')} aria-pressed={x.n === n} onClick={() => updateN(x.n)}>
            <T v={x.label} />
          </button>
        ))}
      </div>

      <div className="calc">
        <div className="stack">
          <label className="field">
            <span><T v="batchSize" /> : <bdi dir="ltr">n = {n}</bdi></span>
            <input id="batch-n" type="range" min="1" max={MAX_CELLS} value={n} onChange={(e) => updateN(+e.target.value)} className="r-cyan" />
          </label>
          <label className="field">
            <span><T v="defectRate" /> : <bdi dir="ltr">p = {pPct} %</bdi></span>
            <input id="batch-p" type="range" min="0.5" max="10" step="0.5" value={pPct} onChange={(e) => updateP(+e.target.value)} className="r-pink" />
          </label>

          <div className="batch-grid" dir="ltr" aria-hidden="true">
            {Array.from({ length: n }, (_, i) => (
              <i key={i} className={draw ? (draw[i] ? 'bad' : 'good') : ''} />
            ))}
          </div>
          <div className="player">
            <button className="nav primary" onClick={() => setDraw(drawBatch(n, p))}>{t('shipBatch')}</button>
            {draw && (
              <span className={defects ? 'bad' : 'ok'} aria-live="polite">
                {defects
                  ? <T v="shipFailed" x={`${defects} / ${n}`} />
                  : t('shipOk')}
              </span>
            )}
          </div>
        </div>

        <div className="wired codecard" dir="ltr">
          <Wires wires={wires} vertical />
          <pre className="calc-code">
            <div className="row decls">
              <span className="decl"><span data-w="b-n" className="c-cyan">n</span> = <b>{n}</b></span>
              <span className="decl"><span data-w="b-p" className="c-pink">p</span> = <b>{p.toFixed(3)}</b></span>
            </div>
            <div className="row"><span data-w="b-f" className="c-lime">P(fail) = 1 - (1 - p)^n</span></div>
          </pre>
          <div className="result" data-w="b-r" aria-live="polite">{percent(failP)}</div>
        </div>
      </div>

      <div className="metrics">
        <div className="metric"><span><T v="deploysPerMonth" /></span><b dir="ltr">{deploys}</b></div>
        <div className="metric"><span><T v="failedPerMonth" /></span><b dir="ltr">{failed.toFixed(1)}</b></div>
        <div className="metric"><span><T v="suspects" /></span><b dir="ltr">{n}</b></div>
        <div className="metric"><span><T v="bisectSteps" /></span><b dir="ltr">{bisect}</b></div>
      </div>

      <div className="panel"><p className="note"><T v={slide.note} /></p></div>
    </div>
  )
}
