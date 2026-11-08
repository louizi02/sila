export { L, O, S } from '../php/helpers.js'

export const tx = (fr, ar) => ({ fr, ar })
export const word = (termFr, defFr, termAr, defAr) => ({ term: tx(termFr, termAr), def: tx(defFr, defAr) })
export const MAN = 'https://man7.org/linux/man-pages/'
