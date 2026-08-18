import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { MODULES, LEVELS } from '../data/modules.js'
import { useProgress } from '../context/ProgressContext.jsx'

const LEVEL_TAGLINES = {
  foundational: 'Start here — no background assumed.',
  intermediate: 'For students who know the basics and want the mechanics.',
  advanced: 'CFA-Level-1-ish territory. Bring your calculator.',
}

function ModuleCard({ module, index }) {
  const { isVisited } = useProgress()
  const done = isVisited(module.id)
  const level = LEVELS[module.level]
  const Icon = module.icon

  return (
    <Link
      to={`/module/${module.id}`}
      style={{ animationDelay: `${index * 35}ms` }}
      className="animate-fade-up group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(33,28,22,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(33,28,22,0.18)]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.08] transition-transform duration-300 group-hover:scale-125"
        style={{ backgroundColor: level.color }}
      />
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `color-mix(in srgb, ${level.color} 14%, transparent)`, color: level.color }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          {done && (
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: level.color }}
              title="Opened"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>
        <h3 className="font-display mb-1 text-base font-semibold leading-snug text-ink group-hover:underline decoration-2 underline-offset-2" style={{ textDecorationColor: level.color }}>
          {module.title}
        </h3>
        <p className="text-sm leading-snug text-ink-soft">{module.blurb}</p>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: level.color }}>
        Try it
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}

function LevelSection({ levelKey, startIndex }) {
  const level = LEVELS[levelKey]
  const modules = MODULES.filter((m) => m.level === levelKey)

  return (
    <section className="mb-12">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: level.color }} />
        <h2 className="font-display text-xl font-semibold text-ink">{level.label}</h2>
        <span className="text-sm text-ink-soft">{LEVEL_TAGLINES[levelKey]}</span>
        <span className="ml-auto text-xs font-medium text-ink-soft">{modules.length} modules</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m, i) => (
          <ModuleCard key={m.id} module={m} index={startIndex + i} />
        ))}
      </div>
    </section>
  )
}

export default function Dashboard() {
  const { visited } = useProgress()
  const total = MODULES.length
  const done = MODULES.filter((m) => visited[m.id]).length
  const foundationalCount = MODULES.filter((m) => m.level === 'foundational').length
  const intermediateCount = MODULES.filter((m) => m.level === 'intermediate').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mb-14 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-10 sm:px-10 sm:py-14">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.10] blur-2xl"
          style={{ backgroundColor: 'var(--color-accent)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full opacity-[0.08] blur-2xl"
          style={{ backgroundColor: 'var(--color-level-intermediate)' }}
        />
        <div className="relative max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent-soft bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Learn by touching it
          </span>
          <h1 className="font-display mb-4 text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            Finance, taught with your hands, not a textbook.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-ink-soft">
            Every concept here pairs a short explanation with one thing you can drag, click, or slide. Move a
            number, watch the consequence happen live — that's the whole method.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div>
              <div className="font-display text-3xl font-semibold text-ink">{total}</div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-soft">interactive modules</div>
            </div>
            <div className="h-9 w-px bg-line" />
            <div>
              <div className="font-display text-3xl font-semibold text-ink">3</div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-soft">levels, zero to CFA-ish</div>
            </div>
            <div className="h-9 w-px bg-line" />
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--color-line)" strokeWidth="4" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - (total ? done / total : 0))}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-ink">
                  {done}/{total}
                </span>
              </div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                your
                <br />
                progress
              </div>
            </div>
          </div>
        </div>
      </div>

      <LevelSection levelKey="foundational" startIndex={0} />
      <LevelSection levelKey="intermediate" startIndex={foundationalCount} />
      <LevelSection levelKey="advanced" startIndex={foundationalCount + intermediateCount} />
    </div>
  )
}
