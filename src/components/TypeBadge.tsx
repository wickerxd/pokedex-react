import { getTypeColor, titleCase } from '../lib/pokemon'

interface TypeBadgeProps {
  type: string
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <li
      className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm"
      style={{ backgroundColor: getTypeColor(type) }}
    >
      {titleCase(type)}
    </li>
  )
}
