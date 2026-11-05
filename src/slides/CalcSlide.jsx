import { useState } from 'react'
import Wires from '../Wires.jsx'
import { calc } from '../phpMath.js'
import { useT } from '../i18n.jsx'

export default function CalcSlide({ slide }) {
  const t = useT()
  const [a, setA] = useState(12)
  const [b, setB] = useState(5)
  const [op, setOp] = useState('+')
  const res = calc(a, op, b)

  const wires = [
    { from: 'decl-a', to: 'use-a', color: 'var(--cyan)', tick: a },
    { from: 'decl-b', to: 'use-b', color: 'var(--pink)', tick: b },
    { from: 'total', to: 'echo', color: 'var(--lime)', tick: op },
    { from: 'echo', to: 'result', color: 'var(--lime)', tick: res.value ?? res.error },
  ]

  return (
    <div className="calc">
      <div className="stack">
        <div className="ops">
          {slide.ops.map((o) => (
            <button key={o.op} className={'op' + (o.op === op ? ' on' : '')} onClick={() => setOp(o.op)}>
              <code>{o.op}</code><span>{t(o.name)}</span>
            </button>
          ))}
        </div>
        <label className="field">
          <span dir="ltr">$a = {a}</span>
          <input id="calc-a" type="range" min="0" max="20" value={a} onChange={(e) => setA(+e.target.value)} className="r-cyan" />
        </label>
        <label className="field">
          <span dir="ltr">$b = {b}</span>
          <input id="calc-b" type="range" min="0" max="20" value={b} onChange={(e) => setB(+e.target.value)} className="r-pink" />
        </label>
      </div>

      <div className="wired codecard" dir="ltr">
        <Wires wires={wires} vertical />
        <pre className="calc-code">
          <div className="row decls">
            <span className="decl"><span data-w="decl-a" className="c-cyan">$a</span> = <b>{a}</b>;</span>
            <span className="decl"><span data-w="decl-b" className="c-pink">$b</span> = <b>{b}</b>;</span>
          </div>
          <div className="row"><span data-w="total" className="c-lime">$total</span> = <span data-w="use-a" className="c-cyan">$a</span> {op} <span data-w="use-b" className="c-pink">$b</span>;</div>
          <div className="row">echo <span data-w="echo" className="c-lime">$total</span>;</div>
        </pre>
        <div className={'result' + (res.error ? ' error' : '')} data-w="result" aria-live="polite">
          {res.error ?? res.value}
        </div>
      </div>
    </div>
  )
}
