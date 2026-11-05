import { useCallback, useEffect, useState } from 'react'
import { catalog } from './courses/index.js'
import Home from './Home.jsx'
import { T, useLang, useT } from './i18n.jsx'
import VariableSlide from './slides/VariableSlide.jsx'
import RulesSlide from './slides/RulesSlide.jsx'
import CalcSlide from './slides/CalcSlide.jsx'
import ConfigSlide from './slides/ConfigSlide.jsx'

const slideTypes = { variable: VariableSlide, rules: RulesSlide, calc: CalcSlide, config: ConfigSlide }

function TopBar({ onHome, children }) {
  const { lang, setLang } = useLang()
  const t = useT()
  return (
    <header className="top">
      <button className="brand" onClick={onHome} aria-label={t('home')}>
        <img src="/logo.svg" alt="" width="32" height="32" />
        {lang === 'ar' ? 'صلة' : 'Sila'}
      </button>
      {children}
      <div className="langs" role="group" aria-label={t('languageLabel')}>
        <button className={'lang' + (lang === 'fr' ? ' on' : '')} aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>Français</button>
        <button className={'lang' + (lang === 'ar' ? ' on' : '')} aria-pressed={lang === 'ar'} onClick={() => setLang('ar')}>العربية</button>
      </div>
    </header>
  )
}

function CourseView({ course, onHome }) {
  const { lang } = useLang()
  const t = useT()
  const [index, setIndex] = useState(0)
  const slide = course.slides[index]
  const Slide = slideTypes[slide.type]
  const go = useCallback(
    (n) => setIndex((i) => Math.min(course.slides.length - 1, Math.max(0, i + n))),
    [course.slides.length],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const forward = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight'
      const back = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft'
      if (e.key === forward) go(1)
      if (e.key === back) go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, lang])

  return (
    <div className="app">
      <TopBar onHome={onHome}>
        <span className="course" dir="ltr">{course.name}</span>
        <nav className="steps" aria-label={t('slidesLabel')}>
          {course.slides.map((s, i) => (
            <button
              key={s.id}
              className={'step' + (i === index ? ' on' : '') + (i < index ? ' done' : '')}
              onClick={() => setIndex(i)}
              aria-current={i === index ? 'step' : undefined}
            >
              {t(s.nav)}
            </button>
          ))}
        </nav>
      </TopBar>

      <main className="stage" key={slide.id}>
        <div className="slide">
          <h1><T v={slide.title} /></h1>
          <p className="lead"><T v={slide.lead} /></p>
          <Slide slide={slide} />
          {slide.source && (
            <a className="source" href={slide.source.url} target="_blank" rel="noreferrer">
              <T v="docs" x={t(slide.source.label)} /> ↗
            </a>
          )}
        </div>
      </main>

      <footer className="bottom">
        <button className="nav" onClick={() => go(-1)} disabled={index === 0}>{t('prev')}</button>
        <span className="count" dir="ltr">{index + 1} / {course.slides.length}</span>
        <button className="nav primary" onClick={() => go(1)} disabled={index === course.slides.length - 1}>{t('next')}</button>
      </footer>
    </div>
  )
}

export default function App() {
  const [courseId, setCourseId] = useState(null)
  const item = catalog.find((c) => c.id === courseId)
  const goHome = () => setCourseId(null)

  if (item?.course) return <CourseView key={item.id} course={item.course} onHome={goHome} />

  return (
    <div className="app no-footer">
      <TopBar onHome={goHome} />
      <Home onOpen={setCourseId} />
    </div>
  )
}
