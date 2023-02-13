type MCStatsType =
  | 'minecraft:mined'
  | 'minecraft:picked_up'
  | 'minecraft:crafted'
  | 'minecraft:used'
  | 'minecraft:broken'
  | 'minecraft:dropped'
  | 'minecraft:killed'
  | 'minecraft:killed_by'
  | 'minecraft:custom'

interface MCStats {
  stats: Record<MCStatsType, Record<string, number>>
  DataVersion: number
}
