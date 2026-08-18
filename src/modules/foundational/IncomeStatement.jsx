import ModuleShell from '../../components/ModuleShell.jsx'
import ClickReveal from '../../components/ClickReveal.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
import { formatCurrency } from '../../lib/format.js'

const revenue = 500000
const cogs = 200000
const grossProfit = revenue - cogs
const opex = 150000
const operatingIncome = grossProfit - opex
const tax = 30000
const netIncome = operatingIncome - tax

export default function IncomeStatement({ module }) {
  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            The income statement answers one question: did the business make money over a period of time — a month,
            a quarter, a year? Unlike the balance sheet, which is a snapshot at a single instant, this is a movie
            covering a stretch of time. It starts with everything the business sold and works down through several
            layers of cost, each one stripping away a different kind of expense, until whatever survives at the
            bottom is real profit.
          </p>
          <p>
            The reason it's built as a cascade rather than one big subtraction is that each subtotal tells a
            different story. Gross profit shows whether the product itself is priced sensibly above what it costs
            to make; operating income shows whether the business as a whole is run efficiently; net income shows
            what's actually left for the owners after taxes. Click each line below to see what it means and how it
            flows into the next.
          </p>
        </>
      }
      whyItMatters="Net income is the headline number investors and lenders look at first — and every line above it explains exactly where that profit came from, or where it leaked away."
    >
      <FormulaBox label="The cascade" formula="Revenue − COGS − OpEx − Tax = Net Income" />

      <div className="space-y-2">
        <ClickReveal
          label="Revenue"
          value={formatCurrency(revenue)}
          explanation="Total sales before any costs are subtracted — the top line. Everything below this line is a deduction from it."
        />
        <ClickReveal
          label="Cost of Goods Sold (COGS)"
          value={`− ${formatCurrency(cogs)}`}
          valueClass="text-bad"
          explanation="The direct cost of producing what was sold — materials, direct labor. Doesn't include rent, marketing, or salaries for people who don't make the product."
        />
        <ClickReveal
          label="Gross Profit"
          value={formatCurrency(grossProfit)}
          valueClass="text-good font-bold"
          tone="good"
          explanation="Revenue minus COGS. Shows how much money is left after covering the direct cost of the product itself — before any overhead."
        />
        <ClickReveal
          label="Operating Expenses (OpEx)"
          value={`− ${formatCurrency(opex)}`}
          valueClass="text-bad"
          indent
          explanation="Rent, salaries, marketing, admin — the cost of running the business day-to-day, separate from making the product."
        />
        <ClickReveal
          label="Operating Income"
          value={formatCurrency(operatingIncome)}
          valueClass="text-good font-bold"
          tone="good"
          explanation="Gross profit minus operating expenses. This is profit from the core business, before interest and taxes — often called EBIT."
        />
        <ClickReveal
          label="Taxes"
          value={`− ${formatCurrency(tax)}`}
          valueClass="text-bad"
          indent
          explanation="What the business owes the government on its taxable income for the period."
        />
        <ClickReveal
          label="Net Income"
          value={formatCurrency(netIncome)}
          valueClass="text-good font-bold text-base"
          tone="good"
          explanation="The bottom line — literally the last line of the statement. What's left after every cost, including taxes, is subtracted from revenue."
        />
      </div>
    </ModuleShell>
  )
}
