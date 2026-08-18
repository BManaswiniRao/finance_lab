import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
import { formatCurrency } from '../../lib/format.js'

const TRANSACTIONS = [
  {
    id: 't1',
    text: 'Business receives ₹5,000 cash from a customer',
    account: 'Cash',
    side: 'debit',
    amount: 5000,
    why: 'Cash is an asset. Assets increase with a debit — so cash coming in is a debit to the Cash account.',
  },
  {
    id: 't2',
    text: 'Business pays ₹1,200 rent in cash',
    account: 'Cash',
    side: 'credit',
    amount: 1200,
    why: 'Cash is going out, so the asset decreases. Assets decrease with a credit.',
  },
  {
    id: 't3',
    text: 'Business takes a ₹10,000 bank loan',
    account: 'Loans Payable',
    side: 'credit',
    amount: 10000,
    why: 'A loan is a liability. Liabilities increase with a credit — the business now owes more.',
  },
  {
    id: 't4',
    text: 'Business pays off ₹2,000 of that loan',
    account: 'Loans Payable',
    side: 'debit',
    amount: 2000,
    why: 'Paying down a liability decreases it, and liabilities decrease with a debit.',
  },
  {
    id: 't5',
    text: 'Owner invests ₹8,000 of their own cash into the business',
    account: "Owner's Equity",
    side: 'credit',
    amount: 8000,
    why: "Equity increases with a credit. The owner's claim on the business just grew.",
  },
  {
    id: 't6',
    text: 'Business earns ₹3,000 in service revenue',
    account: 'Revenue',
    side: 'credit',
    amount: 3000,
    why: 'Revenue increases equity, and increases to equity-type accounts are recorded as credits.',
  },
]

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function DebitsCredits({ module }) {
  const [queue, setQueue] = useState(() => shuffled(TRANSACTIONS))
  const [dragId, setDragId] = useState(null)
  const [feedback, setFeedback] = useState(null) // { correct, tx, chosenSide }
  const [solved, setSolved] = useState([])
  const [dragOverSide, setDragOverSide] = useState(null)

  const current = queue[0]

  const handleDrop = (side) => {
    if (!current || dragId !== current.id) return
    setDragOverSide(null)
    const correct = current.side === side
    setFeedback({ correct, tx: current, chosenSide: side })
    if (correct) {
      setSolved((s) => [...s, current])
      setTimeout(() => {
        setQueue((q) => q.slice(1))
        setFeedback(null)
      }, 1400)
    }
  }

  const reset = () => {
    setQueue(shuffled(TRANSACTIONS))
    setSolved([])
    setFeedback(null)
  }

  const debitEntries = solved.filter((s) => s.side === 'debit')
  const creditEntries = solved.filter((s) => s.side === 'credit')
  const debitTotal = debitEntries.reduce((s, e) => s + e.amount, 0)
  const creditTotal = creditEntries.reduce((s, e) => s + e.amount, 0)

  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            The words "debit" and "credit" sound like judgments — good news versus bad news — but they're really
            nothing more than <strong>left</strong> and <strong>right</strong>. Every account in the books is drawn
            as a two-column ledger called a <strong>T-account</strong>: whatever gets entered on the left is a
            debit, whatever gets entered on the right is a credit. That's the entire definition. Every transaction
            touches at least two accounts, and every time, one gets a debit and the other a credit.
          </p>
          <p>
            What decides which side a number lands on is the <em>type</em> of account it's hitting. Assets and
            expenses grow when you write on their left side and shrink when you write on their right, while
            liabilities, equity, and revenue work the opposite way — they grow on the right. It feels arbitrary
            until you remember it's just enforcing the accounting equation: for the books to stay in balance, the
            total written on the left across all accounts has to equal the total written on the right. Drag each
            transaction below onto the side you think it belongs.
          </p>
        </>
      }
      whyItMatters="This debit/credit mechanism is what keeps the accounting equation balanced on every single transaction — it's the actual mechanics behind 'the books balance,' not just a rule to memorize."
    >
      <FormulaBox label="Debit side increases" formula="Assets, Expenses" />
      <FormulaBox label="Credit side increases" formula="Liabilities, Equity, Revenue" />

      {!current ? (
        <div className="py-10 text-center">
          <p className="mb-3 text-lg font-semibold text-good">All transactions sorted correctly.</p>
          <button
            onClick={reset}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
          >
            Try again with a new shuffle
          </button>
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Transaction</p>
            <p
              className="mt-1 cursor-grab text-sm font-medium text-stone-800 active:cursor-grabbing"
              draggable
              onDragStart={() => setDragId(current.id)}
              onDragEnd={() => setDragId(null)}
            >
              🖐 {current.text}
              <span className="ml-2 rounded bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                {current.account}
              </span>
            </p>
            <p className="mt-1 text-xs text-stone-400">Drag the card above into Debit or Credit below.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['debit', 'credit'].map((side) => (
              <div
                key={side}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverSide(side)
                }}
                onDragLeave={() => setDragOverSide((s) => (s === side ? null : s))}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(side)
                }}
                className={`min-h-[180px] rounded-xl border-2 border-dashed p-3 transition-colors ${
                  dragOverSide === side ? 'border-accent bg-accent-soft/40' : 'border-stone-200 bg-surface'
                }`}
              >
                <p className="mb-2 text-center text-sm font-bold uppercase tracking-wide text-stone-500">
                  {side === 'debit' ? 'Debit (Left)' : 'Credit (Right)'}
                </p>
                <div className="space-y-1.5">
                  {(side === 'debit' ? debitEntries : creditEntries).map((e) => (
                    <div key={e.id} className="rounded-md bg-stone-50 px-2 py-1.5 text-xs text-stone-600">
                      {e.account} — {formatCurrency(e.amount)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {feedback && (
            <div
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                feedback.correct ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'
              }`}
            >
              <p className="font-semibold">
                {feedback.correct ? 'Correct!' : `Not quite — that's actually a ${feedback.tx.side}.`}
              </p>
              <p className="mt-1 text-stone-700">{feedback.tx.why}</p>
              {!feedback.correct && (
                <button
                  onClick={() => setFeedback(null)}
                  className="mt-2 rounded bg-surface px-3 py-1 text-xs font-semibold text-stone-600 shadow-sm hover:bg-stone-50"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          <div className="mt-5 flex justify-between text-xs text-stone-400">
            <span>
              {solved.length} of {TRANSACTIONS.length} sorted
            </span>
            <span className="font-mono">
              Debits {formatCurrency(debitTotal)} · Credits {formatCurrency(creditTotal)}
            </span>
          </div>
        </>
      )}
    </ModuleShell>
  )
}
