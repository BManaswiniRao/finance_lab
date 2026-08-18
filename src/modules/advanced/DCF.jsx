import { useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatCurrency, formatPercent } from '../../lib/format.js'

const FORECAST_YEARS = [1, 2, 3, 4, 5]

export default function DCF({ module }) {
  const [baseFCF, setBaseFCF] = useState(10000000)
  const [growthRate, setGrowthRate] = useState(8)
  const [discountRate, setDiscountRateRaw] = useState(9)
  const [terminalGrowthRaw, setTerminalGrowthRaw] = useState(2.5)

  // Terminal growth must always stay comfortably below the discount rate —
  // otherwise the Gordon Growth denominator (discount - terminal) blows up.
  const maxTerminalGrowth = discountRate - 0.5
  const terminalGrowth = Math.min(terminalGrowthRaw, maxTerminalGrowth)

  const setDiscountRate = (v) => {
    setDiscountRateRaw(v)
    setTerminalGrowthRaw((tg) => Math.min(tg, v - 0.5))
  }

  const g = growthRate / 100
  const r = discountRate / 100
  const tg = terminalGrowth / 100

  const projections = FORECAST_YEARS.map((n) => {
    const fcf = baseFCF * Math.pow(1 + g, n)
    const pv = fcf / Math.pow(1 + r, n)
    return { year: n, fcf, pv }
  })

  const fcfYear5 = projections[projections.length - 1].fcf
  const terminalValue = (fcfYear5 * (1 + tg)) / (r - tg)
  const pvTerminal = terminalValue / Math.pow(1 + r, 5)

  const pvForecast = projections.reduce((sum, p) => sum + p.pv, 0)
  const enterpriseValue = pvForecast + pvTerminal
  const terminalShare = enterpriseValue > 0 ? (pvTerminal / enterpriseValue) * 100 : 0

  const chartData = [
    ...projections.map((p) => ({ name: `Year ${p.year}`, value: p.pv, isTerminal: false })),
    { name: 'Terminal Value', value: pvTerminal, isTerminal: true },
  ]

  return (
    <ModuleShell
      module={module}
      explainer="A DCF values a business as the sum of every rupee of cash it will ever generate, discounted back to what that's worth today. Since you can't forecast forever, everything past the explicit forecast window gets bundled into a single 'terminal value.' Drag the assumptions below and watch the valuation respond."
      whyItMatters="DCF is the core valuation method behind how analysts value private companies, M&A deals, and long-term equity research."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Slider
            label="Base Year Free Cash Flow"
            value={baseFCF}
            onChange={setBaseFCF}
            min={1000000}
            max={50000000}
            step={500000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Growth Rate (Years 1–5)"
            value={growthRate}
            onChange={setGrowthRate}
            min={0}
            max={20}
            step={0.5}
            format={(v) => formatPercent(v)}
          />
          <Slider
            label="Discount Rate (WACC)"
            value={discountRate}
            onChange={setDiscountRate}
            min={4}
            max={15}
            step={0.5}
            format={(v) => formatPercent(v)}
          />
          <Slider
            label="Terminal Growth Rate"
            value={terminalGrowth}
            onChange={setTerminalGrowthRaw}
            min={0}
            max={4}
            step={0.25}
            format={(v) => formatPercent(v)}
          />
          <p className="text-xs text-stone-400">
            Terminal growth is capped at {formatPercent(maxTerminalGrowth)} — just below the discount rate — so the
            terminal value formula never divides by zero.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="rounded-xl border border-accent-soft bg-accent-soft/40 px-5 py-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">Enterprise Value</div>
            <div className="mt-1 font-mono text-3xl font-bold text-accent">
              {formatCurrency(enterpriseValue, { compact: true })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-stone-200 px-3 py-2 text-center">
              <div className="text-xs text-stone-500">PV of Forecast (Yrs 1–5)</div>
              <div className="font-mono text-sm font-semibold text-stone-700">
                {formatCurrency(pvForecast, { compact: true })}
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 px-3 py-2 text-center">
              <div className="text-xs text-stone-500">PV of Terminal Value</div>
              <div className="font-mono text-sm font-semibold text-stone-700">
                {formatCurrency(pvTerminal, { compact: true })} ({formatPercent(terminalShare)})
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8" style={{ height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#78716c' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#78716c' }}
              tickFormatter={(v) => formatCurrency(v, { compact: true })}
              width={70}
            />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.isTerminal ? '#a8a29e' : 'var(--color-accent)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-4 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Discounted forecast FCF
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#a8a29e' }} /> Discounted terminal value
        </span>
      </div>
    </ModuleShell>
  )
}
