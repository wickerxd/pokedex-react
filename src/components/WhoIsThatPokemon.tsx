import { useEffect, useRef, useState } from 'react'
import { usePokemonEntries } from '../hooks/usePokemonEntries'
import {
  getOfficialArtworkUrl,
  getPokemonSpriteUrl,
  titleCase,
} from '../lib/pokemon'
import { pickDistinctRandom, pickRandom, shuffle } from '../lib/random'
import type { PokemonNameEntry } from '../types/pokemon'
import { PokeballIcon } from './PokeballIcon'

interface GameRound {
  answer: PokemonNameEntry
  options: string[]
}

const BEST_STREAK_KEY = 'pokedex:best-streak'
const OPTION_COUNT = 4
const CENTERED_SCREEN =
  'flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 p-2 text-center sm:min-h-[26rem]'

function createRound(entries: readonly PokemonNameEntry[]): GameRound | null {
  const answer = pickRandom(entries)

  if (!answer) {
    return null
  }

  const decoys = pickDistinctRandom(
    entries.filter((entry) => entry.name !== answer.name),
    OPTION_COUNT - 1,
  )

  return {
    answer,
    options: shuffle([answer.name, ...decoys.map((entry) => entry.name)]),
  }
}

function readBestStreak(): number {
  try {
    const value = Number(window.localStorage.getItem(BEST_STREAK_KEY))
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
  } catch {
    return 0
  }
}

function writeBestStreak(value: number) {
  try {
    window.localStorage.setItem(BEST_STREAK_KEY, String(value))
  } catch {
    // Storage can be unavailable (private mode, quota). Keep in memory.
  }
}

interface PokemonArtworkProps {
  id: number
  name: string
  isRevealed: boolean
}

function PokemonArtwork({ id, name, isRevealed }: PokemonArtworkProps) {
  const spriteUrl = getPokemonSpriteUrl(id)
  const [source, setSource] = useState(() => getOfficialArtworkUrl(id))
  const [hasFailed, setHasFailed] = useState(false)

  function handleError() {
    if (source === spriteUrl) {
      setHasFailed(true)
      return
    }

    setSource(spriteUrl)
  }

  if (hasFailed) {
    return (
      <span
        aria-hidden="true"
        className="flex h-32 w-32 items-center justify-center text-5xl font-black text-neutral-500 sm:h-40 sm:w-40 sm:text-6xl"
      >
        ?
      </span>
    )
  }

  return (
    <img
      src={source}
      alt={isRevealed ? `${name} artwork` : ''}
      width={160}
      height={160}
      onError={handleError}
      className={`h-32 w-32 object-contain transition-[filter] duration-300 motion-reduce:transition-none sm:h-40 sm:w-40 ${
        isRevealed ? '' : 'brightness-0'
      }`}
    />
  )
}

export function WhoIsThatPokemon() {
  const {
    data: entries = [],
    isPending,
    isError,
    refetch,
  } = usePokemonEntries()

  if (isPending) {
    return (
      <div className={CENTERED_SCREEN}>
        <PokeballIcon className="h-14 w-14 animate-spin motion-reduce:animate-none sm:h-16 sm:w-16" />
        <p className="text-sm font-semibold text-pokedex-screen-dark sm:text-base">
          Loading Pokémon…
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={CENTERED_SCREEN}>
        <p className="max-w-xs text-sm font-semibold text-pokedex-screen-dark sm:text-base">
          Could not load the Pokémon list.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl bg-pokedex-screen-dark px-4 py-2 text-sm font-bold text-pokedex-screen transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pokedex-screen-dark focus-visible:ring-offset-2 focus-visible:ring-offset-pokedex-screen"
        >
          Try again
        </button>
      </div>
    )
  }

  if (entries.length < OPTION_COUNT) {
    return (
      <div className={CENTERED_SCREEN}>
        <p className="max-w-xs text-sm font-semibold text-pokedex-screen-dark sm:text-base">
          Not enough Pokémon data to start a game.
        </p>
      </div>
    )
  }

  return <GameBoard entries={entries} />
}

interface GameBoardProps {
  entries: PokemonNameEntry[]
}

