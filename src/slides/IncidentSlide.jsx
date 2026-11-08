import { useEffect, useRef, useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

// Exercice d'astreinte : chaque commande coûte du temps, et une mauvaise décision aussi.
function clock(start, minutes) {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function Game({ slide, onRestart }) {
  const t = useT()
  const [nodeId, setNodeId] = useState(slide.start)
  const [history, setHistory] = useState([])
  const [minutes, setMinutes] = useState(0)
  const screen = useRef(null)
  const node = slide.nodes[nodeId]
  const last = history[history.length - 1]

  useEffect(() => {
    if (screen.current) screen.current.scrollTop = screen.current.scrollHeight
  }, [history.length])

  const choose = (option) => {
    setHistory([...history, option])
    setMinutes(minutes + option.cost)
    setNodeId(option.next ?? nodeId)
  }

  const wires = last ? [{ from: 'cmd-last', to: 'next-move', color: last.good ? 'var(--lime)' : 'var(--amber)', tick: history.length }] : []

  return (
    <>
      <div className="alert-bar" role="status">
        <strong><T v="onCall" /></strong>
        <span><T v={slide.alert} /></span>
        <b dir="ltr">{clock(slide.startTime, minutes)}</b>
        <span dir="ltr" className="alert-min">+{minutes} min</span>
      </div>

      <div className="wired flow" dir="ltr">
        <Wires wires={wires} gutter />
        <section className="window terminal">
          <header className="window-bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="url">{slide.host}</span>
          </header>
          <div className="shell" ref={screen} aria-live="polite">
            {history.length === 0 && <p className="k-none" dir="auto">{t('chooseCommand')}</p>}
            {history.map((h, i) => (
              <div key={i} data-w={i === history.length - 1 ? 'cmd-last' : undefined}>
                <div className="shell-cmd"><span>$</span> {h.cmd}</div>
                <pre className="shell-out">{h.output}</pre>
              </div>
            ))}
          </div>
        </section>

        <div className="windows" data-w="next-move">
          {last && (
            <div className={'panel coach ' + (last.good ? 'good' : 'warn')} dir="auto">
              <strong><T v={last.good ? 'goodMove' : 'badMove'} /> <bdi dir="ltr">+{last.cost} min</bdi></strong>
              <p className="note"><T v={last.comment} /></p>
            </div>
          )}

          {node.end ? (
            <div className="panel postmortem" dir="auto">
              <strong><T v="postmortem" /></strong>
              <p className="note"><T v="incidentTime" x={`${minutes} min`} /> <T v="incidentBest" x={`${slide.bestMinutes} min`} /></p>
              <dl>
                {slide.postmortem.map((row, i) => (
                  <div key={i}><dt><T v={row.term} /></dt><dd><T v={row.text} /></dd></div>
                ))}
              </dl>
              <button className="nav primary" onClick={onRestart}>{t('restart')}</button>
            </div>
          ) : (
            <div className="commands">
              <p className="commands-q" dir="auto"><T v={node.question} /></p>
              {[...node.options].sort((a, b) => a.cmd.localeCompare(b.cmd)).map((o) => (
                <button key={o.cmd} className="command" onClick={() => choose(o)}>
                  <code>{o.cmd}</code>
                  <small dir="auto"><T v={o.does} /></small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function IncidentSlide({ slide }) {
  const [run, setRun] = useState(0)
  return (
    <div className="stack">
      <Game key={run} slide={slide} onRestart={() => setRun(run + 1)} />
    </div>
  )
}
