import { useState } from 'react'
import { PokedexShell } from './components/PokedexShell'
import { PokemonScreen } from './components/PokemonScreen'
import { SearchCombobox } from './components/SearchCombobox'

function App() {
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [isShiny, setIsShiny] = useState(false)

  function handleSelect(name: string) {
    setSelectedName(name)
    setIsShiny(false)
  }

  function handleClear() {
    setSelectedName(null)
    setIsShiny(false)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-3 py-6 sm:px-6 sm:py-10">
      <PokedexShell
        isShiny={isShiny}
        onShinyChange={setIsShiny}
        shinyDisabled={!selectedName}
        screen={<PokemonScreen name={selectedName} isShiny={isShiny} />}
        search={<SearchCombobox onSelect={handleSelect} onClear={handleClear} />}
      />
    </main>
  )
}

export default App
