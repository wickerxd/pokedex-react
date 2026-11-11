import { useQuery } from '@tanstack/react-query'
import { getEvolutionChain, getPokemonSpecies } from '../api/pokeapi'

export function useEvolutionChain(name?: string) {
  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', name],
    queryFn: ({ signal }) => getPokemonSpecies(name ?? '', signal),
    enabled: Boolean(name),
    staleTime: Infinity,
    retry: false,
  })

  const chainUrl = speciesQuery.data?.evolution_chain?.url
  const chainQuery = useQuery({
    queryKey: ['evolution-chain', chainUrl],
    queryFn: ({ signal }) => getEvolutionChain(chainUrl ?? '', signal),
    enabled: Boolean(chainUrl),
    staleTime: Infinity,
  })

  return {
    chain: chainQuery.data,
    isPending:
      speciesQuery.isPending || (Boolean(chainUrl) && chainQuery.isPending),
    isError: speciesQuery.isError || chainQuery.isError,
  }
}
