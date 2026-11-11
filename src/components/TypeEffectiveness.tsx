import { useTypeEffectiveness } from '../hooks/useTypeEffectiveness'
import { TypeBadge } from './TypeBadge'

interface TypeEffectivenessProps {
  types: string[]
}

function getGroupLabel(multiplier: number): string {
  if (multiplier === 0) {
    return 'Immune to'
  }

  return multiplier > 1 ? 'Weak to' : 'Resists'
}

export function TypeEffectiveness({ types }: TypeEffectivenessProps) {
  const { groups, isPending, isError } = useTypeEffectiveness(types)

  if (isError) {
    return null
  }

  return (
    <section
      aria-labelledby="type-matchups-heading"
      className="flex flex-col gap-2"
    >
      <h3
        id="type-matchups-heading"
        className="text-xs font-black uppercase tracking-widest text-neutral-600"
      >
        Type matchups
      </h3>

      {isPending ? (
        <p className="text-xs font-semibold text-neutral-600">
          Loading matchups…
        </p>
      ) : groups.length === 0 ? (
        <p className="text-xs font-semibold text-neutral-600">
          No notable weaknesses or resistances.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {groups.map((group) => {
            const label = getGroupLabel(group.multiplier)

            return (
              <section key={group.multiplier} aria-label={label}>
                <h4 className="mb-1 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500">
                  {label}
                </h4>
                <ul className="flex flex-wrap gap-2">
                  {group.types.map((type) => (
                    <li
                      key={type}
                      className="flex items-center gap-1 rounded-full bg-black/10 py-1 pr-2 pl-1"
                    >
                      <TypeBadge type={type} />
                      <span className="text-[0.65rem] font-black tabular-nums">
                        {group.multiplier}×
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}
