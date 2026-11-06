import { useEffect, useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

// Diapositive réutilisable : un fichier source, ce qu'il produit, et les lignes entre les deux.
// Chaque version (variant) montre une façon d'écrire le même code.
// Une version avec `trace` s'exécute ligne par ligne (voir TraceView).

const WIRE_COLOR = { php: 'var(--cyan)', html: 'var(--amber)', err: 'var(--red)' }
const list = (x) => (Array.isArray(x) ? x : x ? [x] : [])
const STEP_MS = 1100

function Segs({ segs }) {
  const t = useT()
  return segs.map(([text, kind], i) => (
    <span key={i} className={'k-' + kind}>{kind === 'none' ? t('nothingSent') : text}</span>
  ))
}

function SourcePane({ label, lines, lineId, lineClass }) {
  return (
    <section className="pane">
      <header className="pane-head">{label}</header>
      <pre className="lines">
        {lines.map((line, i) => (
          <div key={i} className={'line' + (lineClass ? lineClass(i + 1) : '')} data-w={lineId(line, i + 1)}>
            <span className="ln">{i + 1}</span>
            <span className="code"><Segs segs={line.segs} /></span>
          </div>
        ))}
      </pre>
    </section>
  )
}

// Résultat fixe : chaque ligne de résultat est reliée aux lignes qui la produisent.
function StaticView({ slide, v }) {
  const t = useT()
  const kindOf = (id) => v.lines.find((l) => l.id === id)?.k
  const wires = v.output.flatMap((o, i) =>
    list(o.from).map((from) => ({
      from: 'src-' + from,
      to: 'out-' + i,
      color: WIRE_COLOR[kindOf(from)] ?? 'var(--cyan)',
      tick: v.id,
    })),
  )

  return (
    <div className="wired flow" dir="ltr">
      <Wires wires={wires} gutter />
      <SourcePane label={v.sourceLabel ?? slide.sourceLabel} lines={v.lines} lineId={(line) => (line.id ? 'src-' + line.id : undefined)} />
      <section className="pane">
        <header className="pane-head label" dir="auto">{t(v.outputLabel ?? slide.outputLabel)}</header>
        <pre className="lines">
          {v.output.map((line, i) => (
            <div key={i} className="line" data-w={'out-' + i}>
              <span className="code"><Segs segs={line.segs} /></span>
            </div>
          ))}
        </pre>
      </section>
    </div>
  )
}

// Exécution pas à pas : la ligne en cours s'allume, et une ligne néon la relie
// à ce qu'elle produit (navigateur) ou à ce que PHP fait sur le serveur (terminal).
function TraceView({ slide, v }) {
  const t = useT()
  const trace = v.trace
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const done = step === trace.length - 1
  const current = trace[step]

  useEffect(() => {
    if (!playing) return
    if (done) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setStep((s) => s + 1), step < 0 ? 200 : STEP_MS)
    return () => clearTimeout(id)
  }, [playing, step, done])

  const seen = trace.slice(0, step + 1)
  const output = seen.map((s) => s.out ?? '').join('')
  const logs = seen.filter((s) => s.log)
  const ran = new Set(seen.map((s) => s.line))
  const vars = current?.vars ?? {}

  const wires = current
    ? [{
        from: 'ln-' + current.line,
        to: current.out != null ? 'win-out' : 'log-last',
        color: current.out != null ? 'var(--lime)' : 'var(--cyan)',
        tick: step,
      }]
    : []

  const play = () => {
    if (done) setStep(-1)
    setPlaying(true)
  }
  const next = () => {
    setPlaying(false)
    setStep((s) => Math.min(trace.length - 1, s + 1))
  }
  const reset = () => {
    setPlaying(false)
    setStep(-1)
  }

  return (
    <>
      <div className="player" role="group" aria-label={t('player')}>
        {playing
          ? <button className="nav primary" onClick={() => setPlaying(false)}>{t('pause')}</button>
          : <button className="nav primary" onClick={play}>{t('run')}</button>}
        <button className="nav" onClick={next} disabled={done}>{t('stepOnce')}</button>
        <button className="nav" onClick={reset} disabled={step < 0}>{t('reset')}</button>
        <span className="player-count" dir="ltr">{Math.max(step + 1, 0)} / {trace.length}</span>
      </div>

      <div className="wired flow" dir="ltr">
        <Wires wires={wires} gutter />
        <SourcePane
          label={v.sourceLabel ?? slide.sourceLabel}
          lines={v.lines}
          lineId={(_, n) => 'ln-' + n}
          lineClass={(n) => (current?.line === n ? ' run' : ran.has(n) ? ' ran' : '')}
        />

        <div className="windows">
          <section className="window browser">
            <header className="window-bar">
              <span className="dots"><i /><i /><i /></span>
              <span className="url">localhost:8000/{v.sourceLabel ?? slide.sourceLabel}</span>
            </header>
            <pre className="window-body" data-w="win-out">
              {output
                ? <span className={'k-out' + (current?.out != null ? ' flash' : '')} key={step}>{output}</span>
                : <span className="k-none">{t('emptyPage')}</span>}
            </pre>
          </section>

          <section className="window terminal">
            <header className="window-bar">
              <span className="dots"><i /><i /><i /></span>
              <span className="url" dir="auto">{t('serverWork')}</span>
            </header>
            <div className="window-body log" aria-live="polite">
              {logs.length === 0 && <p className="k-none" dir="auto">{t('pressRun')}</p>}
              {logs.map((s, i) => (
                <p key={i} dir="auto" data-w={i === logs.length - 1 ? 'log-last' : undefined} className={i === logs.length - 1 ? 'now' : ''}>
                  <span className="prompt" dir="ltr">L{s.line}</span> <T v={s.log} />
                </p>
              ))}
            </div>
            {Object.keys(vars).length > 0 && (
              <footer className="memory">
                <span dir="auto">{t('memory')}</span>
                {Object.entries(vars).map(([name, value]) => (
                  <code key={name} className="var-chip">{name} = {value}</code>
                ))}
              </footer>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

export default function FlowSlide({ slide }) {
  const [variantId, setVariantId] = useState(slide.variants[0].id)
  const v = slide.variants.find((x) => x.id === variantId)

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

      {v.trace ? <TraceView key={v.id} slide={slide} v={v} /> : <StaticView slide={slide} v={v} />}

      <div className="panel" aria-live="polite">
        <p className="note"><T v={v.note} /></p>
      </div>
    </div>
  )
}
