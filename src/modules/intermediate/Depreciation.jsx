import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatCurrency } from '../../lib/format.js'

// Build a year-by-year book value schedule for both methods.
function buildSchedule(cost, usefulLife) {
  const straightLineExpense = cost / usefulLife
  const decliningRate = 2 / usefulLife

  const rows = []
  let slValue = cost
  let dbValue = cost

  for (let year = 0; year <= usefulLife; year++) {
    if (year === 0) {
      rows.push({ year, straightLine: cost, decliningBalance: cost })
      continue
    }
    slValue = Math.max(0, slValue - straightLineExpense)

    if (year === usefulLife) {
      // Force full depreciation by the end of the asset's useful life,
      // since double-declining balance otherwise only approaches zero.
      dbValue = 0
    } else {
      dbValue = Math.max(0, dbValue - dbValue * decliningRate)
    }

    rows.push({ year, straightLine: slValue, decliningBalance: dbValue })
  }

  return rows
}

export default function Depreciation({ module }) {
  const [cost, setCost] = useState(50000)
  const [usefulLife, setUsefulLife] = useState(5)

  const schedule = useMemo(() => buildSchedule(cost, usefulLife), [cost, usefulLife])

  const straightLineYear1 = cost / usefulLife
  const decliningYear1 = cost * (2 / usefulLife)

  return (
    <ModuleShell
      module={module}
      explainer="When a company buys a long-lived asset, it spreads the cost over the years the asset is used instead of expensing it all at once. Straight-line depreciation spreads that cost evenly, year after year. Declining balance instead applies a fixed rate to whatever book value is left, so it deducts much more in the early years and tapers off — the asset's value 'declines' fastest right after purchase."
      whyItMatters="The method a company picks doesn't change total depreciation over the asset's life, but it does change which years look more or less profitable — and declining balance often defers taxable income into later years."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Slider
            label="Asset Cost"
            value={cost}
            onChange={setCost}
            min={1000}
            max={100000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Useful Life"
            value={usefulLife}
            onChange={setUsefulLife}
            min={2}
            max={15}
            step={1}
            format={(v) => `${v} yr`}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-stone-200 bg-surface px-4 py-3">
              <div className="text-xs font-medium text-stone-500">Straight-Line, Year 1</div>
              <div className="mt-1 font-mono text-lg font-bold text-stone-700">{formatCurrency(straightLineYear1)}</div>
            </div>
            <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
              <div className="text-xs font-medium text-stone-500">Declining Balance, Year 1</div>
              <div className="mt-1 font-mono text-lg font-bold text-accent">{formatCurrency(decliningYear1)}</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={schedule} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: '#78716c' }}
                  label={{ value: 'Year', position: 'insideBottom', offset: -4, fontSize: 12, fill: '#78716c' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#78716c' }}
                  tickFormatter={(v) => formatCurrency(v, { compact: true })}
                  width={64}
                />
                <Tooltip formatter={(v) => formatCurrency(v)} labelFormatter={(y) => `Year ${y}`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="straightLine"
                  name="Straight-Line"
                  stroke="#44403c"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="decliningBalance"
                  name="Declining Balance"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-sm text-stone-500">
            Both lines end at <span className="font-semibold text-stone-700">₹0</span> book value after {usefulLife}{' '}
            years — declining balance just gets there on a curve instead of a straight line.
          </p>
        </div>
      </div>
    </ModuleShell>
  )
}