function GameBoard({ entries }: GameBoardProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [round, setRound] = useState<GameRound | null>(() =>
    createRound(entries),
  )
  const [guess, setGuess] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(readBestStreak)

  const isRevealed = guess !== null

  useEffect(() => {
    if (isRevealed) {
      nextButtonRef.current?.focus()
    }
  }, [isRevealed])

  function startRound() {
    const nextRound = createRound(entries)

    if (!nextRound) {
      return
    }

    setRound(nextRound)
    setGuess(null)
  }

  function handleGuess(option: string) {
    if (!round || isRevealed) {
      return
    }

    const isCorrect = option === round.answer.name
    const nextStreak = isCorrect ? streak + 1 : 0

    setGuess(option)
    setStreak(nextStreak)

    if (isCorrect && nextStreak > bestStreak) {
      setBestStreak(nextStreak)
      writeBestStreak(nextStreak)
    }
  }

  function handleNext() {
    startRound()
    headingRef.current?.focus()
  }

  if (!round) {
    return (
      <div className={CENTERED_SCREEN}>
        <p className="max-w-xs text-sm font-semibold text-pokedex-screen-dark sm:text-base">
          Could not start a round.
        </p>
      </div>
    )
  }

  const answerName = titleCase(round.answer.name)
  const isCorrect = guess === round.answer.name
  const feedback = isRevealed
    ? isCorrect
      ? `Correct! It was ${answerName}.`
      : `Not quite. It was ${answerName}.`
    : 'Choose the Pokémon that matches the silhouette.'

  return (
    <section
      aria-labelledby="game-heading"
      className="flex h-full flex-col gap-4 text-neutral-900 sm:overflow-y-auto sm:pr-1"
    >
      <header className="flex flex-wrap items-end justify-between gap-2">
        <h2
          ref={headingRef}
          id="game-heading"
          tabIndex={-1}
          className="text-xl leading-tight font-black tracking-tight focus:outline-none sm:text-2xl"
        >
          Who&apos;s that Pokémon?
        </h2>
        <p className="rounded-full bg-black/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-800">
          Streak {streak} · Best {bestStreak}
        </p>
      </header>

      <figure className="flex flex-col items-center gap-2">
        <span className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-neutral-100 shadow-inner ring-1 ring-neutral-900/10 sm:h-44 sm:w-44">
          <PokemonArtwork
            key={round.answer.id}
            id={round.answer.id}
            name={answerName}
            isRevealed={isRevealed}
          />
        </span>
        <figcaption className="text-sm font-black uppercase tracking-widest text-pokedex-screen-dark">
          {isRevealed ? answerName : 'Mystery Pokémon'}
        </figcaption>
      </figure>

      <fieldset disabled={isRevealed} className="min-w-0">
        <legend className="sr-only">Choose the Pokémon</legend>
        <ul className="grid grid-cols-2 gap-2">
          {round.options.map((option) => {
            const isChosen = option === guess
            const isAnswer = option === round.answer.name
            let optionClass =
              'border-neutral-900/20 bg-black/10 text-neutral-900 hover:bg-black/20'

            if (isRevealed && isAnswer) {
              optionClass = 'border-green-900/30 bg-green-600 text-white'
            } else if (isRevealed && isChosen) {
              optionClass = 'border-red-900/30 bg-red-600 text-white'
            } else if (isRevealed) {
              optionClass =
                'border-neutral-900/10 bg-black/5 text-neutral-700 opacity-60'
            }

            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleGuess(option)}
                  className={`w-full rounded-xl border px-3 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-default ${optionClass}`}
                >
                  {titleCase(option)}
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <p
        role="status"
        aria-live="polite"
        className={`text-sm font-semibold ${
          isRevealed
            ? isCorrect
              ? 'text-green-800'
              : 'text-red-800'
            : 'text-pokedex-screen-dark'
        }`}
      >
        {feedback}
      </p>

      {isRevealed && (
        <button
          ref={nextButtonRef}
          type="button"
          onClick={handleNext}
          className="mt-auto rounded-xl bg-pokedex-screen-dark px-4 py-3 text-sm font-bold text-pokedex-screen transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pokedex-screen-dark focus-visible:ring-offset-2 focus-visible:ring-offset-pokedex-screen"
        >
          Next Pokémon
        </button>
      )}
    </section>
  )
}
