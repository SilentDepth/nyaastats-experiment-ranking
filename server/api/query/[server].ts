import useQuery from '~/server/utils/use-query'
import useDatabase from '~/server/database'

function fixOverflow (num: number): number {
  const INT_32_MAX = Math.pow(2, 31)
  return num >= 0 ? num : num + INT_32_MAX * 2
}

function agent (obj: object, prefix: string) {
  return new Proxy(obj, {
    get (obj, prop) {
      if (prop === '$') {
        return (pattern: string) => {
          const re = new RegExp(`^${pattern.replaceAll('*', '.*')}$`)
          return Object.entries(obj).filter(([key]) => re.test(key)).reduce((total, [, value]) => total + value, 0)
        }
      } else if (typeof prop === 'string') {
        const value = obj[prefix + prop]
        return typeof value === 'object' ? agent(value, prefix) : fixOverflow(value)
      } else {
        return obj[prop]
      }
    },
  })
}

export default defineEventHandler(async event => {
  const { server } = event.context.params as Record<string, string>
  const query = await readRawBody(event) as string

  const _start = Date.now()

  const evaluate = useQuery(query)

  const { db, ready } = useDatabase(server)
  await ready

  const players = db.getCollection('players')
  const stats = db.getCollection('stats')

  const data = stats.chain()
    .map(it => {
      const name = players.find({ uuid: it.uuid })[0]?.data.name

      let value: number = 0
      if (name) {
        value = evaluate(agent(it.stats, 'minecraft:'))
      }

      return { uuid: it.uuid, name, value }
    })
    .where(it => it.value > 0)
    .sort((a, b) => b.value - a.value)
    .limit(20)
    .data()

  setResponseHeader(event, 'X-Server-Timing', `-;dur=${Date.now() - _start}`)
  return data
})
