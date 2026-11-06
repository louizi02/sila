import { catalog } from './courses/index.js'
import { T, useT } from './i18n.jsx'

// Animation de la carte PHP : le code part au serveur, PHP l'exécute, le résultat revient.
function PhpAnim() {
  return (
    <span className="php-anim" dir="ltr" aria-hidden="true">
      <code className="pa-src">{'<?= $nom ?>'}</code>
      <span className="pa-track"><i className="pa-dot pa-dot1" /></span>
      <span className="pa-core">PHP</span>
      <span className="pa-track"><i className="pa-dot pa-dot2" /></span>
      <code className="pa-out">Salma</code>
    </span>
  )
}

const readyModules = (course) => course.parts.flatMap((p) => p.modules).filter((m) => m.slides.length > 0).length

export default function Home({ onOpen }) {
  const t = useT()

  return (
    <main className="stage">
      <div className="slide home">
        <h1><T v="chooseTech" /></h1>
        <p className="lead"><T v="tagline" /></p>
        <div className="cards">
          {catalog.map((item) => {
            const body = (
              <>
                <span className="card-head">
                  <strong dir="ltr">{item.name}</strong>
                  <span className={'badge' + (item.course ? ' live' : '')}>
                    {item.course ? <T v="modulesCount" x={readyModules(item.course)} /> : t('soon')}
                  </span>
                </span>
                {item.anim === 'php' ? <PhpAnim /> : <code className="card-code">{item.snippet}</code>}
                <span className="card-text"><T v={item.blurb} /></span>
                {item.course && <span className="card-go">{t('start')}</span>}
              </>
            )
            return item.course ? (
              <button key={item.id} className="card open" style={{ '--k': item.color }} onClick={() => onOpen(item.id)}>{body}</button>
            ) : (
              <div key={item.id} className="card locked" style={{ '--k': item.color }}>{body}</div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
