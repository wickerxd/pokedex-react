export type PokedexMode = 'pokedex' | 'game'

export function modeTabId(mode: PokedexMode): string {
  return `mode-tab-${mode}`
}

export function modePanelId(mode: PokedexMode): string {
  return `mode-panel-${mode}`
}
