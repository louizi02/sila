import { useLayoutEffect, useRef, useState } from 'react'
import { useLang } from './i18n.jsx'

// Dessine des lignes néon entre les éléments marqués data-w="id" dans le parent.
// gutter : quand les blocs sont empilés, la ligne passe par la marge de gauche
// pour ne pas couvrir le code.
// vertical : la ligne part toujours du bas d'un élément vers le haut de l'autre.
export default function Wires({ wires, gutter = false, vertical = false }) {
  const { lang } = useLang()
  const svg = useRef(null)
  const [paths, setPaths] = useState([])
  const signature = JSON.stringify(wires)

  useLayoutEffect(() => {
    const root = svg.current.parentElement
    const draw = () => {
      const base = root.getBoundingClientRect()
      const find = (id) => root.querySelector(`[data-w="${id}"]`)?.getBoundingClientRect()
      const next = []
      wires.forEach((w, i) => {
        const a = find(w.from)
        const b = find(w.to)
        if (!a || !b) return
        const ox = -base.left, oy = -base.top
        let d
        if (gutter && b.left < a.right - 4) {
          const x1 = a.left + ox, y1 = a.top + a.height / 2 + oy
          const x2 = b.left + ox, y2 = b.top + b.height / 2 + oy
          const k = 40 + (i % 4) * 6
          d = `M${x1} ${y1} C${x1 - k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`
        } else if (!vertical && b.left >= a.right - 4) {
          const x1 = a.right + ox, y1 = a.top + a.height / 2 + oy
          const x2 = b.left + ox, y2 = b.top + b.height / 2 + oy
          const c = Math.max(30, (x2 - x1) / 2)
          d = `M${x1} ${y1} C${x1 + c} ${y1} ${x2 - c} ${y2} ${x2} ${y2}`
        } else {
          const down = b.top >= a.top
          const x1 = a.left + a.width / 2 + ox, y1 = (down ? a.bottom : a.top) + oy
          const x2 = b.left + b.width / 2 + ox, y2 = (down ? b.top : b.bottom) + oy
          const c = (y2 - y1) / 2
          d = `M${x1} ${y1} C${x1} ${y1 + c} ${x2} ${y2 - c} ${x2} ${y2}`
        }
        next.push({ d, color: w.color, dim: w.dim, key: w.from + '>' + w.to })
      })
      setPaths(next)
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(root)
    document.fonts?.ready.then(draw)
    // Un bloc « sticky » bouge au défilement : les lignes doivent le suivre.
    window.addEventListener('scroll', draw, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', draw, true)
    }
  }, [signature, gutter, vertical, lang])

  return (
    <svg ref={svg} className="wires" aria-hidden="true">
      {paths.map((p) => (
        <path key={p.key} d={p.d} stroke={p.color} className={p.dim ? 'wire dim' : 'wire'} />
      ))}
    </svg>
  )
}
