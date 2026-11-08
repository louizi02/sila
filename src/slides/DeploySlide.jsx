import { useEffect, useMemo, useRef, useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'
import { PlayerBar, usePlayer } from './usePlayer.jsx'

// Modèle du SRE Workbook : erreur globale = part du trafic exposée × taux d'erreur de la version.
const pct = (x) => `${Math.round(x * 1000) / 10} %`

function Cells({ count, kind }) {
  return (
    <div className="cells" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => <i key={i} className={kind} />)}
    </div>
  )
}

function Rollout({ slide, strategy, bug }) {
  const t = useT()
  const steps = useMemo(() => strategy.build(bug), [strategy, bug])
  const player = usePlayer(steps.length, 1500)
  const { step } = player
  const current = steps[Math.max(step, 0)]
  const errorRate = bug ? slide.errorRate : 0
  const globalError = current.f * errorRate
  const seen = steps.slice(0, step + 1)
  const failedRequests = seen.reduce((sum, s) => sum + s.f * errorRate * slide.requestsPerStep, 0)
  const logRef = useRef(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [step])

  const wires = [
    { from: 'lb', to: 'grp-old', color: 'var(--cyan)', dim: current.f >= 1, tick: step },
    { from: 'lb', to: 'grp-new', color: bug ? 'var(--red)' : 'var(--lime)', dim: current.f <= 0, tick: step },
  ]

  return (
    <>
      <PlayerBar player={player} length={steps.length} />

      <div className="wired topo" dir="ltr">
        <Wires wires={wires} vertical />
        <div className="lb" data-w="lb"><span dir="auto">{t('loadBalancer')}</span></div>
        <div className="groups">
          <section className="group" data-w="grp-old">
            <header><strong>v41</strong><span>{pct(1 - current.f)}</span></header>
            <Cells count={current.v1} kind="old" />
          </section>
          <section className="group" data-w="grp-new">
            <header><strong>v42</strong><span>{pct(current.f)}</span></header>
            <Cells count={current.v2} kind={bug ? 'broken' : 'new'} />
          </section>
        </div>
      </div>

      <div className="metrics">
        <div className="metric"><span><T v="trafficNew" /></span><b dir="ltr">{pct(current.f)}</b></div>
        <div className={'metric' + (globalError > 0 ? ' alarm' : '')}><span><T v="globalError" /></span><b dir="ltr">{pct(globalError)}</b></div>
        <div className={'metric' + (failedRequests > 0 ? ' alarm' : '')}><span><T v="failedRequests" /></span><b dir="ltr">{Math.round(failedRequests)}</b></div>
        <div className="metric"><span><T v="instances" /></span><b dir="ltr">{current.v1 + current.v2}</b></div>
      </div>

      <section className="window terminal">
        <header className="window-bar">
          <span className="dots"><i /><i /><i /></span>
          <span className="url" dir="auto">{t('rolloutLog')}</span>
        </header>
        <div className="window-body log" aria-live="polite" ref={logRef}>
          {seen.length === 0 && <p className="k-none" dir="auto">{t('pressRun')}</p>}
          {seen.map((s, i) => <p key={i} dir="auto" className={i === seen.length - 1 ? 'now' : ''}><T v={s.log} /></p>)}
        </div>
      </section>
    </>
  )
}

export default function DeploySlide({ slide }) {
  const t = useT()
  const [id, setId] = useState(slide.strategies[0].id)
  const [bug, setBug] = useState(true)
  const strategy = slide.strategies.find((s) => s.id === id)

  return (
    <div className="stack">
      <div className="variants" role="group">
        {slide.strategies.map((s) => (
          <button key={s.id} className={'variant' + (s.id === id ? ' on' : '')} aria-pressed={s.id === id} onClick={() => setId(s.id)}>
            <T v={s.label} />
          </button>
        ))}
        <button className={'variant toggle' + (bug ? ' on danger' : '')} aria-pressed={bug} onClick={() => setBug(!bug)}>
          {bug ? t('versionBug') : t('versionOk')}
        </button>
      </div>
      <Rollout key={id + bug} slide={slide} strategy={strategy} bug={bug} />
      <div className="panel"><p className="note"><T v={strategy.note} /></p></div>
    </div>
  )
}
