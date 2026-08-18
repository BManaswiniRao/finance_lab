import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'

export default function BreakEven({ module }) {
  const [price, setPrice] = useState(50)
  const [variableCost, setVariableCost] = useState(30)
  const [fixedCosts, setFixedCosts] = useState(10000)

  // Variable cost can never reach or exceed price — otherwise the business
  // never earns a positive contribution margin and can't break even.
  const handlePrice = (v) => {
    setPrice(v)
    if (variableCost >= v) setVariableCost(Math.max(1, v - 1))
  }
  const handleVariableCost = (v) => {
    if (v >= price) return
    setVariableCost(v)
  }

  const contributionMargin = price - variableCost
  const breakEvenUnits = fixedCosts / contributionMargin
  const breakEvenRevenue = breakEvenUnits * price

  const chartData = useMemo(() => {
    const maxUnits = Math.max(breakEvenUnits * 2, 10)
    const steps = 20
    const data = []
    for (let i = 0; i <= steps; i++) {
      const units = (maxUnits / steps) * i
      data.push({
        units,
        revenue: price * units,
        cost: fixedCosts + variableCost * units,
      })
    }
    return data
  }, [price, variableCost, fixedCosts, breakEvenUnits])

  return (
    <ModuleShell
      module={module}
      explainer="Break-even analysis answers a simple question: how many units do we need to sell before we stop losing money? Every unit sold covers its own variable cost and contributes the rest — the 'contribution margin' — toward paying off fixed costs. Once enough units have been sold to cover all fixed costs, every additional sale is pure profit."
      whyItMatters="Break-even volume is the first number founders and managers calculate before launching a product — it tells you exactly how much you need to sell just to survive, before you can think about profit."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Slider
            label="Selling Price / Unit"
            value={price}
            onChange={handlePrice}
            min={5}
            max={200}
            step={1}
            format={(v) => formatCurrency(v)}
          />
          <Slider
            label="Variable Cost / Unit"
            value={variableCost}
            onChange={handleVariableCost}
            min={1}
            max={150}
            step={1}
            format={(v) => formatCurrency(v)}
          />
          <Slider
            label="Fixed Costs"
            value={fixedCosts}
            onChange={setFixedCosts}
            min={1000}
            max={50000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />

          <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-stone-700">Contribution Margin / Unit</span>
              <span className="font-mono text-lg font-bold text-accent">{formatCurrency(contributionMargin)}</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">Price − Variable Cost. What each sale contributes toward fixed costs.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-stone-200 bg-surface px-4 py-3">
              <div className="text-xs font-medium text-stone-500">Break-Even Units</div>
              <div className="mt-1 font-mono text-lg font-bold text-stone-700">{formatNumber(breakEvenUnits, 0)}</div>
            </div>
            <div className="rounded-lg border border-stone-200 bg-surface px-4 py-3">
              <div className="text-xs font-medium text-stone-500">Break-Even Revenue</div>
              <div className="mt-1 font-mono text-lg font-bold text-stone-700">{formatCurrency(breakEvenRevenue)}</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis
                  dataKey="units"
                  type="number"
                  tick={{ fontSize: 12, fill: '#78716c' }}
                  tickFormatter={(v) => formatNumber(v, 0)}
                  label={{ value: 'Units Sold', position: 'insideBottom', offset: -4, fontSize: 12, fill: '#78716c' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#78716c' }}
                  tickFormatter={(v) => formatCurrency(v, { compact: true })}
                  width={64}
                />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  labelFormatter={(u) => `${formatNumber(u, 0)} units`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Total Revenue"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Total Cost"
                  stroke="#44403c"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                />
                <ReferenceDot
                  x={breakEvenUnits}
                  y={breakEvenRevenue}
                  r={6}
                  fill="var(--color-accent)"
                  stroke="white"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-sm text-stone-500">
            The dot marks break-even — where total revenue first covers total cost, at{' '}
            <span className="font-semibold text-stone-700">{formatNumber(breakEvenUnits, 0)} units</span>.
          </p>
        </div>
      </div>
    </ModuleShell>
  )
}
