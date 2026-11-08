import { useEffect, useRef, useState } from 'react'
import { T, useT } from '../i18n.jsx'
import { PlayerBar, usePlayer } from './usePlayer.jsx'

const X = 58
const Y = 64
const PAD = 34

function Graph({ state }) {
  const pos = Object.fromEntries(state.commits.map((c) => [c.id, { x: PAD + c.x * X, y: 40 + c.y * Y }]))
  const width = Math.max(...state.commits.map((c) => pos[c.id].x)) + 56
  const height = Math.max(...state.commits.map((c) => pos[c.id].y)) + 42

  return (
    <div className="git-graph" dir="ltr">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Git">
        {state.commits.flatMap((c) => (c.parents ?? []).map((p) => (
          <line key={c.id + p} x1={pos[p].x} y1={pos[p].y} x2={pos[c.id].x} y2={pos[c.id].y} className={'git-edge' + (c.st === 'ghost' ? ' ghost' : '')} />
        )))}
        {state.commits.map((c) => (
          <g key={c.id} className={'git-commit ' + (c.st ?? '')}>
            <circle cx={pos[c.id].x} cy={pos[c.id].y} r="11" />
            <text x={pos[c.id].x} y={pos[c.id].y + 4} className="git-msg">{c.msg}</text>
            {c.hash && <text x={pos[c.id].x} y={pos[c.id].y + 26} className="git-hash">{c.hash}</text>}
          </g>
        ))}
        {Object.entries(state.refs).map(([name, id], i) => (
          <text key={name} x={pos[id].x} y={pos[id].y - 18 - (i % 2 && Object.values(state.refs).filter((v) => v === id).length > 1 ? 13 : 0)} className="git-ref">{name}</text>
        ))}
      </svg>
    </div>
  )
}

function Run({ scenario }) {
  const t = useT()
  const steps = scenario.steps
  const player = usePlayer(steps.length, 2200)
  const { step } = player
  const current = steps[Math.max(step, 0)]
  const seen = steps.slice(0, step + 1).filter((s) => s.cmd)
  const shell = useRef(null)

  useEffect(() => {
    if (shell.current) shell.current.scrollTop = shell.current.scrollHeight
  }, [step])

  return (
    <>
      <PlayerBar player={player} length={steps.length} />
      <Graph state={current} />
      <div className="panel"><p className="note"><T v={current.text} /></p></div>
      <section className="window terminal">
        <header className="window-bar">
          <span className="dots"><i /><i /><i /></span>
          <span className="url" dir="auto">{t('realOutput')}</span>
        </header>
        <div className="shell" ref={shell} dir="ltr" aria-live="polite">
          {seen.length === 0 && <p className="k-none" dir="auto">{t('pressRun')}</p>}
          {seen.map((s, i) => (
            <div key={i}>
              <div className="shell-cmd"><span>$</span> {s.cmd}</div>
              {s.out && <pre className="shell-out">{s.out}</pre>}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default function GitSlide({ slide }) {
  const [id, setId] = useState(slide.scenarios[0].id)
  const scenario = slide.scenarios.find((s) => s.id === id)
  return (
    <div className="stack">
      {slide.scenarios.length > 1 && (
        <div className="variants" role="group">
          {slide.scenarios.map((s) => (
            <button key={s.id} className={'variant' + (s.id === id ? ' on' : '')} aria-pressed={s.id === id} onClick={() => setId(s.id)}>
              <T v={s.label} />
            </button>
          ))}
        </div>
      )}
      <Run key={id} scenario={scenario} />
      <div className="panel"><p className="note"><T v={scenario.note} /></p></div>
    </div>
  )
}
