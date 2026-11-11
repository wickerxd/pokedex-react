export function pickRandom<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) {
    return undefined
  }

  return items[Math.floor(Math.random() * items.length)]
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swapIndex]
    copy[swapIndex] = current
  }

  return copy
}

export function pickDistinctRandom<T>(
  items: readonly T[],
  count: number,
  exclude: ReadonlySet<T> = new Set(),
): T[] {
  const pool = items.filter((item) => !exclude.has(item))
  return shuffle(pool).slice(0, count)
}
