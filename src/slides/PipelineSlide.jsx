import { useEffect, useMemo, useRef, useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'
import { SourcePane } from './FlowSlide.jsx'
import { PlayerBar, usePlayer } from './usePlayer.jsx'

// Transforme les étapes du pipeline en événements pour un scénario donné.
// À la première étape en échec, les étapes suivantes ne sont jamais jouées.
function buildRun(stages, scenario) {
  const events = []
  for (const stage of stages) {
    for (const step of stage.steps) {
      if (scenario.failAt === step.id) {
        events.push({ stage: stage.id, line: step.line, log: scenario.failLog, status: 'fail' })
        for (const after of scenario.after ?? []) events.push({ ...after, stage: stage.id, status: 'recover' })
        return events
      }
      events.push({ stage: stage.id, line: step.line, log: step.log, effect: step.effect, status: 'ok' })
    }
  }
  return events
}

function stageStatus(stage, seen, finished) {
  const own = seen.filter((e) => e.stage === stage.id)
  if (own.some((e) => e.status === 'fail')) return 'failed'
  if (own.length === 0) return finished ? 'skipped' : 'idle'
  const last = seen[seen.length - 1]
  if (last.stage === stage.id && !(finished && own.length === stage.steps.length)) return 'running'
  return own.length === stage.steps.length ? 'passed' : 'running'
}

function Run({ slide, scenario }) {
  const t = useT()
  const events = useMemo(() => buildRun(slide.stages, scenario), [slide.stages, scenario])
  const player = usePlayer(events.length, 1300)
  const { step, done } = player
  const seen = events.slice(0, step + 1)
  const current = events[step]
  const ran = new Set(seen.map((e) => e.line))
  const state = seen.reduce((acc, e) => ({ ...acc, ...e.effect }), slide.initialState)
  const logRef = useRef(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [step])

  const statuses = slide.stages.map((s) => stageStatus(s, seen, done && step >= 0))
  const railWires = slide.stages.slice(1).map((s, i) => ({
    from: 'ps-' + slide.stages[i].id,
    to: 'ps-' + s.id,
    color: statuses[i] === 'failed' ? 'var(--red)' : 'var(--cyan)',
    dim: statuses[i] !== 'passed',
  }))
  const lineWires = current
    ? [{ from: 'ln-' + current.line, to: 'log-last', color: current.status === 'fail' ? 'var(--red)' : 'var(--cyan)', tick: step }]
    : []

  return (
    <>
      <PlayerBar player={player} length={events.length} />

      <div className="wired rail" dir="ltr">
        <Wires wires={railWires} />
        {slide.stages.map((s, i) => (
          <div key={s.id} className={'rail-node ' + statuses[i]} data-w={'ps-' + s.id}>
            <strong>{s.label}</strong>
            <small dir="auto">{t('st_' + statuses[i])}</small>
          </div>
        ))}
      </div>

      <div className="wired flow" dir="ltr">
        <Wires wires={lineWires} gutter />
        <SourcePane
          label={slide.sourceLabel}
          lines={slide.lines}
          lineId={(_, n) => 'ln-' + n}
          lineClass={(n) => (current?.line === n ? ' run' : ran.has(n) ? ' ran' : '')}
        />
        <div className="windows">
          <section className="window terminal">
            <header className="window-bar">
              <span className="dots"><i /><i /><i /></span>
              <span className="url" dir="auto">{t('runnerLogs')}</span>
            </header>
            <div className="window-body log" aria-live="polite" ref={logRef}>
              {seen.length === 0 && <p className="k-none" dir="auto">{t('pressRun')}</p>}
              {seen.map((e, i) => (
                <p key={i} dir="auto" data-w={i === seen.length - 1 ? 'log-last' : undefined} className={(i === seen.length - 1 ? 'now ' : '') + (e.status === 'fail' ? 'failed' : '')}>
                  <span className="prompt" dir="ltr">L{e.line}</span> <T v={e.log} />
                </p>
              ))}
            </div>
          </section>

          <section className="env-state" dir="ltr">
            {Object.entries(state).map(([name, value]) => (
              <div key={name} className="env">
                <span>{name}</span>
                <code>{value}</code>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  )
}

export default function PipelineSlide({ slide }) {
  const [id, setId] = useState(slide.scenarios[0].id)
  const scenario = slide.scenarios.find((s) => s.id === id)

  return (
    <div className="stack">
      <div className="variants" role="group">
        {slide.scenarios.map((s) => (
          <button key={s.id} className={'variant' + (s.id === id ? ' on' : '')} aria-pressed={s.id === id} onClick={() => setId(s.id)}>
            <T v={s.label} />
          </button>
        ))}
      </div>
      <Run key={id} slide={slide} scenario={scenario} />
      <div className="panel"><p className="note"><T v={scenario.note} /></p></div>
    </div>
  )
}
