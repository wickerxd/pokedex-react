import type { ReactNode } from 'react'
import { PokeballIcon } from './PokeballIcon'

interface PokedexShellProps {
  tabs: ReactNode
  screen: ReactNode
  controls: ReactNode
  panel?: ReactNode
  panelHidden?: boolean
}

export function PokedexShell({
  tabs,
  screen,
  controls,
  panel,
  panelHidden = false,
}: PokedexShellProps) {
  return (
    <section
      aria-labelledby="pokedex-title"
      className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-4xl bg-pokedex-red shadow-2xl shadow-black/60 ring-1 ring-black/20"
    >
      <header className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white/80 bg-sky-200 shadow-inner sm:h-14 sm:w-14"
        >
          <span className="h-6 w-6 rounded-full bg-sky-500 shadow-inner sm:h-7 sm:w-7" />
        </span>
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-black/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 ring-1 ring-black/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 ring-1 ring-black/20" />
        </span>
        <h1
          id="pokedex-title"
          className="ml-auto text-lg font-black uppercase tracking-[0.2em] text-white sm:text-xl"
        >
          Pokédex
        </h1>
      </header>

      {tabs}

      <div className="mx-3 mb-3 grid gap-3 sm:mx-4 sm:mb-4 sm:grid-cols-[minmax(0,1fr)_11rem] lg:grid-cols-[minmax(0,1fr)_12rem]">
        <section
          aria-label="Pokémon display"
          className="rounded-2xl bg-pokedex-red-dark p-2.5 shadow-inner sm:p-4"
        >
          <div className="screen-scanlines relative min-h-88 overflow-hidden rounded-xl bg-pokedex-screen p-3 sm:h-[30rem] sm:p-5 lg:h-[32rem]">
            {screen}
          </div>
        </section>

        <aside
          aria-label="Pokédex controls"
          className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-pokedex-red-dark p-3 sm:p-4"
        >
          {controls}

          <div aria-hidden="true" className="grid grid-cols-3 gap-1">
            <span />
            <span className="h-6 w-6 rounded-md bg-neutral-900/80 shadow-inner" />
            <span />
            <span className="h-6 w-6 rounded-md bg-neutral-900/80 shadow-inner" />
            <span className="h-6 w-6 rounded-md bg-neutral-900/80 shadow-inner" />
            <span className="h-6 w-6 rounded-md bg-neutral-900/80 shadow-inner" />
            <span />
            <span className="h-6 w-6 rounded-md bg-neutral-900/80 shadow-inner" />
            <span />
          </div>

          <div aria-hidden="true" className="flex items-center gap-2">
            <PokeballIcon className="h-5 w-5 opacity-80" />
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60">
              Model K-19
            </p>
          </div>
        </aside>
      </div>

      {panel && (
        <section
          aria-label="Pokédex tools"
          hidden={panelHidden}
          className="flex flex-col gap-4 border-t border-black/10 bg-pokedex-red-dark px-3 py-4 sm:px-4"
        >
          {panel}
        </section>
      )}

      <footer
        aria-hidden="true"
        className="flex items-center justify-center gap-1.5 bg-pokedex-red-dark pb-4"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="h-1.5 w-8 rounded-full bg-black/20" />
        ))}
      </footer>
    </section>
  )
}
