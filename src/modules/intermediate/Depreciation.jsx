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
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
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
      explainer={
        <>
          <p>
            When a company buys a long-lived asset — a machine, a delivery van, a laptop fleet — it can't just expense
            the whole cost the day it's bought. Accounting rules require spreading that cost over the years the asset
            is actually used, a process called <strong>depreciation</strong>. It isn't about tracking what the asset
            could resell for; it's about matching the expense to the years the asset actually helps generate revenue.
          </p>
          <p>
            <strong>Straight-line depreciation</strong> is the simplest approach: divide the cost evenly across every
            year of the asset's useful life, so the expense is identical year after year.{' '}
            <strong>Declining balance</strong> takes a different view — it applies a fixed percentage to whatever
            book value is left, which means it deducts far more in the early years and tapers off as the asset ages.
            Both methods land at the same total depreciation by the end; they just disagree on the timing.
          </p>
        </>
      }
      whyItMatters="The method a company picks doesn't change total depreciation over the asset's life, but it does change which years look more or less profitable — and declining balance often defers taxable income into later years."
    >
      <FormulaBox label="Straight-line" formula="Cost ÷ Useful Life = Annual Expense" />

      <ExampleBox>
        <p>
          A delivery company buys a van for <strong>₹6,00,000</strong>, expecting to use it for{' '}
          <strong>6 years</strong> before replacing it. Under straight-line depreciation, the annual expense is the
          same every year of its life.
        </p>
        <p className="font-mono text-sm">₹6,00,000 ÷ 6 years = ₹1,00,000 per year</p>
        <p>
          Under declining balance at double the straight-line rate (2 ÷ 6 years ≈ 33%), year one instead deducts{' '}
          <strong>₹2,00,000</strong> — double the straight-line figure — because the rate is applied to the full,
          undepreciated cost of the van. The van looks like it's losing value twice as fast in year one, even though
          it's the identical vehicle either way.
        </p>
      </ExampleBox>

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
