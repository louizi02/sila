import { useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

const BITS = [['r', 4], ['w', 2], ['x', 1]]
const ROLES = ['owner', 'group', 'others']

const fromOctal = (code) => code.split('').map(Number)
const has = (digit, value) => (digit & value) !== 0

export default function PermsSlide({ slide }) {
  const t = useT()
  const [digits, setDigits] = useState(fromOctal(slide.start))
  const code = digits.join('')
  const text = digits.map((d) => BITS.map(([c, v]) => (has(d, v) ? c : '-')).join('')).join('')

  const flip = (role, value) => setDigits(digits.map((d, i) => (i === role ? d ^ value : d)))

  const checks = slide.checks.map((c) => ({ ...c, ok: c.test(digits) }))
  const allGood = checks.every((c) => c.ok)

  const wires = ROLES.map((r, i) => ({
    from: 'p-' + r,
    to: 'p-d' + i,
    color: ['var(--cyan)', 'var(--pink)', 'var(--amber)'][i],
    tick: code,
  }))

  return (
    <div className="stack">
      <div className="variants" role="group">
        {slide.presets.map((p) => (
          <button key={p} className={'variant' + (p === code ? ' on' : '')} aria-pressed={p === code} onClick={() => setDigits(fromOctal(p))}>
            <code>{p}</code>
          </button>
        ))}
      </div>

      <div className="wired perms" dir="ltr">
        <Wires wires={wires} vertical />
        <div className="perm-grid">
          {ROLES.map((role, r) => (
            <section key={role} className="perm-col" data-w={'p-' + role}>
              <strong dir="auto"><T v={'perm_' + role} /></strong>
              <small dir="auto"><T v={slide.who[r]} /></small>
              <div className="perm-bits">
                {BITS.map(([c, v]) => (
                  <button key={c} className={'perm-bit' + (has(digits[r], v) ? ' on' : '')} aria-pressed={has(digits[r], v)} aria-label={t('perm_' + role) + ' ' + c} onClick={() => flip(r, v)}>{c}</button>
                ))}
              </div>
              <b>{digits[r]}</b>
            </section>
          ))}
        </div>
        <pre className="perm-cmd">
          <div>chmod <span data-w="p-d0" className="c-cyan">{digits[0]}</span><span data-w="p-d1" className="c-pink">{digits[1]}</span><span data-w="p-d2" className="k-ws">{digits[2]}</span> {slide.file}</div>
          <div className="k-plain">-{text} 1 {slide.owner} {slide.groupName} 120 {slide.file}</div>
        </pre>
      </div>

      <ul className={'checks' + (allGood ? ' done' : '')} aria-live="polite">
        {checks.map((c, i) => <li key={i} className={c.ok ? 'ok' : 'bad'}><span aria-hidden="true">{c.ok ? '✓' : '✗'}</span> <T v={c.label} /></li>)}
      </ul>

      <div className="panel"><p className="note"><T v={slide.note} /></p></div>
    </div>
  )
}
