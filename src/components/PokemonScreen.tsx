import type { ReactNode } from 'react'
import { ApiError } from '../api/pokeapi'
import { usePokemon } from '../hooks/usePokemon'
import { titleCase } from '../lib/pokemon'
import { PokeballIcon } from './PokeballIcon'
import { PokemonDetails } from './PokemonDetails'

interface PokemonScreenProps {
  name: string | null
  isShiny: boolean
}

const CENTERED_SCREEN =
  'flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 p-2 text-center sm:min-h-[26rem]'

export function PokemonScreen({ name, isShiny }: PokemonScreenProps) {
  const {
    data: pokemon,
    isPending,
    isError,
    error,
    refetch,
  } = usePokemon(name ?? undefined)

  const displayName = name ? titleCase(name) : ''
  const isNotFound = error instanceof ApiError && error.status === 404
  let status = 'No Pokémon selected.'
  let content: ReactNode

  if (!name) {
    content = (
      <div className={CENTERED_SCREEN}>
        <PokeballIcon className="h-16 w-16 opacity-70 sm:h-20 sm:w-20" />
        <p className="max-w-xs text-sm font-semibold text-pokedex-screen-dark sm:text-base">
          Search for a Pokémon to see its Pokédex entry.
        </p>
      </div>
    )
  } else if (isPending) {
    status = `Loading ${displayName}.`
    content = (
      <div className={CENTERED_SCREEN}>
        <PokeballIcon className="h-14 w-14 animate-spin motion-reduce:animate-none sm:h-16 sm:w-16" />
        <p className="text-sm font-semibold text-pokedex-screen-dark sm:text-base">
          Loading {displayName}…
        </p>
      </div>
    )
  } else if (isError) {
    status = isNotFound
      ? `${displayName} was not found.`
      : 'There was an error loading this Pokémon.'
    content = (
      <div className={CENTERED_SCREEN}>
        <p className="max-w-xs text-sm font-semibold text-pokedex-screen-dark sm:text-base">
          {isNotFound
            ? `No Pokémon named “${displayName}” was found.`
            : 'Something went wrong while loading this Pokémon.'}
        </p>
        {!isNotFound && (
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-xl bg-pokedex-screen-dark px-4 py-2 text-sm font-bold text-pokedex-screen transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pokedex-screen-dark focus-visible:ring-offset-2 focus-visible:ring-offset-pokedex-screen"
          >
            Try again
          </button>
        )}
      </div>
    )
  } else if (pokemon) {
    status = `${titleCase(pokemon.name)} loaded.`
    content = <PokemonDetails pokemon={pokemon} isShiny={isShiny} />
  } else {
    content = null
  }

  return (
    <>
      <p className="sr-only" role="status">
        {status}
      </p>
      {content}
    </>
  )
}
