import { useEffect, useRef } from 'react'
import {
  formatHeight,
  formatPokemonId,
  formatWeight,
  getPokemonArtwork,
  titleCase,
} from '../lib/pokemon'
import type { Pokemon } from '../types/pokemon'
import { CryButton } from './CryButton'
import { EvolutionChain } from './EvolutionChain'
import { FavoriteButton } from './FavoriteButton'
import { StatBar } from './StatBar'
import { TypeBadge } from './TypeBadge'
import { TypeEffectiveness } from './TypeEffectiveness'

interface PokemonDetailsProps {
  pokemon: Pokemon
  isShiny: boolean
  isFavorite: boolean
  onToggleFavorite: (pokemon: Pokemon) => void
  onSelect: (name: string) => void
}

export function PokemonDetails({
  pokemon,
  isShiny,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: PokemonDetailsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const displayName = titleCase(pokemon.name)
  const artwork = getPokemonArtwork(pokemon, isShiny)
  const cryUrl = pokemon.cries?.latest ?? pokemon.cries?.legacy

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [pokemon.id])

  return (
    <article
      aria-labelledby="pokemon-name"
      className="grid h-full gap-4 text-neutral-900 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:grid-rows-1 sm:gap-6"
    >
      <div className="flex min-w-0 flex-col gap-4 sm:h-full sm:overflow-y-auto sm:pr-1">
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

        <div className="flex flex-wrap gap-2">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite(pokemon)}
          />
          <CryButton cryUrl={cryUrl} name={displayName} />
        </div>

        <figure className="flex flex-col items-center gap-2">
          {artwork ? (
            <img
              src={artwork}
              alt={`${displayName}${isShiny ? ' shiny' : ''} artwork`}
              width={208}
              height={208}
              className="h-36 w-36 object-contain sm:h-44 sm:w-44 lg:h-48 lg:w-48"
            />
          ) : (
            <p className="flex h-36 w-36 items-center justify-center text-center text-sm text-neutral-700 sm:h-44 sm:w-44 lg:h-48 lg:w-48">
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
            <li key={type.name}>
              <TypeBadge type={type.name} />
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="font-medium text-neutral-600">Height</dt>
          <dd className="text-right font-bold">
            {formatHeight(pokemon.height)}
          </dd>
          <dt className="font-medium text-neutral-600">Weight</dt>
          <dd className="text-right font-bold">
            {formatWeight(pokemon.weight)}
          </dd>
        </dl>
      </div>

      <div className="flex min-w-0 flex-col gap-4 sm:h-full sm:overflow-y-auto sm:pr-2">
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

        <TypeEffectiveness
          types={pokemon.types.map(({ type }) => type.name)}
        />

        <section
          aria-labelledby="stats-heading"
          className="flex flex-col gap-2"
        >
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

        <EvolutionChain name={pokemon.species.name} onSelect={onSelect} />
      </div>
    </article>
  )
}
