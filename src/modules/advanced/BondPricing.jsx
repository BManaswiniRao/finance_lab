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
      explainer="A bond pays a fixed coupon no matter what happens to interest rates elsewhere. When market rates rise above that coupon, the bond's fixed payments look less attractive, so its price has to fall to compensate a new buyer — and the reverse happens when rates fall. That's why bond prices and market interest rates move in opposite directions, always."
      whyItMatters="This inverse relationship is why rising interest rates hurt existing bond portfolios — it's one of the most consequential relationships in all of fixed income, and it drives how the entire bond market reprices every time a central bank moves rates."
    >
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
