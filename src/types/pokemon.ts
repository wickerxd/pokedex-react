export interface NamedApiResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

export interface PokemonNameEntry {
  name: string
  id: number
}

export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  front_female?: string | null
  front_shiny_female?: string | null
  back_default?: string | null
  back_shiny?: string | null
  other?: {
    'official-artwork'?: {
      front_default: string | null
      front_shiny: string | null
    }
    home?: {
      front_default: string | null
      front_shiny: string | null
    }
    dream_world?: {
      front_default: string | null
    }
  }
}

export interface PokemonType {
  slot: number
  type: NamedApiResource
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export interface PokemonAbility {
  ability: NamedApiResource
  is_hidden: boolean
  slot: number
}

export interface PokemonCries {
  latest: string | null
  legacy: string | null
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  sprites: PokemonSprites
  species: NamedApiResource
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  cries?: PokemonCries
}

export interface PokemonSpecies {
  id: number
  name: string
  evolution_chain: {
    url: string
  } | null
}

export interface EvolutionChainLink {
  species: NamedApiResource
  evolves_to: EvolutionChainLink[]
}

export interface EvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface TypeDamageRelations {
  double_damage_from: NamedApiResource[]
  half_damage_from: NamedApiResource[]
  no_damage_from: NamedApiResource[]
}

export interface PokemonTypeResponse {
  name: string
  damage_relations: TypeDamageRelations
}
