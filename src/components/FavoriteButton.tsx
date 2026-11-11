interface FavoriteButtonProps {
  isFavorite: boolean
  disabled?: boolean
  onToggle: () => void
}

export function FavoriteButton({
  isFavorite,
  disabled = false,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      disabled={disabled}
      onClick={onToggle}
      className="flex items-center gap-1.5 rounded-xl border border-neutral-900/20 bg-black/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-neutral-900 transition hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {isFavorite ? '★' : '☆'}
      </span>
      {isFavorite ? 'Favorited' : 'Favorite'}
    </button>
  )
}
