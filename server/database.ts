import fs from 'node:fs'
import path from 'node:path'
import Loki from 'lokijs'
import destr from 'destr'
import { parse, simplify } from 'prismarine-nbt'
import chokidar from 'chokidar'

import config from './config'

const { servers } = config

const databases = {}

for (const [server, dir] of Object.entries<string>(servers)) {
  databases[server] = initDatabase(server, dir)
}

function initDatabase (name: string, dir: string): { db: Loki, ready: Promise<void> } {
  const _start = Date.now()

  const db = new Loki(name)
  const ready = new Promise<void>(async done => {
    // banned players

    function readBannedUuids (): any[] {
      const data = destr(fs.readFileSync(path.join(dir, 'banned-players.json'), 'utf-8'))
      if (Array.isArray(data)) {
        return data.map(it => it.uuid)
      } else {
        return []
      }
    }

    const banned = new Set(readBannedUuids())

    // players

    const players = db.addCollection<any>('players', { indices: ['uuid'] })
    const addPlayer = async (file: string) => {
      const uuid = path.basename(file, '.dat')
      if (banned.has(uuid)) return
      const data = await readNBT(file)
      players.insert({
        uuid,
        data: {
          name: data.bukkit?.lastKnownName ?? null,
        },
      })
    }
    const updatePlayer = async (file: string) => {
      const uuid = path.basename(file, '.dat')
      if (banned.has(uuid)) return
      const data = await readNBT(file)
      players.findAndUpdate({ uuid }, obj => {
        obj.data = {
          name: data.bukkit?.lastKnownName ?? null,
        }
      })
    }
    const removePlayer = (file: string) => {
      const uuid = path.basename(file, '.dat')
      players.findAndRemove({ uuid })
    }
    for (const f of fs.readdirSync(path.join(dir, 'playerdata')).filter(f => f.endsWith('.dat'))) {
      const file = path.join(dir, 'playerdata', f)
      await addPlayer(file)
    }
    if (!process.env.NYAASTATS_NO_WATCH) {
      chokidar.watch(path.join(dir, 'playerdata'), { ignoreInitial: true })
        .on('add', file => addPlayer(file))
        .on('change', file => updatePlayer(file))
        .on('unlink', file => removePlayer(file))
      chokidar.watch(path.join(dir, 'banned-players.json'), { ignoreInitial: true })
        .on('change', () => {
          const newList = readBannedUuids()
          const oldList = [...banned.values()]
          for (const uuid of newList.filter(uuid => !oldList.includes(uuid))) {
            removePlayer(path.join(dir, `playerdata/${uuid}.dat`))
            banned.add(uuid)
          }
          for (const uuid of oldList.filter(uuid => !newList.includes(uuid))) {
            addPlayer(path.join(dir, `playerdata/${uuid}.dat`))
            banned.delete(uuid)
          }
        })
    }

    // stats

    const stats = db.addCollection<any>('stats', { indices: ['uuid'] })
    const addStats = (file: string) => {
      const uuid = path.basename(file, '.json')
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
      stats.insert({
        uuid,
        stats: data.stats ?? {},
      })
    }
    const updateStats = (file: string) => {
      const uuid = path.basename(file, '.json')
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
      stats.findAndUpdate({ uuid }, obj => {
        obj.stats = data.stats ?? {}
      })
    }
    const removeStats = (file: string) => {
      const uuid = path.basename(file, '.json')
      stats.findAndRemove({ uuid })
    }
    for (const f of fs.readdirSync(path.join(dir, 'stats')).filter(f => f.endsWith('.json'))) {
      const file = path.join(dir, 'stats', f)
      addStats(file)
    }
    if (!process.env.NYAASTATS_NO_WATCH) {
      chokidar.watch(path.join(dir, 'stats'), { ignoreInitial: true })
        .on('add', file => addStats(file))
        .on('change', file => updateStats(file))
        .on('unlink', file => removeStats(file))
    }

    console.log(`[${name}] Initialized in ${(Date.now() - _start) / 1000}s (${players.count()} players)`)
    done()
  })

  return { db, ready }
}

async function readNBT (file: string) {
  const { parsed } = await parse(fs.readFileSync(file), 'big')
  return simplify(parsed)
}

export default function useDatabase (): void
export default function useDatabase (server: string): ReturnType<typeof initDatabase>
export default function useDatabase (server?: string): any {
  if (server) {
    return databases[server]
  }
}
