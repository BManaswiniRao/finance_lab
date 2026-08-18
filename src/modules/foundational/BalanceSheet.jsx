import ModuleShell from '../../components/ModuleShell.jsx'
import ClickReveal from '../../components/ClickReveal.jsx'
import { formatCurrency } from '../../lib/format.js'

const currentAssets = [
  { label: 'Cash', value: 60000, explanation: 'Money sitting in the bank, ready to use immediately.' },
  {
    label: 'Accounts Receivable',
    value: 40000,
    explanation: 'Money customers owe the business for goods or services already delivered, expected within a year.',
  },
  { label: 'Inventory', value: 30000, explanation: 'Goods bought or made that haven\'t been sold yet.' },
]
const nonCurrentAssets = [
  { label: 'Property & Equipment', value: 150000, explanation: 'Buildings, machinery, vehicles — physical assets used for years, not sold as inventory.' },
  { label: 'Intangible Assets', value: 20000, explanation: 'Non-physical assets with value, like patents, trademarks, or goodwill from an acquisition.' },
]
const currentLiabilities = [
  { label: 'Accounts Payable', value: 25000, explanation: 'Money the business owes suppliers for goods or services already received, due within a year.' },
  { label: 'Short-Term Debt', value: 15000, explanation: 'Loans or credit lines due within the next 12 months.' },
]
const nonCurrentLiabilities = [
  { label: 'Long-Term Debt', value: 100000, explanation: 'Loans or bonds not due for more than a year — the bulk of long-run borrowing.' },
]

const totalCurrentAssets = currentAssets.reduce((s, a) => s + a.value, 0)
const totalNonCurrentAssets = nonCurrentAssets.reduce((s, a) => s + a.value, 0)
const totalAssets = totalCurrentAssets + totalNonCurrentAssets
const totalCurrentLiabilities = currentLiabilities.reduce((s, a) => s + a.value, 0)
const totalNonCurrentLiabilities = nonCurrentLiabilities.reduce((s, a) => s + a.value, 0)
const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities
const equity = totalAssets - totalLiabilities

function Group({ title, items, total }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <p className="text-xs font-bold uppercase tracking-wide text-stone-400">{title}</p>
        <p className="font-mono text-xs font-semibold text-stone-400">{formatCurrency(total)}</p>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <ClickReveal key={item.label} label={item.label} value={formatCurrency(item.value)} explanation={item.explanation} />
        ))}
      </div>
    </div>
  )
}

export default function BalanceSheet({ module }) {
  return (
    <ModuleShell
      module={module}
      explainer="A balance sheet is a snapshot at a single moment: what the business owns (assets), what it owes (liabilities), and what's left for the owners (equity). Both sides are split into 'current' (within a year) and 'non-current' (longer-term). Click any line to learn what it means."
      whyItMatters="Unlike the income statement, which covers a period, the balance sheet shows financial position at an instant — it's how lenders and investors judge whether a company can cover its short-term obligations."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-bold text-stone-700">Assets</h3>
          <Group title="Current Assets" items={currentAssets} total={totalCurrentAssets} />
          <Group title="Non-Current Assets" items={nonCurrentAssets} total={totalNonCurrentAssets} />
          <div className="flex items-center justify-between rounded-lg bg-stone-900 px-4 py-2.5 text-white">
            <span className="text-sm font-semibold">Total Assets</span>
            <span className="font-mono text-sm font-bold">{formatCurrency(totalAssets)}</span>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-stone-700">Liabilities & Equity</h3>
          <Group title="Current Liabilities" items={currentLiabilities} total={totalCurrentLiabilities} />
          <Group title="Non-Current Liabilities" items={nonCurrentLiabilities} total={totalNonCurrentLiabilities} />
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between px-1">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-400">Equity</p>
              <p className="font-mono text-xs font-semibold text-stone-400">{formatCurrency(equity)}</p>
            </div>
            <ClickReveal
              label="Owner's / Shareholders' Equity"
              value={formatCurrency(equity)}
              explanation="Total assets minus total liabilities — what would be left for the owners if every liability were paid off today."
            />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-stone-900 px-4 py-2.5 text-white">
            <span className="text-sm font-semibold">Total Liabilities + Equity</span>
            <span className="font-mono text-sm font-bold">{formatCurrency(totalLiabilities + equity)}</span>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-stone-500">
        Total Assets ({formatCurrency(totalAssets)}) always equals Total Liabilities + Equity ({formatCurrency(totalLiabilities + equity)}).
      </p>
    </ModuleShell>
  )
}
