import fs from 'node:fs'
import path from 'node:path'
import Loki from 'lokijs'
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
    // players

    const players = db.addCollection<any>('players', { indices: ['uuid'] })
    const addPlayer = async (file: string) => {
      const uuid = path.basename(file, '.dat')
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
    if (process.env.NODE_ENV !== 'development') {
      chokidar.watch(path.join(dir, 'playerdata'), { ignoreInitial: true })
        .on('add', file => addPlayer(file))
        .on('change', file => updatePlayer(file))
        .on('unlink', file => removePlayer(file))
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
    if (process.env.NODE_ENV !== 'development') {
      chokidar.watch(path.join(dir, 'stats'), { ignoreInitial: true })
        .on('add', file => addStats(file))
        .on('change', file => updateStats(file))
        .on('unlink', file => removeStats(file))
    }

    console.log(`[${name}] Initialized in ${(Date.now() - _start) / 1000}s`)
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
