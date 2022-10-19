<script lang="ts" setup>
import { TYPE_OPTIONS } from '~/composables/use-ranking'

const rankingStore = useRanking()
const { params, querying, query, defaultTitle } = $(rankingStore)
let { title } = $(rankingStore)
</script>

<template lang="pug">
// guess `w-full` is redundant
form(class="w-full md:w-[300px] p-5 flex flex-col space-y-3" @submit.prevent="query()")
  h1(class="dark:text-white text-xl font-bold") 玩家数据榜单
  label(class="flex flex-col")
    span(class="mb-1") 玩家服务器
    select(v-model="params.server" class="mc-input px-1 py-2 outline-none")
      option(value="kedama" :selected="params.server === 'kedama'") 毛线
      option(value="nyaa" :selected="params.server === 'nyaa'") 喵窝
  label(class="flex flex-col")
    span(class="mb-1") 指标类型
    select(v-model="params.type" class="mc-input px-1 py-2 outline-none")
      option(v-for="(label, value) of TYPE_OPTIONS" :value="value") {{ label }}
  label(class="flex flex-col")
    span(class="mb-1") 排行指标
    input(v-model="params.target" type="text" class="mc-input px-2 py-1.5 outline-none")
  label(class="flex flex-col")
    span(class="mb-1") 榜单标题
    input(v-model="title" type="text" :placeholder="defaultTitle" class="mc-input px-2 py-1.5 outline-none")
  Button.primary(type="submit" :disabled="querying" class="!mt-10") {{ querying ? 'LOADING' : '查询' }}
</template>
