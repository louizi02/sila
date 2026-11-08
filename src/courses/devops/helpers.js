import { L, O, S } from '../php/helpers.js'

export { L, O, S }

export const tx = (fr, ar) => ({ fr, ar })
export const word = (termFr, defFr, termAr, defAr) => ({ term: tx(termFr, termAr), def: tx(defFr, defAr) })
export const MAN = 'https://man7.org/linux/man-pages/'

export const plain = (text, from) => O(text, from, 'plain')
export const bad = (text, from) => O(text, from, 'err')
export const good = (text, from) => O(text, from, 'out')

export const EXAMPLE = tx('Résultat (exemple)', 'النتيجة (مثال)')
export const MEANING = tx('Ce que fait chaque ligne', 'ما يفعله كل سطر')

// Une page de cours : [navFr, navAr], [titreFr, titreAr], [introFr, introAr], [sourceFr, sourceAr, url].
export const page = (type, id, nav, title, lead, source, extra = {}) => ({
  type, id,
  nav: tx(...nav), title: tx(...title), lead: tx(...lead),
  source: { label: tx(source[0], source[1]), url: source[2] },
  ...extra,
})

export const flow = (id, nav, title, lead, source, extra) =>
  page('flow', id, nav, title, lead, source, { sourceLabel: 'terminal', outputLabel: EXAMPLE, ...extra })

// Une version d'une page : id, [labelFr, labelAr], [noteFr, noteAr], lignes, résultat.
export const v = (id, label, note, lines, output = [], extra = {}) => ({
  id, label: tx(...label), note: tx(...note), lines, output, ...extra,
})

export const yes = (fr, ar, whyFr, whyAr) => ({ title: tx(fr, ar), ok: true, why: tx(whyFr, whyAr) })
export const no = (fr, ar, whyFr, whyAr) => ({ title: tx(fr, ar), ok: false, why: tx(whyFr, whyAr) })
export const card = (fr, ar, whyFr, whyAr) => ({ title: tx(fr, ar), why: tx(whyFr, whyAr) })

export const quiz = (id, source, items) => page('rules', id, ['Exercice', 'تمرين'], ['Vrai ou faux ?', 'صحيح أم خطأ؟'], ['Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'], source, { items })

export const stage = (id, labelFr, labelAr, sub, detailFr, detailAr, code) => ({ id, label: tx(labelFr, labelAr), sub, detail: tx(detailFr, detailAr), code })

// Une commande de l'exercice de panne.
export const opt = (cmd, doesFr, doesAr, cost, isGood, next, output, commentFr, commentAr) => ({
  cmd, does: tx(doesFr, doesAr), cost, good: isGood, next, output, comment: tx(commentFr, commentAr),
})

export function incident(id, nav, title, lead, source, extra) {
  let best = 0
  let node = extra.start
  while (!extra.nodes[node].end) {
    const option = extra.nodes[node].options.find((o) => o.good)
    best += option.cost
    node = option.next
  }
  return page('incident', id, nav, title, lead, source, { host: 'admin@serveur', bestMinutes: best, ...extra })
}

export const ask = (fr, ar, options) => ({ question: tx(fr, ar), options })
export const pm = (termFr, termAr, fr, ar) => ({ term: tx(termFr, termAr), text: tx(fr, ar) })
export const module = (id, title, notions, slides) => ({ id, title: tx(...title), notions: tx(...notions), slides })
