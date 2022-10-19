export interface RankingParams {
  server: 'kedama' | 'nyaa'
  type: string
  target: string
}

export const TYPE_OPTIONS = {
  mined: '开采量',
  picked_up: '拾取量',
  dropped: '丢弃量',
  used: '使用量',
  crafted: '合成量',
  broken: '耗尽量',
  killed: '击杀量',
  killed_by: '被杀量',
  custom: '其他',
}

const HOST = location.host

const params = reactive<RankingParams>({
  server: HOST.endsWith('.nyaa.cat') ? 'nyaa' : 'kedama',
  type: 'mined',
  target: '',
})
let ranking = $ref<any[] | null>(null)
let querying = $ref(false)

async function query (paramsInit?: Partial<RankingParams>) {
  Object.assign(params, paramsInit)

  querying = true
  ranking = null
  ranking = await $fetch(`/api/ranking/${params.server}/${params.type}/${params.target}`)
  querying = false
}

let title = $ref('')
const defaultTitle = $computed(() => {
  if (params.target) {
    return [
      params.target.endsWith('$') ? '各种' : '',
      ` ${params.target.replace(/\$$/, '')} `,
      params.type === 'custom' ? '' : `${TYPE_OPTIONS[params.type]}`,
      '排行',
    ].join('').replaceAll(/\s{2,}/g, ' ').trim()
  }
})
const queryCode = $computed(() => {
  if (params.target) {
    return [
      params.server,
      '/',
      `minecraft:${params.type}`,
      '/',
      `minecraft:${params.target.endsWith('$') ? `*${params.target.slice(0, -1)}` : params.target}`,
    ].join('')
  }
})

export default function useRanking () {
  return {
    params,
    ranking: $$(ranking),
    querying: $$(querying),
    query,

    title: $$(title),
    defaultTitle: $$(defaultTitle),
    queryCode: $$(queryCode),
  }
}
