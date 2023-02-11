import { Base64 } from 'js-base64'
import destr from 'destr'

let config = $computed({
  get () {
    const encoded = (new URL(location.href)).hash
    const decoded = destr(Base64.decode(encoded || ''))
    return typeof decoded === 'object' ? decoded : {}
  },
  set (value) {
    history.replaceState(null, '', '#' + Base64.encodeURL(JSON.stringify(value)))
  },
})

export default function useUrlConfig () {
  return $$(config)
}
