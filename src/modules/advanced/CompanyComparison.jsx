import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
import { formatCurrency, formatPercent, formatRatio } from '../../lib/format.js'

// Four deliberately mismatched businesses — different sizes, different
// business models — so raw rupee figures are useless for comparison but
// ratios still tell a clean story.
const COMPANIES = [
  {
    id: 'vantage',
    name: 'Vantage Cloud Systems',
    tag: 'Enterprise Software',
    revenue: 1200,
    netIncome: 300,
    assets: 1400,
    debt: 150,
    equity: 900,
    pe: 35,
    notes: {
      margin: 'A 25% margin is typical for asset-light software — most of each new sales rupee drops straight to profit.',
      roe: 'High ROE comes from strong profit on a lean equity base, not leverage — Vantage carries very little debt.',
      de: 'Minimal debt — software companies rarely need to borrow heavily to fund growth.',
      pe: 'A P/E near 35 signals investors are pricing in continued high growth, not just current earnings.',
    },
  },
  {
    id: 'bargain',
    name: 'Bargain Mart',
    tag: 'Discount Retail',
    revenue: 9000,
    netIncome: 180,
    assets: 3500,
    debt: 1600,
    equity: 1000,
    pe: 13,
    notes: {
      margin: 'A 2% margin is normal for discount retail — profit comes from enormous sales volume, not high markups.',
      roe: 'Decent ROE despite razor-thin margins — retailers turn inventory over many times a year to compensate.',
      de: 'A high debt load is common in retail, funding store buildouts and inventory with borrowed capital.',
      pe: 'A P/E of 13 reflects modest growth expectations for a mature, low-margin business.',
    },
  },
  {
    id: 'meridian',
    name: 'Meridian Regional Bank',
    tag: 'Regional Bank',
    revenue: 900,
    netIncome: 220,
    assets: 20000,
    debt: 18000,
    equity: 1400,
    pe: 9,
    notes: {
      margin: "Margin looks strong, but banks report net interest income, not product sales — it isn't directly comparable to a product company's margin.",
      roe: "ROE is a bank's central profitability metric, and Meridian earns a solid return for shareholders on it.",
      de: 'A debt-to-equity this high looks alarming outside banking, but banks are funded mostly by customer deposits — this is structurally normal for the industry.',
      pe: 'Banks typically trade at low P/E multiples like this because growth is slower and regulatory capital rules cap expansion.',
    },
  },
  {
    id: 'pulse',
    name: 'Pulse Electronics',
    tag: 'Consumer Electronics',
    revenue: 4200,
    netIncome: 320,
    assets: 3800,
    debt: 900,
    equity: 1900,
    pe: 18,
    notes: {
      margin: 'A margin around 7-8% is typical for hardware — component costs and competition keep it thinner than software.',
      roe: 'A moderate ROE reflects a blend of decent profits and moderate leverage, with no extreme in either direction.',
      de: 'A middle-of-the-road capital structure — some borrowing, but nowhere near a bank or a retailer.',
      pe: 'A P/E of 18 sits between the software premium and the retail/bank discount — a fairly "average" valuation.',
    },
  },
]

const METRICS = [
  {
    key: 'margin',
    label: 'Net Profit Margin',
    compute: (c) => (c.netIncome / c.revenue) * 100,
    format: (v) => formatPercent(v),
    better: 'higher',
    hint: 'Net Income ÷ Revenue — how much of every sales rupee becomes profit.',
  },
  {
    key: 'roe',
    label: 'Return on Equity',
    compute: (c) => (c.netIncome / c.equity) * 100,
    format: (v) => formatPercent(v),
    better: 'higher',
    hint: "Net Income ÷ Equity — the return the company earns on shareholders' money.",
  },
  {
    key: 'de',
    label: 'Debt-to-Equity',
    compute: (c) => c.debt / c.equity,
    format: (v) => `${formatRatio(v)}x`,
    better: 'lower',
    hint: 'Total Debt ÷ Equity — how much of the balance sheet is funded by borrowing.',
  },
  {
    key: 'pe',
    label: 'P/E Ratio',
    compute: (c) => c.pe,
    format: (v) => `${formatRatio(v, 1)}x`,
    better: 'lower',
    hint: "Share price ÷ earnings per share — what investors are paying for each rupee of profit.",
  },
]

function winner(metric, a, b) {
  const va = metric.compute(a)
  const vb = metric.compute(b)
  if (va === vb) return null
  if (metric.better === 'higher') return va > vb ? 'a' : 'b'
  return va < vb ? 'a' : 'b'
}

