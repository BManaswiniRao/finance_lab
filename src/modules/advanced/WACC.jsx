import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatPercent } from '../../lib/format.js'

const DEBT_COLOR = '#78716c'
const EQUITY_COLOR = 'var(--color-accent)'

export default function WACC({ module }) {
  const [costOfDebt, setCostOfDebt] = useState(5)
  const [costOfEquity, setCostOfEquity] = useState(12)
  const [weightOfDebt, setWeightOfDebt] = useState(40)
  const [taxRate, setTaxRate] = useState(25)

  const weightOfEquity = 100 - weightOfDebt

  const weightedCostOfDebt = (weightOfDebt / 100) * costOfDebt * (1 - taxRate / 100)
  const weightedCostOfEquity = (weightOfEquity / 100) * costOfEquity
  const wacc = weightedCostOfDebt + weightedCostOfEquity

  const debtShareOfWacc = wacc > 0 ? (weightedCostOfDebt / wacc) * 100 : 0
  const equityShareOfWacc = wacc > 0 ? (weightedCostOfEquity / wacc) * 100 : 0

  const pieData = [
    { name: 'Debt', value: weightOfDebt },
    { name: 'Equity', value: weightOfEquity },
  ]

  return (
    <ModuleShell
      module={module}
      explainer="WACC blends what it costs a company to borrow — adjusted down for the tax shield on interest — with what it costs to raise equity, which is simply the return investors require for the risk they're taking. Each is weighted by how much of the company's capital comes from that source."
      whyItMatters="WACC is the discount rate used in DCF valuation and the minimum return a company's investments need to clear to create value — its 'hurdle rate.'"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Slider
            label="Cost of Debt (pre-tax)"
            value={costOfDebt}
            onChange={setCostOfDebt}
            min={1}
            max={15}
            step={0.5}
            format={(v) => formatPercent(v)}
          />
          <Slider
            label="Cost of Equity"
            value={costOfEquity}
            onChange={setCostOfEquity}
            min={5}
            max={25}
            step={0.5}
            format={(v) => formatPercent(v)}
          />
          <Slider
            label="Weight of Debt (% of total capital)"
            value={weightOfDebt}
            onChange={setWeightOfDebt}
            min={0}
            max={100}
            step={5}
            format={(v) => formatPercent(v, 0)}
          />
          <Slider
            label="Tax Rate"
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={40}
            step={1}
            format={(v) => formatPercent(v, 0)}
          />
          <p className="text-xs text-stone-400">
            Weight of Equity is derived: {formatPercent(weightOfEquity, 0)}.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="rounded-xl border border-accent-soft bg-accent-soft/40 px-5 py-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">WACC</div>
            <div className="mt-1 font-mono text-3xl font-bold text-accent">WACC = {formatPercent(wacc)}</div>
          </div>

          <div style={{ height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.name === 'Debt' ? DEBT_COLOR : EQUITY_COLOR} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatPercent(v, 0)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
          How each piece contributes to WACC
        </div>
        <div className="flex h-8 overflow-hidden rounded-md bg-stone-100">
          <div
            className="flex h-full items-center justify-center text-xs font-semibold text-white transition-all duration-300"
            style={{ width: `${debtShareOfWacc}%`, backgroundColor: DEBT_COLOR }}
          >
            {debtShareOfWacc > 12 ? formatPercent(weightedCostOfDebt) : ''}
          </div>
          <div
            className="flex h-full items-center justify-center text-xs font-semibold text-white transition-all duration-300"
            style={{ width: `${equityShareOfWacc}%`, backgroundColor: 'var(--color-accent)' }}
          >
            {equityShareOfWacc > 12 ? formatPercent(weightedCostOfEquity) : ''}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2">
            <span className="flex items-center gap-1.5 text-stone-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DEBT_COLOR }} /> Weighted Cost of Debt (after-tax)
            </span>
            <span className="font-mono font-semibold text-stone-700">{formatPercent(weightedCostOfDebt)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2">
            <span className="flex items-center gap-1.5 text-stone-500">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Weighted Cost of Equity
            </span>
            <span className="font-mono font-semibold text-stone-700">{formatPercent(weightedCostOfEquity)}</span>
          </div>
        </div>
      </div>
    </ModuleShell>
  )
}
