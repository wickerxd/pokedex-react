import type {
  EvolutionChain,
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  PokemonTypeResponse,
} from '../types/pokemon'

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

async function fetchJsonUrl<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
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

function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  return fetchJsonUrl<T>(`${POKEAPI_BASE_URL}${path}`, signal)
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

export function getPokemonSpecies(
  nameOrId: string | number,
  signal?: AbortSignal,
): Promise<PokemonSpecies> {
  const identifier = encodeURIComponent(
    String(nameOrId).trim().toLowerCase(),
  )

  return fetchJson<PokemonSpecies>(`/pokemon-species/${identifier}`, signal)
}

export function getEvolutionChain(
  url: string,
  signal?: AbortSignal,
): Promise<EvolutionChain> {
  return fetchJsonUrl<EvolutionChain>(url, signal)
}

export function getType(
  type: string,
  signal?: AbortSignal,
): Promise<PokemonTypeResponse> {
  const identifier = encodeURIComponent(type.trim().toLowerCase())

  return fetchJson<PokemonTypeResponse>(`/type/${identifier}`, signal)
}
