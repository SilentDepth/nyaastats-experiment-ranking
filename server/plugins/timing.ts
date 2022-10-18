import { type NitroApp } from 'nitropack'
import { eventHandler } from 'h3'

export default defineNitroPlugin((nitro: NitroApp) => {
  nitro.h3App.use(eventHandler(event => {
    console.log(event.req.url)
    if (event.res.hasHeader('X-Server-Timing')) {
      console.log(`[timing] ${event.res.getHeader('X-Server-Timing')}`)
      event.res.setHeader('Server-Timing', event.res.getHeader('X-Server-Timing'))
      event.res.removeHeader('X-Server-Timing')
    } else {
      console.log('[timing] No header')
    }
  }))
})
