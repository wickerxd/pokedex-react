import { useState } from 'react'
import { SearchCombobox } from './components/SearchCombobox'

function App() {
  const [selectedName, setSelectedName] = useState<string | null>(null)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-pokedex-red sm:text-4xl">
          Pokédex
        </h1>
        <p className="text-sm text-neutral-400 sm:text-base">
          Search for a Pokémon to begin.
        </p>
      </header>

      <section aria-labelledby="search-heading" className="flex flex-col gap-4">
        <h2
          id="search-heading"
          className="text-lg font-semibold text-neutral-100 sm:text-xl"
        >
          Find a Pokémon
        </h2>
        <SearchCombobox
          selectedName={selectedName}
          onSelect={setSelectedName}
          onClear={() => setSelectedName(null)}
        />
      </section>
    </main>
  )
}

export default App
