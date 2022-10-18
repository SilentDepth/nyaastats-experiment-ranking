import useDatabase from "~/server/database"

function fixOverflow (num: number): number {
  const INT_32_MAX = Math.pow(2, 31)
  return num >= 0 ? num : num + INT_32_MAX * 2
}

export default defineEventHandler(async event => {
  const { server, type, target } = event.context.params

  const { db, ready } = useDatabase(server)
  await ready

  const _start = Date.now()

  const players = db.getCollection('players')
  const stats = db.getCollection('stats')
  const data = stats.chain()
    .where(it => Boolean(it.stats[`minecraft:${type}`]))
    .map(it => {
      const name = players.find({ uuid: it.uuid })[0]?.data.name

      let value: number = 0
      if (name) {
        if (target.endsWith('$')) {
          const re = new RegExp(target)
          value = Object.entries<number>(it.stats[`minecraft:${type}`])
            .filter(([key]) => re.test(key.slice('minecraft:'.length)))
            .reduce((total, [, num]) => total + fixOverflow(num), 0)
        } else {
          value = fixOverflow(it.stats[`minecraft:${type}`][`minecraft:${target}`] || 0)
        }
      }

      return { uuid: it.uuid, name, value }
    })
    .where(it => it.value > 0)
    .sort((a, b) => b.value - a.value)
    .limit(20)
    .data()

  setResponseHeader(event, 'X-Server-Timing', `db;dur=${Date.now() - _start}`)

  return data
})
