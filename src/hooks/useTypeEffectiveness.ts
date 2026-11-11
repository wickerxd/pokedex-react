import { useQueries } from '@tanstack/react-query'
import { getType } from '../api/pokeapi'

export interface TypeEffectivenessGroup {
  multiplier: number
  types: string[]
}

export function useTypeEffectiveness(defendingTypes: string[]) {
  const queries = useQueries({
    queries: defendingTypes.map((type) => ({
      queryKey: ['type', type],
      queryFn: ({ signal }) => getType(type, signal),
      staleTime: Infinity,
    })),
  })

  const multipliers = new Map<string, number>()

  for (const query of queries) {
    const relations = query.data?.damage_relations

    if (!relations) {
      continue
    }

    for (const { name } of relations.double_damage_from) {
      multipliers.set(name, (multipliers.get(name) ?? 1) * 2)
    }

    for (const { name } of relations.half_damage_from) {
      multipliers.set(name, (multipliers.get(name) ?? 1) * 0.5)
    }

    for (const { name } of relations.no_damage_from) {
      multipliers.set(name, 0)
    }
  }

  const groupsByMultiplier = new Map<number, string[]>()

  for (const [type, multiplier] of multipliers) {
    if (multiplier === 1) {
      continue
    }

    const group = groupsByMultiplier.get(multiplier) ?? []
    group.push(type)
    groupsByMultiplier.set(multiplier, group)
  }

  const groups: TypeEffectivenessGroup[] = [...groupsByMultiplier.entries()]
    .sort(([left], [right]) => right - left)
    .map(([multiplier, types]) => ({
      multiplier,
      types: [...types].sort(),
    }))

  return {
    groups,
    isPending: queries.some((query) => query.isPending),
    isError: queries.some((query) => query.isError),
  }
}
