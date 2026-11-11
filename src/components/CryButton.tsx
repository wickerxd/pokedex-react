import { useRef, useState } from 'react'

interface CryButtonProps {
  cryUrl?: string | null
  name: string
}

export function CryButton({ cryUrl, name }: CryButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!cryUrl) {
    return null
  }

  function handlePlay() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.currentTime = 0
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={cryUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={handlePlay}
        aria-label={`Play ${name} cry`}
        className="flex items-center gap-1.5 rounded-xl border border-neutral-900/20 bg-black/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-neutral-900 transition hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <span aria-hidden="true" className="text-base leading-none">
          ♪
        </span>
        {isPlaying ? 'Playing…' : 'Play cry'}
      </button>
    </>
  )
}
