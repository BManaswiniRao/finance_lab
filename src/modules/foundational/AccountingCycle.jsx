import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'

const STAGES = [
  {
    title: 'Journal',
    short: 'Record it',
    detail:
      'A transaction happens — say, a ₹500 cash sale. It gets written down immediately as a journal entry: which accounts it touches, and whether each is a debit or credit.',
  },
  {
    title: 'Ledger',
    short: 'Sort it',
    detail:
      'Every journal entry is posted into its account\'s ledger — a running page for "Cash," another for "Revenue," and so on — so you can see the full history and current balance of each account.',
  },
  {
    title: 'Trial Balance',
    short: 'Check it',
    detail:
      'At period end, every account balance is listed in one place. Total debits must equal total credits — if they don\'t, something was recorded wrong somewhere upstream.',
  },
  {
    title: 'Financial Statements',
    short: 'Report it',
    detail:
      'Once the trial balance checks out, the numbers are organized into the income statement, balance sheet, and cash flow statement — the reports people actually read.',
  },
]

export default function AccountingCycle({ module }) {
  const [active, setActive] = useState(0)

  return (
    <ModuleShell
      module={module}
      explainer="Accounting isn't one step — it's a repeating cycle. A transaction gets recorded, sorted, checked, then rolled up into the reports everyone actually reads. Click through each stage to see what happens there."
      whyItMatters="Understanding the cycle tells you where numbers on a financial statement actually come from — and where to look when something on a report doesn't add up."
    >
      <div className="mb-6 flex items-center">
        {STAGES.map((stage, i) => (
          <div key={stage.title} className="flex flex-1 items-center last:flex-none">
            <button
              onClick={() => setActive(i)}
              className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 text-xs font-bold transition-all sm:h-20 sm:w-20 ${
                active === i
                  ? 'border-accent bg-accent text-white shadow-lg shadow-accent/30'
                  : active > i
                    ? 'border-accent/40 bg-accent-soft text-accent'
                    : 'border-stone-200 bg-surface text-stone-400'
              }`}
            >
              <span className="text-lg">{i + 1}</span>
            </button>
            {i < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 transition-colors ${active > i ? 'bg-accent/40' : 'bg-stone-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2 text-center text-xs font-medium text-stone-400 sm:text-sm">
        {STAGES.map((s, i) => (
          <span key={s.title} className={active === i ? 'font-bold text-accent' : ''}>
            {s.title}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">{STAGES[active].short}</p>
        <h3 className="mb-2 text-lg font-bold text-stone-900">{STAGES[active].title}</h3>
        <p className="text-sm leading-relaxed text-stone-600">{STAGES[active].detail}</p>
      </div>

      <div className="mt-5 flex justify-between">
        <button
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          disabled={active === 0}
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 disabled:opacity-30"
        >
          ← Previous
        </button>
        <button
          onClick={() => setActive((a) => Math.min(STAGES.length - 1, a + 1))}
          disabled={active === STAGES.length - 1}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </ModuleShell>
  )
}
