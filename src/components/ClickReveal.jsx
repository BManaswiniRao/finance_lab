import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * A single line item that expands to show an explanation when clicked.
 * Used by the income statement / balance sheet / cash flow modules.
 */
export default function ClickReveal({ label, value, valueClass = '', explanation, indent = false, tone = 'default' }) {
  const [open, setOpen] = useState(false)

  const toneRing = {
    default: 'border-line hover:border-accent/50',
    good: 'border-good/30 hover:border-good',
    bad: 'border-bad/30 hover:border-bad',
  }[tone]

  return (
    <div className={indent ? 'ml-4' : ''}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-surface px-4 py-2.5 text-left transition-colors ${toneRing}`}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="flex items-center gap-2">
          <span className={`font-mono text-sm font-semibold ${valueClass}`}>{value}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-ink-soft transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open && (
        <div className="animate-fade-up mt-1 rounded-xl bg-accent-soft/50 px-4 py-3 text-sm leading-relaxed text-ink">
          {explanation}
        </div>
      )}
    </div>
  )
}
