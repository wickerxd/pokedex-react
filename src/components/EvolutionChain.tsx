import { useEvolutionChain } from '../hooks/useEvolutionChain'
import {
  getIdFromUrl,
  getPokemonSpriteUrl,
  titleCase,
} from '../lib/pokemon'
import type { EvolutionChainLink } from '../types/pokemon'

interface EvolutionNodeProps {
  link: EvolutionChainLink
  currentName: string
  onSelect: (name: string) => void
}

function EvolutionNode({
  link,
  currentName,
  onSelect,
}: EvolutionNodeProps) {
  const id = getIdFromUrl(link.species.url)
  const displayName = titleCase(link.species.name)
  const isCurrent = link.species.name === currentName

  return (
    <li className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => onSelect(link.species.name)}
        aria-current={isCurrent ? 'step' : undefined}
        className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
          isCurrent
            ? 'bg-black/20 ring-2 ring-neutral-900/60'
            : 'hover:bg-black/10'
        }`}
      >
        <img
          src={getPokemonSpriteUrl(id)}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
        <span className="text-[0.65rem] font-bold leading-tight">
          {displayName}
        </span>
      </button>

      {link.evolves_to.length > 0 && (
        <ul className="flex flex-wrap items-start justify-center gap-2 border-t border-neutral-900/15 pt-2">
          {link.evolves_to.map((child) => (
            <EvolutionNode
              key={child.species.name}
              link={child}
              currentName={currentName}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

interface EvolutionChainProps {
  name: string
  onSelect: (name: string) => void
}

export function EvolutionChain({ name, onSelect }: EvolutionChainProps) {
  const { chain, isPending, isError } = useEvolutionChain(name)

  if (isError) {
    return null
  }

  return (
    <section
      aria-labelledby="evolution-heading"
      className="flex flex-col gap-2"
    >
      <h3
        id="evolution-heading"
        className="text-xs font-black uppercase tracking-widest text-neutral-600"
      >
        Evolution
      </h3>

      {isPending ? (
        <p className="text-xs font-semibold text-neutral-600">
          Loading evolution…
        </p>
      ) : chain ? (
        <ul className="flex flex-col items-center gap-2">
          <EvolutionNode
            link={chain.chain}
            currentName={name}
            onSelect={onSelect}
          />
        </ul>
      ) : null}
    </section>
  )
}
