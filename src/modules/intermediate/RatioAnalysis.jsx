import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import { formatCurrency, formatPercent, formatRatio } from '../../lib/format.js'

const TONE_STYLES = {
  good: {
    border: 'border-good/30',
    bg: 'bg-good-soft',
    text: 'text-good',
    badge: 'Healthy',
  },
  neutral: {
    border: 'border-stone-200',
    bg: 'bg-stone-50',
    text: 'text-stone-600',
    badge: 'Watch',
  },
  bad: {
    border: 'border-bad/30',
    bg: 'bg-bad-soft',
    text: 'text-bad',
    badge: 'At Risk',
  },
}

function RatioCard({ label, value, tone, description }) {
  const styles = TONE_STYLES[tone]
  return (
    <div className={`rounded-xl border ${styles.border} ${styles.bg} px-4 py-3`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.text}`}>
          {styles.badge}
        </span>
      </div>
      <div className={`mt-1 font-mono text-2xl font-bold ${styles.text}`}>{value}</div>
      <p className="mt-1 text-xs leading-relaxed text-stone-500">{description}</p>
    </div>
  )
}

export default function RatioAnalysis({ module }) {
  const [currentAssets, setCurrentAssets] = useState(60000)
  const [currentLiabilities, setCurrentLiabilities] = useState(40000)
  const [totalDebt, setTotalDebt] = useState(80000)
  const [totalEquity, setTotalEquity] = useState(100000)
  const [revenue, setRevenue] = useState(200000)
  const [netIncome, setNetIncome] = useState(25000)

  const currentRatio = currentAssets / currentLiabilities
  const netMargin = (netIncome / revenue) * 100
  const debtToEquity = totalDebt / totalEquity
  const roe = (netIncome / totalEquity) * 100

  const currentRatioTone = currentRatio >= 1.5 ? 'good' : currentRatio >= 1.0 ? 'neutral' : 'bad'
  const netMarginTone = netMargin >= 10 ? 'good' : netMargin >= 0 ? 'neutral' : 'bad'
  const debtToEquityTone = debtToEquity <= 1.0 ? 'good' : debtToEquity <= 2.0 ? 'neutral' : 'bad'
  const roeTone = roe >= 15 ? 'good' : roe >= 0 ? 'neutral' : 'bad'

  return (
    <ModuleShell
      module={module}
      explainer="A handful of ratios pulled straight from the balance sheet and income statement tell you most of what you need to know about a company's health. Liquidity ratios ask whether it can pay its bills soon. Profitability ratios ask whether it's actually making money. Leverage ratios ask how much of it is funded by debt versus its own equity — and how risky that mix is."
      whyItMatters="These are the exact ratios analysts pull first when screening a company — they turn a wall of financial statements into a handful of numbers you can judge at a glance."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Balance Sheet</p>
          <Slider
            label="Current Assets"
            value={currentAssets}
            onChange={setCurrentAssets}
            min={10000}
            max={150000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Current Liabilities"
            value={currentLiabilities}
            onChange={setCurrentLiabilities}
            min={10000}
            max={100000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Total Debt"
            value={totalDebt}
            onChange={setTotalDebt}
            min={0}
            max={200000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Total Equity"
            value={totalEquity}
            onChange={setTotalEquity}
            min={20000}
            max={200000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-stone-400">Income Statement</p>
          <Slider
            label="Revenue"
            value={revenue}
            onChange={setRevenue}
            min={50000}
            max={500000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
          <Slider
            label="Net Income"
            value={netIncome}
            onChange={setNetIncome}
            min={-20000}
            max={100000}
            step={1000}
            format={(v) => formatCurrency(v, { compact: true })}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RatioCard
            label="Current Ratio"
            value={formatRatio(currentRatio)}
            tone={currentRatioTone}
            description="Current assets ÷ current liabilities. Can the company cover bills due within a year?"
          />
          <RatioCard
            label="Net Profit Margin"
            value={formatPercent(netMargin)}
            tone={netMarginTone}
            description="Net income ÷ revenue. How much of every sales rupee becomes profit?"
          />
          <RatioCard
            label="Debt-to-Equity"
            value={formatRatio(debtToEquity)}
            tone={debtToEquityTone}
            description="Total debt ÷ total equity. How leveraged is the company against its own capital?"
          />
          <RatioCard
            label="Return on Equity"
            value={formatPercent(roe)}
            tone={roeTone}
            description="Net income ÷ total equity. How efficiently is owners' capital generating profit?"
          />
        </div>
      </div>
    </ModuleShell>
  )
}
