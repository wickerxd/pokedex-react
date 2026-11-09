import { useId, useMemo, useRef, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePokemonNames } from '../hooks/usePokemonNames'
import { titleCase } from '../lib/pokemon'

const MIN_QUERY_LENGTH = 3
const MAX_RESULTS = 50

interface SearchComboboxProps {
  onSelect: (name: string) => void
  onClear: () => void
}

export function SearchCombobox({ onSelect, onClear }: SearchComboboxProps) {
  const inputId = useId()
  const hintId = useId()
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debouncedQuery = useDebouncedValue(
    inputValue.trim().toLowerCase(),
    150,
  )
  const {
    data: pokemonNames = [],
    isPending,
    isError,
  } = usePokemonNames()

  const results = useMemo(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      return []
    }

    return pokemonNames
      .filter((name) => name.startsWith(debouncedQuery))
      .slice(0, MAX_RESULTS)
  }, [debouncedQuery, pokemonNames])

  const normalizedQuery = inputValue.trim().toLowerCase()
  const showSuggestions =
    isOpen && inputValue.trim().length >= MIN_QUERY_LENGTH
  const isQuerySettled = normalizedQuery === debouncedQuery
  const optionId = (index: number) => `${listboxId}-option-${index}`

  function selectPokemon(name: string) {
    setInputValue(titleCase(name))
    setActiveIndex(-1)
    setIsOpen(false)
    onSelect(name)
  }

  function handleChange(value: string) {
    setInputValue(value)
    setActiveIndex(-1)
    setIsOpen(true)
  }

  function handleClear() {
    setInputValue('')
    setActiveIndex(-1)
    setIsOpen(false)
    onClear()
    inputRef.current?.focus()
  }

  function handleBlur(event: React.FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)

      if (results.length > 0) {
        setActiveIndex((index) => (index + 1) % results.length)
      }

      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)

      if (results.length > 0) {
        setActiveIndex((index) =>
          index <= 0 ? results.length - 1 : index - 1,
        )
      }

      return
    }

    if (event.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault()
        selectPokemon(results[activeIndex])
      }
    }
  }

  return (
    <form
      role="search"
      onBlur={handleBlur}
      onSubmit={(event) => event.preventDefault()}
      className="flex w-full flex-col gap-2"
    >
      <label htmlFor={inputId} className="text-sm font-medium text-white/80">
        Pokémon name
      </label>
      <p id={hintId} className="text-xs text-white/60">
        Type at least 3 letters, then choose a suggestion.
      </p>

      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls={listboxId}
          aria-describedby={hintId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          autoComplete="off"
          spellCheck={false}
          placeholder="Type at least 3 letters…"
          value={inputValue}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 pr-20 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-pokedex-red focus:outline-none focus:ring-2 focus:ring-pokedex-red/40"
        />

        {inputValue.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pokedex-red"
          >
            Clear
          </button>
        )}
      </div>

      {showSuggestions && isPending && (
        <p role="status" className="text-sm text-neutral-400">
          Loading Pokémon…
        </p>
      )}

      {showSuggestions && isError && (
        <p role="alert" className="text-sm text-red-400">
          Could not load the Pokémon list. Please try again.
        </p>
      )}

      {showSuggestions &&
        !isPending &&
        !isError &&
        isQuerySettled &&
        results.length === 0 && (
          <p role="status" className="text-sm text-neutral-400">
            No Pokémon found.
          </p>
        )}

      {showSuggestions &&
        !isPending &&
        !isError &&
        results.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Pokémon suggestions"
            className="max-h-60 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 py-1 shadow-lg"
          >
            {results.map((name, index) => (
              <li
                key={name}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                onPointerDown={(event) => {
                  event.preventDefault()
                  selectPokemon(name)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`cursor-pointer px-4 py-2 text-sm transition ${
                  index === activeIndex
                    ? 'bg-pokedex-red/20 text-white'
                    : 'text-neutral-300'
                }`}
              >
                {titleCase(name)}
              </li>
            ))}
          </ul>
        )}
    </form>
  )
}
