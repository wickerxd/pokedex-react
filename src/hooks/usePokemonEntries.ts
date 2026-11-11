import { useQuery } from '@tanstack/react-query'
import { getPokemonNames } from '../api/pokeapi'
import { getIdFromUrl } from '../lib/pokemon'
import type { PokemonNameEntry } from '../types/pokemon'

export function usePokemonEntries() {
  return useQuery({
    queryKey: ['pokemon', 'names'],
    queryFn: ({ signal }) => getPokemonNames(signal),
    select: (data): PokemonNameEntry[] =>
      data.results.map((pokemon) => ({
        name: pokemon.name,
        id: getIdFromUrl(pokemon.url),
      })),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
