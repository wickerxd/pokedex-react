import type { CSSProperties } from 'react'
import { getStatLabel, MAX_STAT_VALUE } from '../lib/pokemon'

interface StatBarProps {
  name: string
  value: number
}

export function StatBar({ name, value }: StatBarProps) {
  const label = getStatLabel(name)
  const color =
    value >= 100 ? '#16a34a' : value >= 60 ? '#ca8a04' : '#dc2626'

  return (
    <li className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs font-semibold text-neutral-700 sm:w-20">
        {label}
      </span>
      <meter
        min={0}
        max={MAX_STAT_VALUE}
        value={value}
        aria-label={`${label}: ${value} out of ${MAX_STAT_VALUE}`}
        className="stat-meter h-2 w-full"
        style={{ '--stat-color': color } as CSSProperties}
      />
      <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-neutral-900">
        {value}
      </span>
    </li>
  )
}
