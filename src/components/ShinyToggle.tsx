interface ShinyToggleProps {
  isShiny: boolean
  disabled: boolean
  onChange: (value: boolean) => void
}

export function ShinyToggle({
  isShiny,
  disabled,
  onChange,
}: ShinyToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={isShiny}
      disabled={disabled}
      onClick={() => onChange(!isShiny)}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 rounded-full ${
          isShiny
            ? 'bg-yellow-300 shadow-[0_0_10px_2px_rgba(253,224,71,0.8)]'
            : 'bg-white/30'
        }`}
      />
      Shiny
    </button>
  )
}
