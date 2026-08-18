import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatCurrency } from '../../lib/format.js'

const MAX = 200000

export default function AccountingEquation({ module }) {
  // Equity is always derived so the equation can never go out of balance.
  const [assets, setAssets] = useState(120000)
  const [liabilities, setLiabilities] = useState(50000)
  const equity = assets - liabilities

  const handleAssets = (v) => {
    setAssets(v)
    if (v - liabilities < 0) setLiabilities(v)
  }
  const handleLiabilities = (v) => {
    if (v > assets) return
    setLiabilities(v)
  }

  const bar = (value) => `${Math.max(2, (value / MAX) * 100)}%`

  return (
    <ModuleShell
      module={module}
      explainer="Every rupee a business owns (an asset) was paid for either by borrowing it (a liability) or by the owners funding it themselves (equity). That's the whole idea — nothing more. Drag the sliders below and watch equity adjust automatically so the equation never breaks."
      whyItMatters="This equation is the backbone of the balance sheet and of double-entry bookkeeping itself — every transaction a company records has to keep it in balance, which is exactly why debits must always equal credits."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Slider
            label="Assets"
            value={assets}
            onChange={handleAssets}
            min={0}
            max={MAX}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Liabilities"
            value={liabilities}
            onChange={handleLiabilities}
            min={0}
            max={MAX}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-stone-700">Equity (derived)</span>
              <span className="font-mono text-lg font-bold text-accent">{formatCurrency(equity)}</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">Assets − Liabilities. You can't set this directly — it's always the leftover.</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-center gap-3 text-sm font-semibold text-stone-500">
            <div className="w-24 text-right">Assets</div>
            <div className="flex-1">
              <div className="h-8 overflow-hidden rounded-md bg-stone-100">
                <div className="h-full rounded-md bg-stone-700 transition-all duration-300" style={{ width: bar(assets) }} />
              </div>
            </div>
            <div className="w-24 font-mono text-xs text-stone-500">{formatCurrency(assets, { compact: true })}</div>
          </div>

          <div className="text-center text-lg font-bold text-stone-300">=</div>

          <div className="flex items-center gap-3 text-sm font-semibold text-stone-500">
            <div className="w-24 text-right">Liab. + Eq.</div>
            <div className="flex-1">
              <div className="flex h-8 overflow-hidden rounded-md bg-stone-100">
                <div
                  className="h-full bg-bad transition-all duration-300"
                  style={{ width: bar(liabilities) }}
                  title="Liabilities"
                />
                <div
                  className="h-full bg-good transition-all duration-300"
                  style={{ width: bar(equity) }}
                  title="Equity"
                />
              </div>
            </div>
            <div className="w-24 font-mono text-xs text-stone-500">{formatCurrency(liabilities + equity, { compact: true })}</div>
          </div>

          <div className="mt-2 flex justify-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-bad" /> Liabilities
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-good" /> Equity
            </span>
          </div>

          <p className="mt-2 text-center text-sm text-stone-500">
            Notice the two bars are always the <span className="font-semibold text-stone-700">same total length</span> —
            that's the equation staying balanced, no matter what you do.
          </p>
        </div>
      </div>
    </ModuleShell>
  )
}
