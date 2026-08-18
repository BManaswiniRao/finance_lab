export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (v) => v,
  suffix = '',
  disabled = false,
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-sm font-bold text-accent">
          {format(value)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={disabled ? 'opacity-50' : ''}
      />
      <div className="mt-1.5 flex justify-between text-xs text-ink-soft">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </label>
  )
}
