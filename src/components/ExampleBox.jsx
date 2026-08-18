import { NotebookPen } from 'lucide-react'

/**
 * A worked, real-numbers example embedded in the article body —
 * distinct from the interactive widget, meant to be read like reference text.
 */
export default function ExampleBox({ title = 'Worked example', children }) {
  return (
    <div className="my-6 rounded-2xl border border-line bg-[#f5f0e4] p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
        <NotebookPen className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="space-y-2 text-[15px] leading-relaxed text-ink">{children}</div>
    </div>
  )
}
