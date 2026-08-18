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
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
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
      explainer={
        <>
          <p>
            Every product has two kinds of cost attached to it. <strong>Fixed costs</strong> — rent, salaries,
            insurance — show up whether you sell one unit or one thousand. <strong>Variable costs</strong> —
            materials, packaging, a sales commission — scale with each additional sale. Break-even analysis asks a
            single practical question: at what sales volume does revenue finally cover both?
          </p>
          <p>
            The mechanism is the <strong>contribution margin</strong> — what's left from each sale after its
            variable cost is paid. Every unit sold chips away at the fixed-cost pile using its contribution margin;
            once enough units have chipped away the whole pile, the business breaks even, and every sale after that
            is pure profit.
          </p>
        </>
      }
      whyItMatters="Break-even volume is the first number founders and managers calculate before launching a product — it tells you exactly how much you need to sell just to survive, before you can think about profit."
    >
      <FormulaBox label="Break-even units" formula="Fixed Costs ÷ (Price − Variable Cost)" />

      <ExampleBox>
        <p>
          A small print shop sells custom t-shirts for <strong>₹500</strong> each. Blank shirts, ink, and printing
          cost <strong>₹300</strong> per shirt — so each sale contributes ₹200 toward the shop's fixed costs. Rent
          and a part-time employee cost <strong>₹40,000</strong> a month, fixed no matter how many shirts sell.
        </p>
        <p className="font-mono text-sm">₹40,000 ÷ (₹500 − ₹300) = 200 shirts</p>
        <p>
          Sell fewer than 200 shirts this month and the shop loses money; sell exactly 200 and it breaks even; every
          shirt past that is ₹200 of straight profit.
        </p>
      </ExampleBox>

      <p className="mb-4 text-sm text-ink-soft">Adjust price, variable cost, or fixed costs below and watch the break-even point move.</p>

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
              <span className="font-medium text-ink">Contribution Margin / Unit</span>
              <span className="font-mono text-lg font-bold text-accent">{formatCurrency(contributionMargin)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">Price − Variable Cost. What each sale contributes toward fixed costs.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <div className="text-xs font-medium text-ink-soft">Break-Even Units</div>
              <div className="mt-1 font-mono text-lg font-bold text-ink">{formatNumber(breakEvenUnits, 0)}</div>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <div className="text-xs font-medium text-ink-soft">Break-Even Revenue</div>
              <div className="mt-1 font-mono text-lg font-bold text-ink">{formatCurrency(breakEvenRevenue)}</div>
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
          <p className="mt-2 text-center text-sm text-ink-soft">
            The dot marks break-even — where total revenue first covers total cost, at{' '}
            <span className="font-semibold text-ink">{formatNumber(breakEvenUnits, 0)} units</span>.
          </p>
        </div>
      </div>
    </ModuleShell>
  )
}