function CompanyCard({ company, side, other }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-surface p-5">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Company {side}</div>
      <div className="text-lg font-bold text-stone-900">{company.name}</div>
      <div className="mb-4 text-xs font-medium text-accent">{company.tag}</div>

      <dl className="mb-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-stone-500">
        <div className="flex justify-between">
          <dt>Revenue</dt>
          <dd className="font-mono text-stone-700">{formatCurrency(company.revenue * 1e6, { compact: true })}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Net Income</dt>
          <dd className="font-mono text-stone-700">{formatCurrency(company.netIncome * 1e6, { compact: true })}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Total Assets</dt>
          <dd className="font-mono text-stone-700">{formatCurrency(company.assets * 1e6, { compact: true })}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Total Equity</dt>
          <dd className="font-mono text-stone-700">{formatCurrency(company.equity * 1e6, { compact: true })}</dd>
        </div>
      </dl>

      <div className="space-y-2.5 border-t border-stone-100 pt-3">
        {METRICS.map((metric) => {
          const w = winner(metric, side === 'A' ? company : other, side === 'A' ? other : company)
          const isWinner = w === (side === 'A' ? 'a' : 'b')
          return (
            <div key={metric.key} className="rounded-lg bg-stone-50 px-3 py-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-stone-500">{metric.label}</span>
                <span className={`font-mono text-sm font-bold ${isWinner ? 'text-accent' : 'text-stone-700'}`}>
                  {metric.format(metric.compute(company))}
                  {isWinner && <span className="ml-1 text-[10px] font-semibold uppercase tracking-wide">stronger</span>}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-stone-500">{company.notes[metric.key]}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CompanyComparison({ module }) {
  const [aId, setAId] = useState(COMPANIES[0].id)
  const [bId, setBId] = useState(COMPANIES[1].id)

  const companyA = COMPANIES.find((c) => c.id === aId)
  const companyB = COMPANIES.find((c) => c.id === bId)

  const handleA = (id) => {
    setAId(id)
    if (id === bId) {
      const fallback = COMPANIES.find((c) => c.id !== id)
      setBId(fallback.id)
    }
  }
  const handleB = (id) => {
    setBId(id)
    if (id === aId) {
      const fallback = COMPANIES.find((c) => c.id !== id)
      setAId(fallback.id)
    }
  }

  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            Vantage Cloud Systems books ₹120Cr in revenue; Meridian Regional Bank sits on ₹2,000Cr in assets.
            Comparing those raw numbers tells you almost nothing — the companies are wildly different sizes and run
            entirely different business models. <strong>Ratios</strong> fix that: dividing one number by another
            strips out scale, so a 25% margin means the same thing whether it belongs to a software company or a
            retailer.
          </p>
          <p>
            Different ratios normalize for different things, which is why analysts rarely lean on just one. Margin
            and return on equity show how efficiently a company turns sales and shareholder capital into profit;
            debt-to-equity shows how much of the balance sheet is borrowed money versus owners' money; P/E shows how
            expensive the stock is relative to what the company actually earns. Pick two companies below and compare
            them across all four at once.
          </p>
        </>
      }
      whyItMatters="This is literally how equity analysts screen stocks within — and sometimes across — sectors: compare ratios first to spot who's more profitable, more levered, or more richly valued, then dig deeper into the ones that stand out."
    >
      <FormulaBox label="Return on Equity" formula="Net Income ÷ Shareholders' Equity" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <div className="mb-1.5 text-sm font-medium text-stone-700">Company A</div>
          <select
            value={aId}
            onChange={(e) => handleA(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-surface px-3 py-2 text-sm font-medium text-stone-700 focus:border-accent focus:outline-none"
          >
            {COMPANIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.tag}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <div className="mb-1.5 text-sm font-medium text-stone-700">Company B</div>
          <select
            value={bId}
            onChange={(e) => handleB(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-surface px-3 py-2 text-sm font-medium text-stone-700 focus:border-accent focus:outline-none"
          >
            {COMPANIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CompanyCard company={companyA} side="A" other={companyB} />
        <CompanyCard company={companyB} side="B" other={companyA} />
      </div>

      <p className="mt-5 text-center text-xs text-stone-400">
        "Stronger" is a simplification — for P/E and Debt-to-Equity in particular, context (growth stage, industry) matters
        more than the raw number. A bank's high leverage isn't a red flag the way it would be for a software company.
      </p>
    </ModuleShell>
  )
}
