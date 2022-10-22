const HOST = location.host

let server = $ref(HOST.endsWith('.nyaa.cat') ? 'nyaa' : 'kedama')
let query = $ref('')
let data = $ref<any[] | null>(null)
let querying = $ref(false)

async function submit (queryInit?: string) {
  if (queryInit) {
    query = queryInit
  }

  querying = true
  data = null
  data = await $fetch(`/api/query/${server}`, { method: 'POST', body: query }).catch(() => {})
  querying = false
}

export default function useRanking () {
  return {
    server: $$(server),
    query: $$(query),
    querying: $$(querying),
    data: $$(data),
    submit,
  }
}
