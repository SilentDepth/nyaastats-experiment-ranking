<script lang="ts" setup>
useDark()

const host = useRequestHeaders(['host']).host ?? location.host

const form = reactive({
  server: host.endsWith('.nyaa.cat') ? 'nyaa' : 'kedama',
  type: 'mined',
  target: '',
})

let ranking = $ref<any[] | null>(null)

watch(form, () => {
  ranking = null
})

let querying = $ref(false)

async function query () {
  querying = true
  ranking = null
  ranking = await $fetch(`/api/ranking/${form.server}/${form.type}/${form.target}`)
  querying = false
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
      <Button type="submit" :disabled="querying" class="primary !mt-10">{{ querying ? 'LOADING' : '查询' }}</Button>
    </form>

    <TheList
      :title="title || defaultTitle"
      :description="queryCode"
      :data="ranking"
      style="width: 400px;"
    />
  </div>
</template>
