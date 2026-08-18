/**
 * Small reference callout for a formula or definition — sits inline in
 * article text, not inside the interactive widget card.
 */
export default function FormulaBox({ label, formula }) {
  return (
    <div className="my-5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-accent-soft bg-accent-soft/30 px-4 py-3">
      {label && <span className="text-xs font-bold uppercase tracking-wide text-accent">{label}</span>}
      <span className="font-mono text-sm font-semibold text-ink">{formula}</span>
    </div>
  )
}
