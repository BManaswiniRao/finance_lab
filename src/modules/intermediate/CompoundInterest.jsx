import { useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
import { formatCurrency, formatPercent } from '../../lib/format.js'

export default function CompoundInterest({ module }) {
  const [principal, setPrincipal] = useState(5000)
  const [rate, setRate] = useState(8)
  const [years, setYears] = useState(20)

  const simpleFinal = principal * (1 + (rate / 100) * years)
  const compoundFinal = principal * Math.pow(1 + rate / 100, years)
  const difference = compoundFinal - simpleFinal

  const data = useMemo(() => {
    const points = []
    for (let t = 0; t <= years; t++) {
      points.push({
        year: t,
        simple: principal * (1 + (rate / 100) * t),
        compound: principal * Math.pow(1 + rate / 100, t),
      })
    }
    return points
  }, [principal, rate, years])

  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            Simple interest only ever grows on the original principal, year after year, in a straight line — a fixed
            rupee amount added on top every period, no matter how long the money has been growing.{' '}
            <strong>Compound interest</strong> works differently: it earns interest on the interest it already
            earned, not just on the original amount, so the balance grows faster and faster the longer it's left
            alone.
          </p>
          <p>
            Early on, the two methods barely differ — there isn't much accumulated interest yet for compounding to
            build on. But the gap widens dramatically over time, which is why the timeline you leave money to grow
            matters just as much as the rate it grows at, sometimes more.
          </p>
        </>
      }
      whyItMatters="This is why starting to save for retirement early matters so much more than the amount you start with, and why carrying credit card debt is so dangerous — both are compounding, just in opposite directions for you."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormulaBox label="Simple interest" formula="P × (1 + r × t)" />
        <FormulaBox label="Compound interest" formula="P × (1 + r)^t" />
      </div>

      <ExampleBox>
        <p>
          Put <strong>₹50,000</strong> away at an annual rate of <strong>8%</strong> for <strong>20 years</strong>,
          and the two methods land in very different places.
        </p>
        <p className="font-mono text-sm">
          Simple: ₹50,000 × (1 + 0.08 × 20) = ₹1,30,000
          <br />
          Compound: ₹50,000 × (1.08)^20 ≈ ₹2,33,048
        </p>
        <p>
          Simple interest turns ₹50,000 into ₹1,30,000. Compound interest, at the exact same rate and time period,
          turns it into roughly ₹2,33,048 — over ₹1,03,000 more, purely from letting each year's interest earn its
          own interest going forward.
        </p>
      </ExampleBox>

      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Slider
            label="Principal"
            value={principal}
            onChange={setPrincipal}
            min={500}
            max={50000}
            step={100}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Annual Rate"
            value={rate}
            onChange={setRate}
            min={1}
            max={20}
            step={0.5}
            format={(v) => formatPercent(v)}
          />
          <Slider
            label="Years"
            value={years}
            onChange={setYears}
            min={1}
            max={40}
            step={1}
            format={(v) => `${v}`}
            suffix=" yrs"
          />
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
                formatter={(v, name) => [formatCurrency(v), name === 'compound' ? 'Compound' : 'Simple']}
                labelFormatter={(l) => `Year ${l}`}
                contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#e7e5e4' }}
              />
              <Legend
                formatter={(value) => (value === 'compound' ? 'Compound interest' : 'Simple interest')}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line type="monotone" dataKey="simple" stroke="#44403c" strokeWidth={2} dot={false} isAnimationActive />
              <Line type="monotone" dataKey="compound" stroke="#2563eb" strokeWidth={2.5} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-stone-500">Simple interest</div>
            <div className="mt-1 font-mono text-lg font-bold text-stone-700">{formatCurrency(simpleFinal)}</div>
          </div>
          <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-stone-500">Compound interest</div>
            <div className="mt-1 font-mono text-lg font-bold text-accent">{formatCurrency(compoundFinal)}</div>
          </div>
          <div className="rounded-lg border border-stone-200 bg-surface px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-stone-500">Extra from compounding</div>
            <div className="mt-1 font-mono text-lg font-bold text-stone-900">{formatCurrency(difference)}</div>
          </div>
        </div>
      </div>
    </ModuleShell>
  )
}
