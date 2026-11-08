import { T, useT } from '../i18n.jsx'

// Les mots techniques d'une diapositive, expliqués avant l'exercice.
export function Words({ words }) {
  const t = useT()
  return (
    <section className="words">
      <h2>{t('wordsTitle')}</h2>
      <dl>
        {words.map((w, i) => (
          <div key={i}>
            <dt><T v={w.term} /></dt>
            <dd><T v={w.def} /></dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// Les détails avancés restent disponibles, mais fermés par défaut.
export function Deeper({ items }) {
  const t = useT()
  return (
    <details className="deeper">
      <summary>{t('deeperTitle')}</summary>
      <ul>
        {items.map((item, i) => <li key={i}><T v={item} /></li>)}
      </ul>
    </details>
  )
}
