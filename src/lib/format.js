// Intl's built-in "compact" notation doesn't know about lakh/crore as native
// units, so above ~1000 crore it degrades to ugly output like "₹2KCr". This
// applies the standard Indian lakh/crore scale directly instead.
export function formatCurrency(value, { compact = false } = {}) {
  const n = Math.round(value)
  if (compact) {
    const abs = Math.abs(n)
    const sign = n < 0 ? '−' : ''
    if (abs >= 1e7) return `${sign}₹${trimDecimal(abs / 1e7)}Cr`
    if (abs >= 1e5) return `${sign}₹${trimDecimal(abs / 1e5)}L`
    if (abs >= 1e3) return `${sign}₹${trimDecimal(abs / 1e3)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

function trimDecimal(v) {
  return Number(v.toFixed(1)).toString()
}

export function formatPercent(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`
}

export function formatRatio(value, decimals = 2) {
  if (!isFinite(value)) return '—'
  return value.toFixed(decimals)
}

export function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value)
}
