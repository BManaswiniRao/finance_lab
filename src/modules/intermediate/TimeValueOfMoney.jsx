import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
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
      explainer="A rupee in your hand today is worth more than a rupee promised years from now — because today's rupee can be invested and start earning a return right away. Time value of money puts a number on that gap: given a rate of return, it tells you what a present sum grows into in the future (future value), or conversely, what a future sum is worth today (present value)."
      whyItMatters="Time value of money is the foundation under almost every other valuation technique — discounted cash flow, bond pricing, loan amortization, and retirement planning all boil down to moving rupees across time at some rate."
    >
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
