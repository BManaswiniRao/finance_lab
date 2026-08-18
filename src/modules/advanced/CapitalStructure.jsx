import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatPercent } from '../../lib/format.js'

// Fixed assumptions — kept off the sliders so the module stays focused on
// the one trade-off it's teaching: how leverage moves cost of equity and WACC.
const COST_OF_DEBT = 6
const TAX_RATE = 25
const UNLEVERED_COST_OF_EQUITY = 10

function costOfEquityAt(debtRatio) {
  const d = debtRatio / 100
  const e = (100 - debtRatio) / 100
  const de = d / e
  return UNLEVERED_COST_OF_EQUITY + (UNLEVERED_COST_OF_EQUITY - COST_OF_DEBT) * de
}

function waccAt(debtRatio) {
  const d = debtRatio / 100
  const e = (100 - debtRatio) / 100
  const ce = costOfEquityAt(debtRatio)
  return e * ce + d * COST_OF_DEBT * (1 - TAX_RATE / 100)
}

// Equity ratio never hits 0 since the slider caps debt at 90%, so the D/E
// ratio used above never divides by zero.
const CHART_DATA = Array.from({ length: 91 }, (_, debtRatio) => ({
  debtRatio,
  costOfEquity: costOfEquityAt(debtRatio),
  wacc: waccAt(debtRatio),
}))

export default function CapitalStructure({ module }) {
  const [debtRatio, setDebtRatio] = useState(30)
  const equityRatio = 100 - debtRatio

  const costOfEquity = costOfEquityAt(debtRatio)
  const wacc = waccAt(debtRatio)

  return (
    <ModuleShell
      module={module}
      explainer="More debt is cheaper financing — interest is tax-deductible, and debt holders take less risk than shareholders. But loading up on debt raises the risk shareholders bear, so the return they demand (cost of equity) climbs too. Capital structure is about finding the debt/equity mix that minimizes the overall cost of capital."
      whyItMatters="This is exactly the trade-off CFOs weigh when deciding how to fund growth — take on more debt, or issue more equity."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Slider
            label="Debt Ratio (% of capital structure)"
            value={debtRatio}
            onChange={setDebtRatio}
            min={0}
            max={90}
            step={5}
            format={(v) => formatPercent(v, 0)}
          />

          <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Fixed assumptions</div>
            <dl className="grid grid-cols-1 gap-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Cost of Debt (pre-tax)</dt>
                <dd className="font-mono font-semibold text-stone-700">{formatPercent(COST_OF_DEBT)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Tax Rate</dt>
                <dd className="font-mono font-semibold text-stone-700">{formatPercent(TAX_RATE, 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Unlevered Cost of Equity</dt>
                <dd className="font-mono font-semibold text-stone-700">{formatPercent(UNLEVERED_COST_OF_EQUITY)}</dd>
              </div>
            </dl>
          </div>

          <div className="text-sm text-stone-500">
            Equity Ratio: <span className="font-mono font-semibold text-stone-700">{formatPercent(equityRatio, 0)}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-accent-soft bg-accent-soft/40 px-4 py-3 text-center">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">WACC</div>
              <div className="mt-1 font-mono text-2xl font-bold text-accent">{formatPercent(wacc)}</div>
            </div>
            <div className="rounded-xl border border-stone-200 px-4 py-3 text-center">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">Cost of Equity</div>
              <div className="mt-1 font-mono text-2xl font-bold text-stone-700">{formatPercent(costOfEquity)}</div>
            </div>
          </div>
          <p className="text-center text-sm text-stone-500">
            As leverage rises, shareholders demand a higher return to compensate for the added risk.
          </p>
        </div>
      </div>

      <div className="mt-8" style={{ height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={CHART_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="debtRatio"
              tick={{ fontSize: 12, fill: '#78716c' }}
              tickFormatter={(v) => `${v}%`}
              type="number"
              domain={[0, 90]}
            />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} tickFormatter={(v) => `${v.toFixed(0)}%`} width={48} />
            <Tooltip formatter={(v) => formatPercent(v)} labelFormatter={(v) => `Debt Ratio: ${v}%`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine x={debtRatio} stroke="#a8a29e" strokeDasharray="4 4" label={{ value: 'Current', position: 'top', fontSize: 11, fill: '#78716c' }} />
            <Line type="monotone" dataKey="costOfEquity" name="Cost of Equity" stroke="#78716c" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="wacc" name="WACC" stroke="var(--color-accent)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ModuleShell>
  )
}
