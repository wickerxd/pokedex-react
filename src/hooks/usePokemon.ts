import { useQuery } from '@tanstack/react-query'
import { ApiError, getPokemon } from '../api/pokeapi'

export function usePokemon(name?: string) {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: ({ signal }) => getPokemon(name ?? '', signal),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false
      }

      return failureCount < 2
    },
  })
}
