import fs from 'node:fs'
import path from 'node:path'
import destr from 'destr'

const config = destr(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf-8'))

export default config
