import { useState } from 'react'
import { FavoritesBar } from './components/FavoritesBar'
import { ModeTabs } from './components/ModeTabs'
import { PokedexShell } from './components/PokedexShell'
import { PokemonScreen } from './components/PokemonScreen'
import { SearchCombobox } from './components/SearchCombobox'
import { ShinyToggle } from './components/ShinyToggle'
import { SurpriseButton } from './components/SurpriseButton'
import { WhoIsThatPokemon } from './components/WhoIsThatPokemon'
import { useFavorites } from './hooks/useFavorites'
import {
  modePanelId,
  modeTabId,
  type PokedexMode,
} from './lib/modes'
import type { Pokemon } from './types/pokemon'

function App() {
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [isShiny, setIsShiny] = useState(false)
  const [activeMode, setActiveMode] = useState<PokedexMode>('pokedex')
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  } = useFavorites()

  function handleSelect(name: string) {
    setSelectedName(name)
    setIsShiny(false)
    setActiveMode('pokedex')
  }

  function handleClear() {
    setSelectedName(null)
    setIsShiny(false)
  }

  function handleToggleFavorite(pokemon: Pokemon) {
    toggleFavorite({ name: pokemon.name, id: pokemon.id })
  }

  const controls =
    activeMode === 'pokedex' ? (
      <ShinyToggle
        isShiny={isShiny}
        disabled={!selectedName}
        onChange={setIsShiny}
      />
    ) : (
      <p className="text-center text-[0.6rem] font-bold uppercase tracking-widest text-white/60">
        Game mode
      </p>
    )

  const panel = (
    <>
      <SearchCombobox onSelect={handleSelect} onClear={handleClear} />
      <SurpriseButton onPick={handleSelect} />
      <FavoritesBar
        favorites={favorites}
        onSelect={handleSelect}
        onRemove={removeFavorite}
        onClear={clearFavorites}
      />
    </>
  )

  const screen = (
    <>
      <section
        role="tabpanel"
        id={modePanelId('pokedex')}
        aria-labelledby={modeTabId('pokedex')}
        hidden={activeMode !== 'pokedex'}
        className="h-full"
      >
        <PokemonScreen
          name={selectedName}
          isShiny={isShiny}
          isFavorite={selectedName ? isFavorite(selectedName) : false}
          onToggleFavorite={handleToggleFavorite}
          onSelect={handleSelect}
        />
      </section>
      <section
        role="tabpanel"
        id={modePanelId('game')}
        aria-labelledby={modeTabId('game')}
        hidden={activeMode !== 'game'}
        className="h-full"
      >
        <WhoIsThatPokemon />
      </section>
    </>
  )

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-3 py-6 sm:px-6 sm:py-10">
      <PokedexShell
        tabs={<ModeTabs activeMode={activeMode} onChange={setActiveMode} />}
        screen={screen}
        controls={controls}
        panel={panel}
        panelHidden={activeMode !== 'pokedex'}
      />
    </main>
  )
}

export default App
