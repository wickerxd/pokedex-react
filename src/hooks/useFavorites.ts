import { useCallback, useEffect, useState } from 'react'

export interface FavoritePokemon {
  name: string
  id: number
}

const STORAGE_KEY = 'pokedex:favorites'

function readFavorites(): FavoritePokemon[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item): item is FavoritePokemon =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as FavoritePokemon).name === 'string' &&
        typeof (item as FavoritePokemon).id === 'number',
    )
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>(readFavorites)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Storage can be unavailable (private mode, quota). Keep in memory.
    }
  }, [favorites])

  const isFavorite = useCallback(
    (name: string) => favorites.some((favorite) => favorite.name === name),
    [favorites],
  )

  const toggleFavorite = useCallback((favorite: FavoritePokemon) => {
    setFavorites((current) =>
      current.some((item) => item.name === favorite.name)
        ? current.filter((item) => item.name !== favorite.name)
        : [...current, favorite],
    )
  }, [])

  const removeFavorite = useCallback((name: string) => {
    setFavorites((current) =>
      current.filter((favorite) => favorite.name !== name),
    )
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  }
}
