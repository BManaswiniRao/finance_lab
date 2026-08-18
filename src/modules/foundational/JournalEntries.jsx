import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import { formatCurrency } from '../../lib/format.js'

const ACCOUNTS = ['Cash', 'Accounts Receivable', 'Equipment', 'Accounts Payable', 'Loans Payable', "Owner's Equity", 'Revenue', 'Rent Expense']

const SCENARIOS = [
  {
    id: 's1',
    text: 'The business buys ₹4,000 of equipment, paying cash.',
    amount: 4000,
    debit: 'Equipment',
    credit: 'Cash',
    why: 'Equipment (an asset) increases, so it\'s debited. Cash (also an asset) decreases, so it\'s credited.',
  },
  {
    id: 's2',
    text: 'The business performs a ₹2,500 service for a client, to be paid later.',
    amount: 2500,
    debit: 'Accounts Receivable',
    credit: 'Revenue',
    why: 'The client owes money now, so Accounts Receivable (asset) increases — a debit. Revenue increases equity, which is a credit.',
  },
  {
    id: 's3',
    text: 'The business pays ₹1,000 rent in cash.',
    amount: 1000,
    debit: 'Rent Expense',
    credit: 'Cash',
    why: 'Rent Expense increases (debit — expenses reduce equity, and debits reduce equity). Cash, an asset, decreases — a credit.',
  },
  {
    id: 's4',
    text: 'The business borrows ₹6,000 from a bank, received as cash.',
    amount: 6000,
    debit: 'Cash',
    credit: 'Loans Payable',
    why: 'Cash increases — a debit. Loans Payable, a liability, increases — a credit.',
  },
  {
    id: 's5',
    text: 'The business pays ₹1,800 owed to a supplier.',
    amount: 1800,
    debit: 'Accounts Payable',
    credit: 'Cash',
    why: 'Paying down what\'s owed decreases the liability Accounts Payable — a debit. Cash decreases — a credit.',
  },
]

function AccountSlot({ label, value, onChange, dropSide, onDrop, onDragOver, dragOver }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-400">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          onDragOver(dropSide)
        }}
        onDragLeave={() => onDragOver(null)}
        onDrop={(e) => {
          e.preventDefault()
          onDrop(dropSide)
        }}
        className={`flex h-14 items-center justify-center rounded-lg border-2 border-dashed px-3 text-sm font-semibold transition-colors ${
          dragOver === dropSide ? 'border-accent bg-accent-soft/40' : 'border-stone-200 bg-surface'
        } ${value ? 'text-stone-800' : 'text-stone-300'}`}
      >
        {value || 'Drop an account here'}
      </div>
    </div>
  )
}

export default function JournalEntries({ module }) {
  const [index, setIndex] = useState(0)
  const [debitAccount, setDebitAccount] = useState(null)
  const [creditAccount, setCreditAccount] = useState(null)
  const [dragAccount, setDragAccount] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [result, setResult] = useState(null) // 'correct' | 'incorrect'
  const [solvedCount, setSolvedCount] = useState(0)

  const scenario = SCENARIOS[index]
  const done = index >= SCENARIOS.length

  const handleDrop = (side) => {
    if (!dragAccount) return
    if (side === 'debit') setDebitAccount(dragAccount)
    else setCreditAccount(dragAccount)
    setDragOver(null)
    setResult(null)
  }

  const checkAnswer = () => {
    const correct = debitAccount === scenario.debit && creditAccount === scenario.credit
    setResult(correct ? 'correct' : 'incorrect')
    if (correct) setSolvedCount((c) => c + 1)
  }

  const next = () => {
    setIndex((i) => i + 1)
    setDebitAccount(null)
    setCreditAccount(null)
    setResult(null)
  }

  const restart = () => {
    setIndex(0)
    setDebitAccount(null)
    setCreditAccount(null)
    setResult(null)
    setSolvedCount(0)
  }

  const isBalanced = debitAccount && creditAccount

  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            A journal entry is the very first thing that happens when a business transaction gets recorded — before
            it's sorted into a ledger, before it shows up on any report. It's just a simple statement of which two
            (or more) accounts a transaction touched, and which side of each got the debit and which got the
            credit. Every single transaction a business makes, from a ₹1,000 rent payment to a multi-crore
            acquisition, starts life as a journal entry exactly like the ones below.
          </p>
          <p>
            Writing one correctly means asking two questions: which accounts changed, and did each one go up or
            down? From there the debit/credit rule you've already seen decides which side each account lands on —
            get both accounts right and the entry balances automatically. Read the scenario, drag the two accounts
            you think are involved into the Debit and Credit slots, then check your answer.
          </p>
        </>
      }
      whyItMatters="This is literally what accountants and bookkeeping software do thousands of times a day — every invoice, payment, and payroll run becomes a journal entry exactly like this."
    >
      {done ? (
        <div className="py-10 text-center">
          <p className="mb-3 text-lg font-semibold text-good">
            You solved {solvedCount} of {SCENARIOS.length} scenarios correctly.
          </p>
          <button onClick={restart} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90">
            Restart
          </button>
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Scenario {index + 1} of {SCENARIOS.length}
            </p>
            <p className="mt-1 text-sm font-medium text-stone-800">{scenario.text}</p>
            <p className="mt-1 font-mono text-sm text-accent">{formatCurrency(scenario.amount)}</p>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">Accounts (drag one into each slot)</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {ACCOUNTS.map((acc) => (
              <div
                key={acc}
                draggable
                onDragStart={() => setDragAccount(acc)}
                onDragEnd={() => setDragAccount(null)}
                className="cursor-grab rounded-full border border-stone-200 bg-surface px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm active:cursor-grabbing"
              >
                {acc}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AccountSlot
              label="Debit"
              value={debitAccount}
              dropSide="debit"
              onDrop={handleDrop}
              onDragOver={setDragOver}
              dragOver={dragOver}
            />
            <AccountSlot
              label="Credit"
              value={creditAccount}
              dropSide="credit"
              onDrop={handleDrop}
              onDragOver={setDragOver}
              dragOver={dragOver}
            />
          </div>

          {result === 'incorrect' && (
            <div className="mt-4 rounded-lg bg-bad-soft px-4 py-3 text-sm text-bad">
              <p className="font-semibold">Not quite — the entry doesn't match the scenario.</p>
              <p className="mt-1 text-stone-700">Correct entry: Debit {scenario.debit}, Credit {scenario.credit}. {scenario.why}</p>
            </div>
          )}
          {result === 'correct' && (
            <div className="mt-4 rounded-lg bg-good-soft px-4 py-3 text-sm text-good">
              <p className="font-semibold">Balanced and correct.</p>
              <p className="mt-1 text-stone-700">{scenario.why}</p>
            </div>
          )}

          <div className="mt-5 flex justify-end gap-3">
            {result !== 'correct' ? (
              <button
                onClick={checkAnswer}
                disabled={!isBalanced}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
              >
                Check answer
              </button>
            ) : (
              <button onClick={next} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
                {index === SCENARIOS.length - 1 ? 'Finish' : 'Next scenario →'}
              </button>
            )}
          </div>
        </>
      )}
    </ModuleShell>
  )
}
