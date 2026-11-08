import { useEffect, useState } from 'react'
import { useT } from '../i18n.jsx'

// Lecture pas à pas partagée par toutes les animations.
export function usePlayer(length, stepMs = 1100) {
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const done = step === length - 1

  useEffect(() => {
    if (!playing) return
    if (done) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setStep((s) => s + 1), step < 0 ? 200 : stepMs)
    return () => clearTimeout(id)
  }, [playing, step, done, stepMs])

  return {
    step,
    playing,
    done,
    play: () => {
      if (done) setStep(-1)
      setPlaying(true)
    },
    pause: () => setPlaying(false),
    next: () => {
      setPlaying(false)
      setStep((s) => Math.min(length - 1, s + 1))
    },
    reset: () => {
      setPlaying(false)
      setStep(-1)
    },
  }
}

export function PlayerBar({ player, length }) {
  const t = useT()
  return (
    <div className="player" role="group" aria-label={t('player')}>
      {player.playing
        ? <button className="nav primary" onClick={player.pause}>{t('pause')}</button>
        : <button className="nav primary" onClick={player.play}>{t('run')}</button>}
      <button className="nav" onClick={player.next} disabled={player.done}>{t('stepOnce')}</button>
      <button className="nav" onClick={player.reset} disabled={player.step < 0}>{t('reset')}</button>
      <span className="player-count" dir="ltr">{Math.max(player.step + 1, 0)} / {length}</span>
    </div>
  )
}
