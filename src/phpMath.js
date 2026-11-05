const INT_MAX = 9223372036854775807n

// Affiche un float comme echo en PHP (precision=14 par défaut).
export function echoFloat(x) {
  if (Number.isInteger(x) && Math.abs(x) < 1e15) return String(x)
  const abs = Math.abs(x)
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-4)) {
    const [m, e] = x.toExponential(13).split('e')
    let mant = m.replace(/0+$/, '').replace(/\.$/, '')
    if (!mant.includes('.')) mant += '.0'
    return `${mant}E${e.startsWith('-') ? e : '+' + e.replace('+', '')}`
  }
  return String(Number(x.toPrecision(14)))
}

// a et b : entiers >= 0
export function calc(a, op, b) {
  switch (op) {
    case '+': return { value: String(a + b) }
    case '-': return { value: String(a - b) }
    case '*': return { value: String(a * b) }
    case '/':
      if (b === 0) return { error: 'DivisionByZeroError: Division by zero' }
      return { value: echoFloat(a / b) }
    case '%':
      if (b === 0) return { error: 'DivisionByZeroError: Modulo by zero' }
      return { value: String(a % b) }
    case '**': {
      const big = BigInt(a) ** BigInt(b)
      return { value: big <= INT_MAX ? big.toString() : echoFloat(Number(big)) }
    }
  }
}
