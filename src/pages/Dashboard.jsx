import { Link } from 'react-router-dom'
import { MODULES, LEVELS } from '../data/modules.js'
import { useProgress } from '../context/ProgressContext.jsx'

const LEVEL_TAGLINES = {
  foundational: 'The core concepts — no background assumed.',
  intermediate: 'The mechanics behind them, for readers who know the basics.',
  advanced: 'Deeper valuation and capital-markets topics.',
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
      className="animate-fade-up group flex gap-3.5 rounded-xl border border-line bg-surface p-4 transition-colors duration-150 hover:border-accent-soft hover:bg-accent-soft/20"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `color-mix(in srgb, ${level.color} 13%, transparent)`, color: level.color }}
      >
        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-[15px] font-semibold leading-snug text-ink group-hover:text-accent">
          {module.title}
          {done && <span className="ml-1.5 text-xs font-normal text-ink-soft">· read</span>}
        </h3>
        <p className="mt-0.5 text-sm leading-snug text-ink-soft">{module.blurb}</p>
      </div>
    </Link>
  )
}

function LevelSection({ levelKey }) {
  const level = LEVELS[levelKey]
  const modules = MODULES.filter((m) => m.level === levelKey)

  return (
    <section className="mb-12">
      <div className="mb-4 max-w-2xl">
        <h2 className="font-display text-xl font-semibold text-ink">{level.label}</h2>
        <p className="text-sm text-ink-soft">{LEVEL_TAGLINES[levelKey]}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {modules.map((m, i) => (
          <ModuleCard key={m.id} module={m} index={i} />
        ))}
      </div>
    </section>
  )
}

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-14 max-w-2xl">
        <h1 className="font-display mb-4 text-4xl font-semibold leading-[1.15] text-ink sm:text-5xl">
          A field guide to accounting and finance.
        </h1>
        <p className="text-lg leading-relaxed text-ink-soft">
          Plain-English explanations of the concepts you'll actually run into — the accounting equation, reading a
          balance sheet, discounted cash flow — each one with a worked example and a small interactive widget you
          can nudge to see the idea move.
        </p>
      </div>

      <LevelSection levelKey="foundational" />
      <LevelSection levelKey="intermediate" />
      <LevelSection levelKey="advanced" />
    </div>
  )
}
