import { catalog } from './courses/index.js'
import { T, useT } from './i18n.jsx'

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
                    {item.course ? <T v="slidesCount" x={item.course.slides.length} /> : t('soon')}
                  </span>
                </span>
                <code className="card-code">{item.snippet}</code>
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
