import type { Pokemon } from '../types/pokemon'

export const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
  stellar: '#40B5A5',
  unknown: '#68A090',
  shadow: '#5A5366',
} as const

export type PokemonTypeName = keyof typeof TYPE_COLORS

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export const MAX_STAT_VALUE = 255

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function getIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

export function getPokemonSpriteUrl(id: number, shiny = false): string {
  const shinyPath = shiny ? 'shiny/' : ''
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${id}.png`
}

export function getOfficialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function titleCase(value: string): string {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type as PokemonTypeName] ?? '#6B7280'
}

export function getStatLabel(statName: string): string {
  return STAT_LABELS[statName] ?? titleCase(statName)
}

export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`
}

export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}

export function getPokemonArtwork(
  pokemon: Pokemon,
  shiny = false,
): string | null {
  const { sprites } = pokemon
  const officialArtwork = sprites.other?.['official-artwork']
  const home = sprites.other?.home

  if (shiny) {
    return (
      officialArtwork?.front_shiny ??
      home?.front_shiny ??
      sprites.front_shiny ??
      sprites.front_default
    )
  }

  return (
    officialArtwork?.front_default ??
    home?.front_default ??
    sprites.front_default
  )
}
