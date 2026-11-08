import { useState } from 'react'
import { T, useT } from '../i18n.jsx'

// Cartes à révéler. Chaque carte montre du code (`code`) ou une phrase (`title`).
// Avec `reveal`, ce n'est pas un exercice : la carte s'ouvre sans « Correct » ni « Incorrect ».
export default function RulesSlide({ slide }) {
  const t = useT()
  const [opened, setOpened] = useState({})
  const found = Object.keys(opened).length

  return (
    <div className="stack">
      <div className="choices">
        {slide.items.map((it, i) => {
          const open = opened[i]
          const state = !open ? '' : slide.reveal ? ' seen' : it.ok ? ' good' : ' wrong'
          return (
            <button key={i} className={'choice' + state} aria-expanded={!!open} onClick={() => setOpened((prev) => ({ ...prev, [i]: true }))}>
              {it.code ? <code>{it.code}</code> : <strong className="choice-title"><T v={it.title} /></strong>}
              {open
                ? <span>{!slide.reveal && <b>{it.ok ? t('correct') : t('wrong')}</b>} <T v={it.why} /></span>
                : <span className="hint">{slide.reveal ? t('clickToOpen') : t('clickToCheck')}</span>}
            </button>
          )
        })}
      </div>
      <div className="meter" role="progressbar" aria-valuenow={found} aria-valuemin={0} aria-valuemax={slide.items.length}>
        <i style={{ width: `${(found / slide.items.length) * 100}%` }} />
      </div>
    </div>
  )
}
