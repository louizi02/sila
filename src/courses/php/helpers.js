export const DOC = 'https://www.php.net/manual/fr/'

// Texte dans les deux langues.
export const tx = (fr, ar) => ({ fr, ar })

// Morceaux de code écrits à la main : [texte, type]. Le type fixe la couleur (.k-* dans styles.css).
export const html = (s) => [s, 'html']
export const tag = (s) => [s, 'tag']
export const kw = (s) => [s, 'kw']
export const str = (s) => [s, 'str']
export const txt = (s) => [s, 'plain']
export const cmt = (s) => [s, 'cmt']
export const out = (s) => [s, 'out']
export const err = (s) => [s, 'err']
export const ws = ['⏎', 'ws']
export const missing = ['', 'miss']
export const nothing = ['', 'none']

const KEYWORDS = 'echo|function|return|if|elseif|else|for|foreach|while|as|match|switch|case|break|default|const|define|global|fn|int|true|false|null|var_dump|require'
const TOKEN = new RegExp(
  '(<\\?php|<\\?=|\\?>|\\/\\/.*$|#.*$|"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$[A-Za-z_]\\w*|\\b(?:' + KEYWORDS + ')\\b|\\b\\d+(?:\\.\\d+)?\\b|__[A-Z]+__)',
)

function kindOf(token) {
  if (/^(<\?php|<\?=|\?>)$/.test(token)) return 'tag'
  if (token.startsWith('//') || token.startsWith('#')) return 'cmt'
  if (token.startsWith('"') || token.startsWith("'")) return 'str'
  if (token.startsWith('$')) return 'var'
  if (/^\d/.test(token)) return 'num'
  if (token.startsWith('__')) return 'kw'
  return 'kw'
}

// Colore une ligne de PHP simple.
export function hl(line) {
  const segs = []
  let rest = line
  while (rest.length) {
    const m = rest.match(TOKEN)
    if (!m) {
      segs.push([rest, 'plain'])
      break
    }
    if (m.index > 0) segs.push([rest.slice(0, m.index), 'plain'])
    segs.push([m[0], kindOf(m[0])])
    rest = rest.slice(m.index + m[0].length)
  }
  return segs
}

// Ligne de source. Avec un id, elle peut être reliée au résultat.
export const L = (text, id, k = 'php') => (id ? { id, k, segs: hl(text) } : { segs: hl(text) })

// Ligne de résultat, reliée à une ou plusieurs lignes de source.
export const O = (text, from, kind = 'out') => ({ from, segs: [[text, kind]] })
