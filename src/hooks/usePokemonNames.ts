import { useQuery } from '@tanstack/react-query'
import { getPokemonNames } from '../api/pokeapi'

export function usePokemonNames() {
  return useQuery({
    queryKey: ['pokemon', 'names'],
    queryFn: ({ signal }) => getPokemonNames(signal),
    select: (data) => data.results.map((pokemon) => pokemon.name),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
