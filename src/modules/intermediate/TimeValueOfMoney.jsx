import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
import { formatCurrency, formatPercent } from '../../lib/format.js'

export default function TimeValueOfMoney({ module }) {
  const [pv, setPv] = useState(10000)
  const [rate, setRate] = useState(6)
  const [years, setYears] = useState(15)

  const fv = pv * Math.pow(1 + rate / 100, years)

  const data = useMemo(() => {
    const points = []
    for (let n = 0; n <= years; n++) {
      points.push({ year: n, value: pv * Math.pow(1 + rate / 100, n) })
    }
    return points
  }, [pv, rate, years])

  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            A rupee in your hand today is worth more than a rupee promised years from now — because today's rupee can
            be invested and start earning a return right away, while the promised rupee just sits there waiting.{' '}
            <strong>Time value of money</strong> puts a precise number on that gap: given a rate of return, it tells
            you exactly what a present sum grows into in the future (its <strong>future value</strong>), or
            conversely, what a future sum is worth if you had it in hand today (its <strong>present value</strong>).
          </p>
          <p>
            The engine behind both directions is compounding — growth building on top of previous growth, not just
            on the original amount. Push the rate or the number of years up even a little, and the future value moves
            by a lot more than intuition suggests, which is exactly why this idea underlies almost every decision
            about saving, borrowing, or investing over time.
          </p>
        </>
      }
      whyItMatters="Time value of money is the foundation under almost every other valuation technique — discounted cash flow, bond pricing, loan amortization, and retirement planning all boil down to moving rupees across time at some rate."
    >
      <FormulaBox label="Future value" formula="PV × (1 + rate)^years = FV" />

      <ExampleBox>
        <p>
          Suppose you invest <strong>₹1,00,000</strong> today at an annual return of <strong>8%</strong>, and leave
          it untouched for <strong>10 years</strong>. Each year's gain earns its own return the following year, so
          the growth compounds rather than staying flat.
        </p>
        <p className="font-mono text-sm">₹1,00,000 × (1.08)^10 ≈ ₹2,15,893</p>
        <p>
          Your original ₹1,00,000 more than doubles to roughly ₹2,15,893 — without adding a single extra rupee of
          your own. That's the time value of money: the same amount is worth dramatically more in the future than it
          is today, purely because of the rate it can earn along the way.
        </p>
      </ExampleBox>

      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Slider
            label="Present Value"
            value={pv}
            onChange={setPv}
            min={100}
            max={50000}
            step={100}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Annual Interest Rate"
            value={rate}
            onChange={setRate}
            min={0}
            max={15}
            step={0.5}
            format={(v) => formatPercent(v)}
          />
          <Slider
            label="Years"
            value={years}
            onChange={setYears}
            min={0}
            max={40}
            step={1}
            format={(v) => `${v}`}
            suffix=" yrs"
          />
        </div>

        <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-stone-700">Future Value</span>
            <span className="font-mono text-lg font-bold text-accent">{formatCurrency(fv)}</span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Today's {formatCurrency(pv)} becomes {formatCurrency(fv)} in {years} {years === 1 ? 'year' : 'years'} at{' '}
            {formatPercent(rate)} — that's the time value of money at work.
          </p>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#78716c' }}
                label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 12, fill: '#78716c' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#78716c' }}
                tickFormatter={(v) => formatCurrency(v, { compact: true })}
                width={70}
              />
              <Tooltip
                formatter={(v) => [formatCurrency(v), 'Value']}
                labelFormatter={(l) => `Year ${l}`}
                contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#e7e5e4' }}
              />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ModuleShell>
  )
}
