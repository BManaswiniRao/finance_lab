import { useState } from 'react'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
import { formatNumber } from '../../lib/format.js'

const SCALE_MAX = 120

export default function WorkingCapital({ module }) {
  const [dso, setDso] = useState(45)
  const [dio, setDio] = useState(60)
  const [dpo, setDpo] = useState(30)

  const ccc = dso + dio - dpo

  const cccTone =
    ccc <= 30
      ? { text: 'text-good', bg: 'bg-good-soft', bar: 'bg-good' }
      : ccc <= 60
        ? { text: 'text-stone-700', bg: 'bg-stone-100', bar: 'bg-stone-500' }
        : { text: 'text-bad', bg: 'bg-bad-soft', bar: 'bg-bad' }

  const widthOf = (days) => `${Math.min(100, Math.max(2, (days / SCALE_MAX) * 100))}%`

  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            Inventory sits on the shelf for a while before it sells — that's{' '}
            <strong>Days Inventory Outstanding (DIO)</strong>. Once it sells, customers usually take time to actually
            pay — that's <strong>Days Sales Outstanding (DSO)</strong>. Meanwhile the business gets a bit of breathing
            room because it doesn't have to pay its own suppliers the instant it buys from them — that's{' '}
            <strong>Days Payables Outstanding (DPO)</strong>.
          </p>
          <p>
            Put the three together and you get the <strong>Cash Conversion Cycle</strong> — how many days of cash the
            business has to fund out of its own pocket between paying for stock and actually collecting cash from
            customers. A shorter cycle means less cash tied up in the day-to-day grind; a longer one means the
            business needs a bigger cash cushion (or a line of credit) just to keep operating.
          </p>
        </>
      }
      whyItMatters="A company can be fully profitable on paper and still run out of cash if its cash conversion cycle is too long — fast-growing businesses fail this way when sales outpace the cash coming in the door."
    >
      <FormulaBox label="Cash conversion cycle" formula="DSO + DIO − DPO = Days cash is tied up" />

      <ExampleBox>
        <p>
          A small retailer collects payment from customers <strong>40 days</strong> after the sale on average (DSO),
          and stock typically sits in the store for <strong>50 days</strong> before it sells (DIO). The retailer, in
          turn, gets <strong>20 days</strong> to pay its own suppliers before payment is due (DPO).
        </p>
        <p className="font-mono text-sm">40 + 50 − 20 = 70 days</p>
        <p>
          That means the retailer has to fund 70 days of stock and unpaid customer bills entirely out of its own cash
          before any of that money comes back in the door. If it doesn't have enough cash saved up to cover 70 days
          of operations, it needs a loan or credit line to bridge the gap — even though the business itself is
          perfectly healthy.
        </p>
      </ExampleBox>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Slider
            label="Days Sales Outstanding (DSO)"
            value={dso}
            onChange={setDso}
            min={0}
            max={90}
            step={1}
            format={(v) => formatNumber(v)}
            suffix=" days"
          />
          <Slider
            label="Days Inventory Outstanding (DIO)"
            value={dio}
            onChange={setDio}
            min={0}
            max={120}
            step={1}
            format={(v) => formatNumber(v)}
            suffix=" days"
          />
          <Slider
            label="Days Payables Outstanding (DPO)"
            value={dpo}
            onChange={setDpo}
            min={0}
            max={90}
            step={1}
            format={(v) => formatNumber(v)}
            suffix=" days"
          />

          <div className={`rounded-lg border border-stone-200 px-4 py-3 ${cccTone.bg}`}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-stone-700">Cash Conversion Cycle</span>
              <span className={`font-mono text-lg font-bold ${cccTone.text}`}>
                {ccc >= 0 ? formatNumber(ccc) : `−${formatNumber(Math.abs(ccc))}`} days
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              DSO + DIO − DPO. {ccc < 0 ? 'Negative means you collect cash before you even have to pay suppliers — excellent.' : 'This many days of cash the business has to fund itself.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-stone-500">
              <span>Inventory (DIO)</span>
              <span className="font-mono">{formatNumber(dio)}d</span>
            </div>
            <div className="h-6 overflow-hidden rounded-md bg-stone-100">
              <div className="h-full rounded-md bg-stone-400 transition-all duration-300" style={{ width: widthOf(dio) }} />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-stone-500">
              <span>Receivables (DSO)</span>
              <span className="font-mono">{formatNumber(dso)}d</span>
            </div>
            <div className="h-6 overflow-hidden rounded-md bg-stone-100">
              <div className="h-full rounded-md bg-accent transition-all duration-300" style={{ width: widthOf(dso) }} />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-stone-500">
              <span>Payables offset (DPO)</span>
              <span className="font-mono">{formatNumber(dpo)}d</span>
            </div>
            <div className="h-6 overflow-hidden rounded-md bg-stone-100">
              <div className="h-full rounded-md bg-indigo-400 transition-all duration-300" style={{ width: widthOf(dpo) }} />
            </div>
          </div>

          <p className="mt-2 text-center text-sm text-stone-500">
            Inventory + receivables days is cash tied up. Payables days is how much of that gap suppliers cover for you.
            What's left — the <span className="font-semibold text-stone-700">Cash Conversion Cycle</span> — is what the
            business has to fund itself.
          </p>
        </div>
      </div>
    </ModuleShell>
  )
}
