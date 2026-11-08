import { useCallback, useEffect, useState } from 'react'
import { catalog } from './courses/index.js'
import Home from './Home.jsx'
import { T, useLang, useT } from './i18n.jsx'
import VariableSlide from './slides/VariableSlide.jsx'
import RulesSlide from './slides/RulesSlide.jsx'
import CalcSlide from './slides/CalcSlide.jsx'
import ConfigSlide from './slides/ConfigSlide.jsx'
import FlowSlide from './slides/FlowSlide.jsx'
import StepsSlide from './slides/StepsSlide.jsx'
import { Deeper, Words } from './slides/Explain.jsx'
import BatchSlide from './slides/BatchSlide.jsx'
import PipelineSlide from './slides/PipelineSlide.jsx'
import DeploySlide from './slides/DeploySlide.jsx'
import DoraSlide from './slides/DoraSlide.jsx'
import IncidentSlide from './slides/IncidentSlide.jsx'

const slideTypes = {
  variable: VariableSlide, rules: RulesSlide, calc: CalcSlide, config: ConfigSlide, flow: FlowSlide, steps: StepsSlide,
  batch: BatchSlide, pipeline: PipelineSlide, deploy: DeploySlide, dora: DoraSlide, incident: IncidentSlide,
}

function TopBar({ onHome, children }) {
  const { lang, setLang } = useLang()
  const t = useT()
  return (
    <header className="top">
      <button className="brand" onClick={onHome} aria-label={t('home')}>
        <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width="32" height="32" />
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

export const allModules = (course) => course.parts.flatMap((p) => p.modules)

function ModuleList({ course, onOpen }) {
  const t = useT()
  let number = 0
  return (
    <main className="stage">
      <div className="slide">
        <h1><T v={course.title} /></h1>
        <p className="lead"><T v={course.lead} /></p>
        {course.parts.map((part) => (
          <section key={part.id} className="part">
            <header className="part-head">
              <h2><T v={part.title} /></h2>
              <p><T v={part.lead} /></p>
            </header>
            <ol className="modules">
              {part.modules.map((m) => {
                const ready = m.slides.length > 0
                const num = number++
                const body = (
                  <>
                    <span className="mod-num" dir="ltr">{String(num).padStart(2, '0')}</span>
                    <span className="mod-body">
                      <strong><T v={m.title} /></strong>
                      {t(m.notions) && <span className="mod-notions"><T v={m.notions} /></span>}
                    </span>
                    <span className={'badge' + (ready ? ' live' : '')}>
                      {ready ? <T v="slidesCount" x={m.slides.length} /> : t('soon')}
                    </span>
                  </>
                )
                return (
                  <li key={m.id}>
                    {ready
                      ? <button className="module open" onClick={() => onOpen(m.id)}>{body}</button>
                      : <div className="module locked">{body}</div>}
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </main>
  )
}

function ModuleView({ module, onDone }) {
  const { lang } = useLang()
  const t = useT()
  const [index, setIndex] = useState(0)
  const slide = module.slides[index]
  const Slide = slideTypes[slide.type]
  const last = index === module.slides.length - 1
  const go = useCallback(
    (n) => setIndex((i) => Math.min(module.slides.length - 1, Math.max(0, i + n))),
    [module.slides.length],
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
    <>
      <nav className="steps-bar" aria-label={t('slidesLabel')}>
        <span className="mod-title"><T v={module.title} /></span>
        <div className="steps">
          {module.slides.map((s, i) => (
            <button
              key={s.id}
              className={'step' + (i === index ? ' on' : '') + (i < index ? ' done' : '')}
              onClick={() => setIndex(i)}
              aria-current={i === index ? 'step' : undefined}
            >
              {t(s.nav)}
            </button>
          ))}
        </div>
      </nav>

      <main className="stage" key={slide.id}>
        <div className="slide">
          <h1><T v={slide.title} /></h1>
          <p className="lead"><T v={slide.lead} /></p>
          {slide.words && <Words words={slide.words} />}
          <Slide slide={slide} />
          {slide.deeper && <Deeper items={slide.deeper} />}
          {slide.source && (
            <a className="source" href={slide.source.url} target="_blank" rel="noreferrer">
              <T v="docs" x={t(slide.source.label)} /> ↗
            </a>
          )}
        </div>
      </main>

      <footer className="bottom">
        <button className="nav" onClick={() => go(-1)} disabled={index === 0}>{t('prev')}</button>
        <span className="count" dir="ltr">{index + 1} / {module.slides.length}</span>
        {last
          ? <button className="nav primary" onClick={onDone}>{t('finish')}</button>
          : <button className="nav primary" onClick={() => go(1)}>{t('next')}</button>}
      </footer>
    </>
  )
}

function CourseView({ course, onHome }) {
  const t = useT()
  const [moduleId, setModuleId] = useState(null)
  const module = allModules(course).find((m) => m.id === moduleId)

  return (
    <div className={'app' + (module ? ' with-steps' : ' no-footer')}>
      <TopBar onHome={onHome}>
        <button className="course" dir="ltr" onClick={() => setModuleId(null)} aria-label={t('modules')}>
          {course.name}
        </button>
      </TopBar>
      {module
        ? <ModuleView key={module.id} module={module} onDone={() => setModuleId(null)} />
        : <ModuleList course={course} onOpen={setModuleId} />}
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
