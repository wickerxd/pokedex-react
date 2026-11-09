import { useEffect, useRef } from 'react'
import {
  formatHeight,
  formatPokemonId,
  formatWeight,
  getPokemonArtwork,
  titleCase,
} from '../lib/pokemon'
import type { Pokemon } from '../types/pokemon'
import { StatBar } from './StatBar'
import { TypeBadge } from './TypeBadge'

interface PokemonDetailsProps {
  pokemon: Pokemon
  isShiny: boolean
}

export function PokemonDetails({ pokemon, isShiny }: PokemonDetailsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const displayName = titleCase(pokemon.name)
  const artwork = getPokemonArtwork(pokemon, isShiny)

  useEffect(() => {
    headingRef.current?.focus()
  }, [pokemon.id])

  return (
    <article
      aria-labelledby="pokemon-name"
      className="flex h-full flex-col gap-4 text-neutral-900"
    >
      <header className="flex items-start justify-between gap-3">
        <h2
          ref={headingRef}
          id="pokemon-name"
          tabIndex={-1}
          className="text-2xl leading-tight font-black capitalize tracking-tight focus:outline-none sm:text-3xl"
        >
          {displayName}
        </h2>
        <p className="rounded-full bg-black/10 px-3 py-1 text-sm font-bold tabular-nums text-neutral-800">
          {formatPokemonId(pokemon.id)}
        </p>
      </header>

      <figure className="flex flex-col items-center gap-2">
        {artwork ? (
          <img
            src={artwork}
            alt={`${displayName}${isShiny ? ' shiny' : ''} artwork`}
            width={208}
            height={208}
            className="h-36 w-36 object-contain sm:h-52 sm:w-52"
          />
        ) : (
          <p className="flex h-36 w-36 items-center justify-center text-center text-sm text-neutral-700 sm:h-52 sm:w-52">
            No artwork available
          </p>
        )}
        {isShiny && (
          <figcaption className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-widest text-yellow-950">
            Shiny
          </figcaption>
        )}
      </figure>

      <ul aria-label="Types" className="flex flex-wrap gap-2">
        {pokemon.types.map(({ type }) => (
          <TypeBadge key={type.name} type={type.name} />
        ))}
      </ul>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="font-medium text-neutral-600">Height</dt>
        <dd className="text-right font-bold">{formatHeight(pokemon.height)}</dd>
        <dt className="font-medium text-neutral-600">Weight</dt>
        <dd className="text-right font-bold">{formatWeight(pokemon.weight)}</dd>
      </dl>

      <section
        aria-labelledby="abilities-heading"
        className="flex flex-col gap-2"
      >
        <h3
          id="abilities-heading"
          className="text-xs font-black uppercase tracking-widest text-neutral-600"
        >
          Abilities
        </h3>
        <ul className="flex flex-wrap gap-2">
          {pokemon.abilities.map(({ ability, is_hidden }) => (
            <li
              key={ability.name}
              className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold"
            >
              {titleCase(ability.name)}
              {is_hidden ? ' (hidden)' : ''}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stats-heading" className="flex flex-col gap-2">
        <h3
          id="stats-heading"
          className="text-xs font-black uppercase tracking-widest text-neutral-600"
        >
          Base stats
        </h3>
        <ul className="flex flex-col gap-2">
          {pokemon.stats.map(({ stat, base_stat }) => (
            <StatBar key={stat.name} name={stat.name} value={base_stat} />
          ))}
        </ul>
      </section>
    </article>
  )
}
