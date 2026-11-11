import { usePokemonNames } from '../hooks/usePokemonNames'
import { pickRandom } from '../lib/random'

interface SurpriseButtonProps {
  onPick: (name: string) => void
}

export function SurpriseButton({ onPick }: SurpriseButtonProps) {
  const { data: names = [], isPending, isError } = usePokemonNames()
  const isDisabled = isPending || isError || names.length === 0

  function handleClick() {
    const name = pickRandom(names)

    if (name) {
      onPick(name)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span aria-hidden="true" className="text-base leading-none">
        ?
      </span>
      Surprise me
    </button>
  )
}
