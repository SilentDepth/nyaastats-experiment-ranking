<script lang="ts" setup>
useDark()

const host = useRequestHeaders(['host']).host ?? location.host

const form = reactive({
  server: host.endsWith('.nyaa.cat') ? 'nyaa' : 'kedama',
  type: 'mined',
  target: '',
})
const PLACEHOLDER_RANKING = Array.from({ length: 20 })
const ranking = ref<any[]>(PLACEHOLDER_RANKING)

async function query () {
  ranking.value = null
  ranking.value = await $fetch(`/api/ranking/${form.server}/${form.type}/${form.target}`)
}

const TYPE_OPTIONS = {
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
const title = ref(null)
const defaultTitle = computed(() => {
  if (form.target) {
    return [
      form.target.endsWith('$') ? '各种' : '',
      ` ${form.target.replace(/\$$/, '')} `,
      form.type === 'custom' ? '' : `${TYPE_OPTIONS[form.type]}`,
      '排行',
    ].join('').replaceAll(/\s{2,}/g, ' ').trim()
  }
})
const queryCode = computed(() => {
  if (form.target) {
    return [
      form.server,
      '/',
      `minecraft:${form.type}`,
      '/',
      `minecraft:${form.target.endsWith('$') ? `*${form.target.slice(0, -1)}` : form.target}`,
    ].join('')
  }
})

watch(form, () => {
  ranking.value = PLACEHOLDER_RANKING
})
</script>

<template>
  <div class="min-h-screen bg-stone-200 dark:bg-black dark:text-stone-200 grid place-content-center md:grid-flow-col">
    <form class="w-full md:w-[300px] p-5 flex flex-col space-y-3" @submit.prevent="query">
      <h1 class="dark:text-white text-xl font-bold">玩家数据榜单</h1>
      <label class="flex flex-col">
        <span class="mb-1">玩家服务器</span>
        <select v-model="form.server" class="mc-input px-1 py-2 outline-none">
          <option value="kedama" :selected="form.server === 'kedama'">毛线</option>
          <option value="nyaa" :selected="form.server === 'nyaa'">喵窝</option>
        </select>
      </label>
      <label class="flex flex-col">
        <span class="mb-1">指标类型</span>
        <select v-model="form.type" class="mc-input px-1 py-2 outline-none">
          <option v-for="(label, value) of TYPE_OPTIONS" :value="value">{{ label }}</option>
        </select>
      </label>
      <label class="flex flex-col">
        <span class="mb-1">排行指标</span>
        <input v-model="form.target" type="text" class="mc-input px-2 py-1.5 outline-none">
      </label>
      <label class="flex flex-col">
        <span class="mb-1">榜单标题</span>
        <input v-model="title" type="text" :placeholder="defaultTitle" class="mc-input px-2 py-1.5 outline-none">
      </label>
      <Button type="submit" :disabled="ranking == null" class="primary !mt-10">{{ ranking == null ? 'LOADING' : '查询' }}</Button>
    </form>

    <div class="p-5" style="width: 400px;">
      <h2 class="mb-3 text-stone-800 dark:text-stone-200 text-xl">&ZeroWidthSpace;{{ title || defaultTitle }}<br>&ZeroWidthSpace;<code class="text-stone-600 dark:text-stone-400 text-xs">{{ queryCode }}</code></h2>
      <ol class="mc-box bg-white dark:bg-neutral-800 overflow-hidden divide-y-2 divide-black/20 dark:divide-black/40">
        <li v-for="(it, idx) of ranking || PLACEHOLDER_RANKING" class="h-10 px-3 flex items-center">
          <template v-if="it">
            <span class="flex-none w-7 text-stone-400 dark:text-neutral-500 text-sm">{{ idx + 1 }}</span>
            <span class="mr-3">{{ it.name }}</span>
            <span class="ml-auto text-stone-600 dark:text-neutral-400 tabular-nums">{{ String(it.value).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</span>
          </template>
        </li>
      </ol>
    </div>
  </div>
</template>
