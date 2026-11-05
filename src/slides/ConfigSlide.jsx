import { useState } from 'react'
import Wires from '../Wires.jsx'
import { echoFloat } from '../phpMath.js'
import { T, useT } from '../i18n.jsx'

const KEYS = {
  site_name: { color: 'var(--cyan)', quoted: true },
  db_host: { color: 'var(--pink)', quoted: true },
  tva: { color: 'var(--lime)', quoted: false },
}
const use = (key) => ({ use: key })
const REQ = { req: true }

const FILES = [
  {
    name: 'header.php',
    lines: [['<?php'], ['$config = ', REQ, ';'], ['echo "<h1>{', use('site_name'), '}</h1>";']],
    output: (c) => `<h1>${c.site_name}</h1>`,
  },
  {
    name: 'database.php',
    lines: [['<?php'], ['$config = ', REQ, ';'], ['$pdo = new PDO("mysql:host={', use('db_host'), '}");']],
  },
  {
    name: 'prix.php',
    lines: [['<?php'], ['$config = ', REQ, ';'], ['$prix = 100;'], ['$ttc = $prix * (1 + ', use('tva'), ' / 100);'], ['echo $ttc;']],
    output: (c) => echoFloat(100 * (1 + Number(c.tva || 0) / 100)),
  },
  {
    name: 'footer.php',
    lines: [['<?php'], ['$config = ', REQ, ';'], ['echo "© {', use('site_name'), '}";']],
    output: (c) => `© ${c.site_name}`,
  },
]

// Chaque endroit où un fichier utilise la config
const USES = FILES.flatMap((f) =>
  f.lines.flatMap((line, l) =>
    line.flatMap((seg) => {
      if (seg.use) return [{ file: f.name, key: seg.use, line: l + 1 }]
      if (seg.req) return [{ file: f.name, key: '__file', line: l + 1 }]
      return []
    }),
  ),
)
const useId = (u) => `u-${u.file}-${u.key}`
// La ligne néon arrive au début de la ligne de code, pour ne pas couvrir le texte
const rowId = (file, line) => {
  const seg = line.find((s) => s.use || s.req)
  return seg ? useId({ file, key: seg.req ? '__file' : seg.use }) : undefined
}

export default function ConfigSlide() {
  const t = useT()
  const [cfg, setCfg] = useState({ site_name: 'Ma Boutique', db_host: 'localhost', tva: '20' })
  const [sel, setSel] = useState({ type: 'file', id: 'config.php' })

  const isActive = (u) => {
    if (sel.type === 'key') return u.key === sel.id
    return sel.id === 'config.php' || u.file === sel.id
  }

  const wires = USES.map((u) => ({
    from: u.key === '__file' ? 'config-file' : 'key-' + u.key,
    to: useId(u),
    color: u.key === '__file' ? 'var(--amber)' : KEYS[u.key].color,
    dim: !isActive(u),
    tick: cfg,
  }))
  const active = USES.filter(isActive)
  const fileOn = (name) => active.some((u) => u.file === name)

  return (
    <div className="stack">
      <div className="wired board" dir="ltr">
        <Wires wires={wires} gutter />

        <section className={'file config' + (sel.id === 'config.php' ? ' on' : '')}>
          <button className="fname" data-w="config-file" onClick={() => setSel({ type: 'file', id: 'config.php' })}>config.php</button>
          <pre>
            <div>{'<?php'}</div>
            <div>return [</div>
            {Object.entries(KEYS).map(([k, m]) => (
              <div
                key={k}
                data-w={'key-' + k}
                className={'keyrow' + (sel.id === k ? ' on' : '')}
                style={{ '--k': m.color }}
                onClick={() => setSel({ type: 'key', id: k })}
              >
                <span className="keyname">'{k}'</span> =&gt; {m.quoted && "'"}
                <input
                  id={'cfg-' + k}
                  aria-label={'Valeur de ' + k}
                  inputMode={m.quoted ? 'text' : 'numeric'}
                  style={{ width: `${Math.max(3, cfg[k].length + 1)}ch` }}
                  value={cfg[k]}
                  onChange={(e) => setCfg({ ...cfg, [k]: m.quoted ? e.target.value : e.target.value.replace(/\D/g, '') })}
                  onFocus={() => setSel({ type: 'key', id: k })}
                  spellCheck="false"
                />
                {m.quoted && "'"},
              </div>
            ))}
            <div>];</div>
          </pre>
        </section>

        <div className="files">
          {FILES.map((f) => (
            <section key={f.name} className={'file' + (fileOn(f.name) ? ' lit' : ' off') + (sel.id === f.name ? ' on' : '')}>
              <button className="fname" onClick={() => setSel({ type: 'file', id: f.name })}>{f.name}</button>
              <pre>
                {f.lines.map((line, i) => (
                  <div key={i} data-w={rowId(f.name, line)}>
                    {line.map((seg, j) => {
                      if (typeof seg === 'string') return <span key={j}>{seg}</span>
                      if (seg.req) {
                        return <span key={j} className="requse">require 'config.php'</span>
                      }
                      return (
                        <span key={j} className="use" style={{ '--k': KEYS[seg.use].color }}>
                          $config['{seg.use}']<small>{cfg[seg.use]}</small>
                        </span>
                      )
                    })}
                  </div>
                ))}
              </pre>
              {f.output && <div className="fout"><span>{t('result')}</span><samp>{f.output(cfg)}</samp></div>}
            </section>
          ))}
        </div>
      </div>

      <div className="panel" aria-live="polite">
        <strong>
          <T v={sel.type === 'key' ? 'keyUsedIn' : 'fileLinks'} x={sel.id} />
        </strong>
        <ul className="links">
          {active.map((u) => (
            <li key={useId(u)}>
              <code>{u.file}:{u.line}</code>
              <span>
                {u.key === '__file'
                  ? <T v="requireText" />
                  : <><T v="usesValue" x={u.key} /> <bdi><b>{cfg[u.key]}</b></bdi></>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
