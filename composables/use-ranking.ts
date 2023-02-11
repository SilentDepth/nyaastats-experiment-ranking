const HOST = location.host

let server = $ref(HOST.endsWith('.nyaa.cat') ? 'nyaa' : 'kedama')
let query = $ref('')
let list = $ref<any[] | null>(null)
let total = $ref<number>()
let querying = $ref(false)

async function submit (queryInit?: string) {
  if (queryInit) {
    query = queryInit
  }

  querying = true
  list = null
  total = 0
  ;({ list, total } = await $fetch(`/api/query/${server}`, { method: 'POST', body: query }).catch(() => ({} as any)))
  querying = false
}

export default function useRanking () {
  return {
    server: $$(server),
    query: $$(query),
    querying: $$(querying),
    data: $$(list),
    total: $$(total),
    submit,
  }
}
