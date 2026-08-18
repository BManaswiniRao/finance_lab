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
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
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
      explainer={
        <>
          <p>
            Debt is nearly always the cheaper way to fund a business. Lenders get repaid before shareholders and
            often hold collateral, so they demand a lower return than equity investors do — and on top of that,
            interest payments are tax-deductible, which shaves the effective cost of debt down even further (the "tax
            shield"). Judged purely on cost, more debt looks like a free lunch.
          </p>
          <p>
            It isn't, because debt is a fixed obligation — the company owes those interest payments whether the year
            is good or bad — and every rupee of debt piled on makes the cash left over for shareholders more
            volatile. Equity holders respond by demanding a higher return to compensate for that extra risk, so cost
            of equity climbs as leverage rises. Capital structure decisions are really about finding the mix where
            the savings from cheap debt roughly balance the rising cost of increasingly risky equity.
          </p>
        </>
      }
      whyItMatters="This is exactly the trade-off CFOs weigh when deciding how to fund growth — take on more debt, or issue more equity."
    >
      <FormulaBox
        label="Cost of equity rises with leverage"
        formula="Unlevered Cost of Equity + (Unlevered Cost of Equity − Cost of Debt) × D/E"
      />

      <ExampleBox title="Two points on the curve">
        <p>
          Compare two financing choices for the same company, using the fixed assumptions on this page (6% cost of
          debt, 25% tax rate, 10% unlevered cost of equity). At <strong>0% debt</strong>, the company is funded
          entirely by equity, so cost of equity stays at the unlevered baseline of 10% — and so does WACC, since
          there's no cheap debt in the mix to blend in.
        </p>
        <p className="font-mono text-sm">0% debt → Cost of equity = 10% · WACC = 10%</p>
        <p>
          At <strong>50% debt</strong>, the leverage effect kicks in: cost of equity rises to 10% + (10% − 6%) ×
          (50%/50%) = 14%, but WACC actually falls to 9.25% — the cheap, tax-advantaged debt more than offsets the
          higher return now required on the smaller slice of equity.
        </p>
        <p className="font-mono text-sm">50% debt → Cost of equity = 14% · WACC = 9.25%</p>
      </ExampleBox>

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
