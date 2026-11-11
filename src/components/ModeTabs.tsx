import type { KeyboardEvent } from 'react'
import {
  modePanelId,
  modeTabId,
  type PokedexMode,
} from '../lib/modes'

interface ModeTabsProps {
  activeMode: PokedexMode
  onChange: (mode: PokedexMode) => void
}

const TABS: { id: PokedexMode; label: string }[] = [
  { id: 'pokedex', label: 'Pokédex' },
  { id: 'game', label: "Who's That Pokémon?" },
]

export function ModeTabs({ activeMode, onChange }: ModeTabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeMode)
    let nextIndex: number

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextTab = TABS[nextIndex]
    onChange(nextTab.id)
    document.getElementById(modeTabId(nextTab.id))?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Pokédex modes"
      onKeyDown={handleKeyDown}
      className="flex flex-wrap gap-2 border-t border-black/10 bg-pokedex-red-dark px-3 py-3 sm:px-4"
    >
      {TABS.map((tab) => {
        const isActive = activeMode === tab.id

        return (
          <button
            key={tab.id}
            id={modeTabId(tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={modePanelId(tab.id)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-[0.65rem] font-black uppercase tracking-widest transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-xs ${
              isActive
                ? 'bg-white text-pokedex-red-dark shadow'
                : 'text-white/70 hover:bg-black/20 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
