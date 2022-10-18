import fs from 'node:fs'
import path from 'node:path'

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf-8'))

export default config
