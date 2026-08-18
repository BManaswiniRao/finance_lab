import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatCurrency, formatPercent } from '../../lib/format.js'

const CATEGORIES = [
  { key: 'housing', label: 'Housing', type: 'fixed', min: 500, max: 3000, step: 25, default: 1500, color: '#2563eb' },
  { key: 'transportation', label: 'Transportation', type: 'fixed', min: 50, max: 800, step: 10, default: 300, color: '#7c3aed' },
  { key: 'groceries', label: 'Groceries', type: 'variable', min: 100, max: 1200, step: 10, default: 500, color: '#0891b2' },
  { key: 'entertainment', label: 'Entertainment', type: 'variable', min: 0, max: 800, step: 10, default: 200, color: '#ea580c' },
  { key: 'savings', label: 'Savings', type: 'variable', min: 0, max: 2000, step: 25, default: 400, color: '#16a34a' },
  { key: 'other', label: 'Other / Misc', type: 'variable', min: 0, max: 500, step: 10, default: 150, color: '#78716c' },
]

export default function Budgeting({ module }) {
  const [values, setValues] = useState(() => Object.fromEntries(CATEGORIES.map((c) => [c.key, c.default])))

  const total = useMemo(() => Object.values(values).reduce((sum, v) => sum + v, 0), [values])

  const pieData = CATEGORIES.map((c) => ({ name: c.label, value: values[c.key], color: c.color }))

  const setValue = (key) => (v) => setValues((prev) => ({ ...prev, [key]: v }))

  return (
    <ModuleShell
      module={module}
      explainer="Fixed costs — like rent and a car payment — stay roughly the same every month and are hard to change on short notice. Variable costs — groceries, entertainment, savings, discretionary spending — flex up or down depending on what you choose to spend. A monthly budget is just the sum of both, and knowing which is which tells you what you can actually adjust when money gets tight."
      whyItMatters="When cash is tight, cutting variable costs is realistic and fast — but shrinking fixed costs usually means a bigger structural change, like moving to cheaper housing or refinancing a loan, which takes time to pull off."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          {CATEGORIES.map((c) => (
            <div key={c.key}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-sm font-medium text-stone-700">{c.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    c.type === 'fixed' ? 'bg-stone-200 text-stone-600' : 'bg-accent-soft text-accent'
                  }`}
                >
                  {c.type}
                </span>
              </div>
              <Slider
                label={`${c.label} amount`}
                value={values[c.key]}
                onChange={setValue(c.key)}
                min={c.min}
                max={c.max}
                step={c.step}
                format={(v) => formatCurrency(v)}
              />
            </div>
          ))}

          <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-stone-700">Total monthly budget</span>
              <span className="font-mono text-lg font-bold text-accent">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [`${formatCurrency(v)} (${formatPercent((v / total) * 100)})`, name]}
                  contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#e7e5e4' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-stone-500">
            {CATEGORIES.map((c) => (
              <span key={c.key} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                {c.label} — {formatPercent(total ? (values[c.key] / total) * 100 : 0)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ModuleShell>
  )
}
