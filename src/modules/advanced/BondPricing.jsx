import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ModuleShell from '../../components/ModuleShell.jsx'
import Slider from '../../components/Slider.jsx'
import ExampleBox from '../../components/ExampleBox.jsx'
import FormulaBox from '../../components/FormulaBox.jsx'
import { formatCurrency, formatPercent } from '../../lib/format.js'

const FACE_VALUE = 1000

// Present value of an annual-coupon bond: each coupon discounted back at the
// market rate, plus the face value discounted back at maturity. Uses the
// annuity shortcut, with a separate branch at 0% market rate since the
// annuity formula divides by the rate.
function bondPrice(couponRatePct, marketRatePct, years) {
  const coupon = (couponRatePct / 100) * FACE_VALUE
  const r = marketRatePct / 100
  if (r === 0) {
    return coupon * years + FACE_VALUE
  }
  const pvCoupons = (coupon * (1 - Math.pow(1 + r, -years))) / r
  const pvFace = FACE_VALUE / Math.pow(1 + r, years)
  return pvCoupons + pvFace
}

export default function BondPricing({ module }) {
  const [couponRate, setCouponRate] = useState(5)
  const [marketRate, setMarketRate] = useState(5)
  const [years, setYears] = useState(10)

  const price = bondPrice(couponRate, marketRate, years)

  let status = 'Par'
  let statusTone = 'text-stone-700'
  if (couponRate > marketRate) {
    status = 'Premium'
    statusTone = 'text-accent'
  } else if (couponRate < marketRate) {
    status = 'Discount'
    statusTone = 'text-bad'
  }

  const statusExplain = {
    Premium: `The coupon rate (${formatPercent(couponRate, 2)}) beats the market rate (${formatPercent(marketRate, 2)}), so investors will pay more than face value to lock in those above-market coupons.`,
    Par: `The coupon rate equals the market rate, so the bond is worth exactly its face value — no premium, no discount.`,
    Discount: `The coupon rate (${formatPercent(couponRate, 2)}) falls short of the market rate (${formatPercent(marketRate, 2)}), so investors will only pay less than face value to accept those below-market coupons.`,
  }[status]

  const chartData = useMemo(() => {
    const data = []
    for (let r = 0; r <= 12; r += 0.5) {
      data.push({ rate: r, price: bondPrice(couponRate, r, years) })
    }
    return data
  }, [couponRate, years])

  return (
    <ModuleShell
      module={module}
      explainer={
        <>
          <p>
            A bond's coupon is fixed the day it's issued — locked in regardless of what happens to interest rates
            afterward. How attractive that fixed coupon looks depends entirely on where market rates sit later: if
            rates rise after you buy, your bond's coupon looks stingy next to what newly issued bonds now pay, and if
            rates fall, that same coupon suddenly looks generous.
          </p>
          <p>
            Price is the market's way of correcting for that gap. When the coupon rate exceeds the market rate,
            buyers bid the price up above face value to a <strong>premium</strong>, since they're locking in
            above-market coupons; when the coupon rate falls short, price drops below face value to a{' '}
            <strong>discount</strong>, compensating a new buyer for accepting below-market coupons; and when the two
            rates match exactly, price settles at exactly face value — <strong>par</strong>. That inverse
            relationship between price and market rate is the single most important mechanic in bond investing.
          </p>
        </>
      }
      whyItMatters="This inverse relationship is why rising interest rates hurt existing bond portfolios — it's one of the most consequential relationships in all of fixed income, and it drives how the entire bond market reprices every time a central bank moves rates."
    >
      <FormulaBox label="Bond price" formula="Sum of discounted coupons + discounted face value, at the market rate" />

      <ExampleBox>
        <p>
          Take a <strong>₹1,000 face-value bond</strong> with a <strong>6% annual coupon</strong> (₹60 a year) and{' '}
          <strong>5 years to maturity</strong>. If the market rate is also 6%, discounting every coupon and the final
          face value at that same 6% brings the price out to exactly what the bond promises to pay — <strong>₹1,000</strong>,
          at par.
        </p>
        <p className="font-mono text-sm">Market rate = 6% (= coupon rate) → Price = ₹1,000 (par)</p>
        <p>
          Now suppose market rates rise to 8% while the bond still only pays its fixed 6% coupon. Discounting those
          same ₹60 coupons and ₹1,000 face value at the higher 8% rate produces a smaller present value — the price
          falls to about <strong>₹920.15</strong>, a discount to face value, because a new buyer will only accept a
          below-market coupon if they get to buy in cheap.
        </p>
        <p className="font-mono text-sm">Market rate = 8% (&gt; coupon rate) → Price ≈ ₹920.15 (discount)</p>
      </ExampleBox>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500">
            Face Value: <span className="font-mono font-semibold text-stone-700">{formatCurrency(FACE_VALUE)}</span>{' '}
            · Coupons paid annually
          </div>

          <Slider
            label="Coupon Rate"
            value={couponRate}
            onChange={setCouponRate}
            min={0}
            max={10}
            step={0.25}
            format={(v) => formatPercent(v, 2)}
          />
          <Slider
            label="Market Interest Rate (Yield)"
            value={marketRate}
            onChange={setMarketRate}
            min={0}
            max={12}
            step={0.25}
            format={(v) => formatPercent(v, 2)}
          />
          <Slider
            label="Years to Maturity"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            step={1}
            format={(v) => `${v}`}
            suffix=" yrs"
          />

          <div className="rounded-lg border border-accent-soft bg-accent-soft/40 px-4 py-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-stone-700">Bond Price</span>
              <span className="font-mono text-lg font-bold text-accent">{formatCurrency(price)}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between text-sm">
              <span className="font-medium text-stone-700">Trading at</span>
              <span className={`font-mono text-sm font-bold ${statusTone}`}>{status}</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">{statusExplain}</p>
          </div>
        </div>

        <div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis
                  dataKey="rate"
                  type="number"
                  domain={[0, 12]}
                  tick={{ fontSize: 12, fill: '#78716c' }}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: 'Market Rate', position: 'insideBottom', offset: -4, fontSize: 12, fill: '#78716c' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#78716c' }}
                  tickFormatter={(v) => formatCurrency(v, { compact: true })}
                  width={64}
                />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  labelFormatter={(r) => `Market Rate: ${formatPercent(r, 2)}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  name="Bond Price"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                />
                <ReferenceDot x={marketRate} y={price} r={6} fill="var(--color-accent)" stroke="white" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-sm text-stone-500">
            The dot marks the current market rate — notice the curve slopes downward: as rates rise, price falls, and vice
            versa.
          </p>
        </div>
      </div>
    </ModuleShell>
  )
}
