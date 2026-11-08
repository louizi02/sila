import { createElement } from 'react'
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

// Animation de la carte DevOps : la boucle continue, du code à l'exploitation.
function DevopsAnim() {
  const loop = 'M90 36 C90 8 30 8 30 36 C30 64 90 64 90 36 C90 8 150 8 150 36 C150 64 90 64 90 36'
  return (
    <span className="dv-anim" dir="ltr" aria-hidden="true">
      <svg viewBox="0 0 180 72">
        <path className="dv-path" d={loop} />
        <circle className="dv-dot" r="4" />
        <text x="46" y="39">build</text>
        <text x="48" y="12">code</text>
        <text x="110" y="39">deploy</text>
        <text x="112" y="12">run</text>
      </svg>
    </span>
  )
}

const animations = { php: PhpAnim, devops: DevopsAnim }

function moduleProgress(course) {
  const modules = course.parts.flatMap((p) => p.modules)
  return `${modules.filter((m) => m.slides.length > 0).length}/${modules.length}`
}

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
                    {item.course ? <T v="modulesCount" x={moduleProgress(item.course)} /> : t('soon')}
                  </span>
                </span>
                {animations[item.anim] ? createElement(animations[item.anim]) : <code className="card-code">{item.snippet}</code>}
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
