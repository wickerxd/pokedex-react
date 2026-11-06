import type { Pokemon, PokemonListResponse } from '../types/pokemon'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

export class ApiError extends Error {
  readonly status: number
  readonly url: string

  constructor(message: string, status: number, url: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.url = url
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${POKEAPI_BASE_URL}${path}`
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      url,
    )
  }

  return (await response.json()) as T
}

export function getPokemonNames(
  signal?: AbortSignal,
): Promise<PokemonListResponse> {
  return fetchJson<PokemonListResponse>(
    '/pokemon?limit=100000&offset=0',
    signal,
  )
}

export function getPokemon(
  nameOrId: string | number,
  signal?: AbortSignal,
): Promise<Pokemon> {
  const identifier = encodeURIComponent(
    String(nameOrId).trim().toLowerCase(),
  )

  return fetchJson<Pokemon>(`/pokemon/${identifier}`, signal)
}
