import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatCurrency, formatNumber, formatPercent } from '../../lib/format.js'

// Price and variable cost are set with a wide contribution margin ($60/unit
// on 5,000 base units = $300,000 of contribution) so that EBIT stays
// comfortably positive across the entire Fixed Operating Costs slider range
// (up to $200,000) — that keeps the %ΔEBIT denominator safely away from zero.
const PRICE = 100
const VARIABLE_COST = 40
const BASE_UNITS = 5000
const CONTRIBUTION_MARGIN = PRICE - VARIABLE_COST
const BASE_CONTRIBUTION = CONTRIBUTION_MARGIN * BASE_UNITS

// Returns null (rather than a divide-by-zero / nonsensical result) whenever
// the base figure isn't safely positive — the UI falls back to a plain
// explanation instead of showing a misleading percentage.
function pctChange(base, shifted) {
  if (!isFinite(base) || base <= 0) return null
  return ((shifted - base) / base) * 100
}

function pctLabel(v, decimals = 1) {
  if (v === null) return '—'
  return `${v >= 0 ? '+' : '−'} ${formatPercent(Math.abs(v), decimals)}`
}

function toneClass(v) {
  if (v === null) return 'text-stone-400'
  if (v > 0) return 'text-good'
  if (v < 0) return 'text-bad'
  return 'text-stone-500'
}

function AmplifyBar({ label, value, maxAbs }) {
  const width = value === null ? 0 : Math.max(2, (Math.abs(value) / maxAbs) * 100)
  const barColor = value === null ? 'bg-stone-300' : value >= 0 ? 'bg-good' : 'bg-bad'
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-28 shrink-0 text-right font-medium text-stone-600">{label}</div>
      <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-stone-100">
        <div className={`h-full rounded-md transition-all duration-300 ${barColor}`} style={{ width: `${width}%` }} />
      </div>
      <div className={`w-20 shrink-0 font-mono text-xs font-bold ${toneClass(value)}`}>{pctLabel(value)}</div>
    </div>
  )
}

export default function LeverageRisk({ module }) {
  const [fixedCosts, setFixedCosts] = useState(80000)
  const [interestExpense, setInterestExpense] = useState(20000)
  const [salesChange, setSalesChange] = useState(10)

  const ebitBase = BASE_CONTRIBUTION - fixedCosts
  const shiftedUnits = BASE_UNITS * (1 + salesChange / 100)
  const ebitShifted = CONTRIBUTION_MARGIN * shiftedUnits - fixedCosts

  const niBase = ebitBase - interestExpense
  const niShifted = ebitShifted - interestExpense

  const ebitPctChange = pctChange(ebitBase, ebitShifted)
  const niPctChange = pctChange(niBase, niShifted)

  const maxAbs = Math.max(Math.abs(salesChange), Math.abs(ebitPctChange ?? 0), Math.abs(niPctChange ?? 0), 1)

  return (
    <ModuleShell
      module={module}
      explainer="Fixed operating costs and fixed interest costs both act like leverage: because they don't move when sales move, any change in sales flows disproportionately through to what's left over. A small sales swing can turn into a larger swing in operating profit (operating leverage), and interest expense then amplifies that swing again into an even larger change in net income (financial leverage) — for better on the upside, for worse on the downside."
      whyItMatters="This is why investors demand higher returns from highly-levered companies — the same sales dip that barely dents a low-leverage competitor can wipe out net income entirely for a company carrying heavy fixed costs and debt."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-500">
            Fixed assumptions: Price {formatCurrency(PRICE)}/unit · Variable Cost {formatCurrency(VARIABLE_COST)}/unit ·
            Base Sales {formatNumber(BASE_UNITS, 0)} units
          </div>

          <Slider
            label="Fixed Operating Costs"
            value={fixedCosts}
            onChange={setFixedCosts}
            min={10000}
            max={200000}
            step={5000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Annual Interest Expense"
            value={interestExpense}
            onChange={setInterestExpense}
            min={0}
            max={100000}
            step={5000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Sales Volume Change"
            value={salesChange}
            onChange={setSalesChange}
            min={-30}
            max={30}
            step={1}
            format={(v) => `${v >= 0 ? '+' : ''}${v}`}
            suffix="%"
          />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-stone-200 bg-surface px-4 py-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Base Case</div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Units</span>
                <span className="font-mono text-stone-700">{formatNumber(BASE_UNITS, 0)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>EBIT</span>
                <span className="font-mono text-stone-700">{formatCurrency(ebitBase, { compact: true })}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Net Income</span>
                <span className="font-mono text-stone-700">{formatCurrency(niBase, { compact: true })}</span>
              </div>
            </div>
            <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Shifted Case</div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Units</span>
                <span className="font-mono text-stone-700">{formatNumber(shiftedUnits, 0)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>EBIT</span>
                <span className="font-mono text-stone-700">{formatCurrency(ebitShifted, { compact: true })}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Net Income</span>
                <span className="font-mono text-stone-700">{formatCurrency(niShifted, { compact: true })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          <div className="space-y-3">
            <AmplifyBar label="Sales" value={salesChange} maxAbs={maxAbs} />
            <AmplifyBar label="EBIT" value={ebitPctChange} maxAbs={maxAbs} />
            <AmplifyBar label="Net Income" value={niPctChange} maxAbs={maxAbs} />
          </div>

          {niPctChange === null ? (
            <p className="text-center text-sm text-stone-500">
              Net income in the base case is at or below zero at this combination of fixed costs and interest expense, so a
              percentage change isn't meaningful — try lowering fixed costs or interest expense.
            </p>
          ) : (
            <p className="text-center text-sm text-stone-500">
              A {pctLabel(salesChange, 0)} change in sales becomes a {pctLabel(ebitPctChange)} change in EBIT, then a{' '}
              <span className={`font-semibold ${toneClass(niPctChange)}`}>{pctLabel(niPctChange)}</span> change in net
              income — fixed costs and interest each amplify the swing.
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-stone-200 px-3 py-2">
              <div className="text-xs text-stone-500">Sales Δ</div>
              <div className={`font-mono text-sm font-bold ${toneClass(salesChange)}`}>{pctLabel(salesChange, 0)}</div>
            </div>
            <div className="rounded-lg border border-stone-200 px-3 py-2">
              <div className="text-xs text-stone-500">EBIT Δ</div>
              <div className={`font-mono text-sm font-bold ${toneClass(ebitPctChange)}`}>{pctLabel(ebitPctChange)}</div>
            </div>
            <div className="rounded-lg border border-stone-200 px-3 py-2">
              <div className="text-xs text-stone-500">Net Income Δ</div>
              <div className={`font-mono text-sm font-bold ${toneClass(niPctChange)}`}>{pctLabel(niPctChange)}</div>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  )
}
