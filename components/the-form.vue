<script lang="ts" setup>
import { TYPE_OPTIONS, type RankingParams } from '~/composables/use-ranking'

const rankingStore = useRanking()
const { params, querying, query, defaultTitle } = $(rankingStore)
let { title } = $(rankingStore)

interface Advice {
  title: string
  params: Partial<RankingParams>
  contributor?: string
}

const advices: Advice[] = [
  {
    title: '边界即为极限',
    params: { type: 'custom', target: 'aviate_one_cm' }
  },
  {
    title: '游牧民族',
    params: { type: 'custom', target: 'horse_one_cm' },
  },
  {
    title: '捕鱼达人',
    params: { type: 'custom', target: 'fish_caught' },
  },
  {
    title: '好死不如赖活着',
    params: { type: 'custom', target: 'time_since_death' },
    contributor: 'Akyuu',
  },
  {
    title: '真的勇者敢于生吞河豚',
    params: { type: 'used', target: 'pufferfish' },
    contributor: 'Aqua_Ruri',
  },
  {
    title: '吃多了会发光哦',
    params: { type: 'used', target: 'glow_berries' },
    contributor: 'Rimo',
  },
]

function applyAdvice (advice: Advice) {
  title = advice.title
  query(advice.params)
}
</script>

<template lang="pug">
form(class="md:w-[300px] p-5 flex flex-col space-y-10" @submit.prevent="query()")
  h1(class="dark:text-white text-xl font-bold") 玩家数据榜单
  label(class="relative flex flex-col")
    span(class="absolute bottom-full mb-1") 玩家服务器
    select(v-model="params.server" class="mc-input px-1 py-2 outline-none")
      option(value="kedama" :selected="params.server === 'kedama'") 毛线
      option(value="nyaa" :selected="params.server === 'nyaa'") 喵窝
  label(class="relative flex flex-col")
    span(class="absolute bottom-full mb-1") 指标类型
    select(v-model="params.type" class="mc-input px-1 py-2 outline-none")
      option(v-for="(label, value) of TYPE_OPTIONS" :value="value") {{ label }}
  label(class="relative flex flex-col")
    span(class="absolute bottom-full mb-1") 排行指标
    input(v-model="params.target" type="text" class="mc-input px-2 py-1.5 outline-none")
  label(class="relative flex flex-col")
    span(class="absolute bottom-full mb-1") 榜单标题
    input(v-model="title" type="text" :placeholder="defaultTitle" class="mc-input px-2 py-1.5 outline-none")
  Button.primary(type="submit" :disabled="querying") {{ querying ? 'LOADING' : '查询' }}

  section
    h2(class="mb-2 text-sm text-stone-600 dark:text-neutral-400 font-bold") 一些有趣的榜单
    ul
      li(v-for="it of advices")
        a(href="javascript:" class="text-[#337121] dark:text-[#4ba032] hover:underline hover:underline-offset-3" @click="applyAdvice(it)") {{ it.title }}
        span(v-if="it.contributor" class="text-stone-500 dark:text-neutral-400 text-sm") &nbsp;by {{ it.contributor }}
</template>
