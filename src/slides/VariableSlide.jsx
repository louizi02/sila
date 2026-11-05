import { useState } from 'react'
import Wires from '../Wires.jsx'
import { T, useT } from '../i18n.jsx'

const VALID = /^[a-zA-Z_\u0080-￿][a-zA-Z0-9_\u0080-￿]*$/
const isNumber = (v) => /^-?\d+(\.\d+)?$/.test(v)

export default function VariableSlide({ slide }) {
  const t = useT()
  const [part, setPart] = useState('dollar')
  const [name, setName] = useState('age')
  const [value, setValue] = useState('25')

  const valid = VALID.test(name)
  const shown = isNumber(value) ? value : `"${value.replace(/"/g, '\\"')}"`
  const tokens = [
    { id: 'dollar', text: '$', cls: 'c-pink' },
    { id: 'name', text: name || '…', cls: 'c-cyan' },
    { id: 'equal', text: ' = ', cls: 'c-dim' },
    { id: 'value', text: shown, cls: 'c-lime' },
    { id: 'end', text: ';', cls: 'c-dim' },
  ]

  return (
    <div className="stack wired">
      <Wires wires={[{ from: 'tok-' + part, to: 'explain', color: 'var(--cyan)', tick: t('value') + name + value }]} />
      <div className="bigcode" dir="ltr">
        {tokens.map((tk) => (
          <button
            key={tk.id}
            data-w={'tok-' + tk.id}
            className={`tok ${tk.cls}` + (part === tk.id ? ' on' : '')}
            onClick={() => setPart(tk.id)}
          >
            {tk.text}
          </button>
        ))}
      </div>

      <div className="panel explain" data-w="explain" aria-live="polite">
        <strong><T v={slide.parts[part].label} /></strong>
        <p><T v={slide.parts[part].text} /></p>
      </div>

      <div className="grid2">
        <label className="field">
          <span>{t('varName')}</span>
          <input id="var-name" dir="ltr" value={name} onChange={(e) => setName(e.target.value)} spellCheck="false" />
          <em className={valid ? 'ok' : 'bad'}><T v={valid ? 'nameOk' : 'nameBad'} /></em>
        </label>
        <label className="field">
          <span>{t('value')}</span>
          <input id="var-value" dir="ltr" value={value} onChange={(e) => setValue(e.target.value)} spellCheck="false" />
          <em className="ok">{isNumber(value) ? t('isNumber') : t('isText')}</em>
        </label>
      </div>

      <div className="output" dir="ltr">
        <code>echo ${name};</code>
        <span className="arrow">→</span>
        {valid ? <samp>{value}</samp> : <samp className="err">Parse error</samp>}
      </div>
    </div>
  )
}
