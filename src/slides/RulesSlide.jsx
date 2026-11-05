import { useState } from 'react'
import { T, useT } from '../i18n.jsx'

export default function RulesSlide({ slide }) {
  const t = useT()
  const [opened, setOpened] = useState({})
  const found = Object.keys(opened).length

  return (
    <div className="stack">
      <div className="choices">
        {slide.items.map((it) => {
          const open = opened[it.code]
          return (
            <button
              key={it.code}
              className={'choice' + (open ? (it.ok ? ' good' : ' wrong') : '')}
              onClick={() => setOpened({ ...opened, [it.code]: true })}
            >
              <code>{it.code}</code>
              {open
                ? <span><b>{it.ok ? t('correct') : t('wrong')}</b> <T v={it.why} /></span>
                : <span className="hint">{t('clickToCheck')}</span>}
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
