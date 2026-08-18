import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
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
      explainer={
        <>
          <p>
            Every business, no matter how large or small, can be described with one identity: what it owns equals
            what it owes plus what belongs to its owners. Accountants call these three buckets{' '}
            <strong>assets</strong>, <strong>liabilities</strong>, and <strong>equity</strong>, and the relationship
            between them is called the accounting equation.
          </p>
          <p>
            It isn't a rule imposed on businesses from outside — it's just arithmetic. Every rupee of value a
            company holds had to come from somewhere: either someone lent it (a liability, which will eventually be
            repaid), or the owners put it in themselves, directly or through retained profit (equity). There's no
            third source. That's why the equation can never actually be "wrong" — it's true by construction, for
            every business, at every moment.
          </p>
        </>
      }
      whyItMatters="This equation is the backbone of the balance sheet and of double-entry bookkeeping itself — every transaction a company records has to keep it in balance, which is exactly why debits must always equal credits."
    >
      <FormulaBox label="The equation" formula="Assets = Liabilities + Equity" />

      <ExampleBox>
        <p>
          Say a bakery starts with nothing. The owner puts in <strong>₹3,00,000</strong> of her own savings — that's
          equity. The bakery then takes a <strong>₹2,00,000</strong> loan from a bank to fit out the kitchen — that's
          a liability. At this point the bakery has <strong>₹5,00,000</strong> in cash, which is an asset.
        </p>
        <p className="font-mono text-sm">₹5,00,000 (assets) = ₹2,00,000 (liabilities) + ₹3,00,000 (equity) ✓</p>
        <p>
          Now she spends ₹1,50,000 of that cash on an oven. Cash (an asset) falls by ₹1,50,000, but the oven (also
          an asset) rises by the same amount — total assets don't change at all, and the equation stays balanced
          without anyone forcing it to.
        </p>
      </ExampleBox>

      <p className="mb-4 text-sm text-ink-soft">
        Try it yourself: drag Assets or Liabilities below and watch Equity adjust so the equation always holds.
      </p>

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
              <span className="font-medium text-ink">Equity (derived)</span>
              <span className="font-mono text-lg font-bold text-accent">{formatCurrency(equity)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">Assets − Liabilities. You can't set this directly — it's always the leftover.</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-center gap-3 text-sm font-semibold text-ink-soft">
            <div className="w-24 text-right">Assets</div>
            <div className="flex-1">
              <div className="h-8 overflow-hidden rounded-md bg-stone-100">
                <div className="h-full rounded-md bg-stone-700 transition-all duration-300" style={{ width: bar(assets) }} />
              </div>
            </div>
            <div className="w-24 font-mono text-xs text-ink-soft">{formatCurrency(assets, { compact: true })}</div>
          </div>

          <div className="text-center text-lg font-bold text-stone-300">=</div>

          <div className="flex items-center gap-3 text-sm font-semibold text-ink-soft">
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
            <div className="w-24 font-mono text-xs text-ink-soft">{formatCurrency(liabilities + equity, { compact: true })}</div>
          </div>

          <div className="mt-2 flex justify-center gap-4 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-bad" /> Liabilities
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-good" /> Equity
            </span>
          </div>

          <p className="mt-2 text-center text-sm text-ink-soft">
            Notice the two bars are always the <span className="font-semibold text-ink">same total length</span> —
            that's the equation staying balanced, no matter what you do.
          </p>
        </div>
      </div>
    </ModuleShell>
  )
}
