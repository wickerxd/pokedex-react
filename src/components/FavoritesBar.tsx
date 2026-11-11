import type { FavoritePokemon } from '../hooks/useFavorites'
import { getPokemonSpriteUrl, titleCase } from '../lib/pokemon'

interface FavoritesBarProps {
  favorites: FavoritePokemon[]
  onSelect: (name: string) => void
  onRemove: (name: string) => void
  onClear: () => void
}

export function FavoritesBar({
  favorites,
  onSelect,
  onRemove,
  onClear,
}: FavoritesBarProps) {
  return (
    <section aria-labelledby="favorites-heading" className="flex flex-col gap-2">
      <header className="flex items-center justify-between gap-3">
        <h3
          id="favorites-heading"
          className="text-xs font-bold uppercase tracking-widest text-white/60"
        >
          Favorites {favorites.length > 0 ? `(${favorites.length})` : ''}
        </h3>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded text-xs font-semibold text-white/60 underline-offset-2 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Clear all
          </button>
        )}
      </header>

      {favorites.length === 0 ? (
        <p className="text-xs text-white/60">
          No favorites yet. Star a Pokémon to save it here.
        </p>
      ) : (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {favorites.map((favorite) => {
            const displayName = titleCase(favorite.name)

            return (
              <li
                key={favorite.name}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-black/20 p-1"
              >
                <button
                  type="button"
                  onClick={() => onSelect(favorite.name)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs font-semibold text-white transition hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <img
                    src={getPokemonSpriteUrl(favorite.id)}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                  <span>{displayName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(favorite.name)}
                  aria-label={`Remove ${displayName} from favorites`}
                  className="rounded-lg px-2 py-1 text-sm text-white/60 transition hover:bg-black/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
