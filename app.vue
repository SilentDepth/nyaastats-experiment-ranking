<script lang="ts" setup>
useDark()
const isLargeScreen = useMediaQuery('(min-width: 768px)')

const rankingStore = useRanking()
const { querying, data, submit } = $(rankingStore)
let { server, query } = $(rankingStore)

const hotkey = navigator.platform.startsWith('Mac') ? '⌘⏎' : 'Ctrl-Enter'

let title = $ref('玩家数据榜单')

const { data: advices, pending: loadingAdvices } = useAdvices()

function applyAdvice (advice: Advice) {
  title = advice.title
  submit(advice.query)
}
</script>

<template lang="pug">
div(class="min-h-screen bg-stone-200 dark:bg-black dark:text-stone-200 grid place-content-center")
  main(class="mx-auto w-screen md:w-auto max-w-[400px] md:max-w-unset p-3 md:flex md:flex-row")
    section(class="md:flex-1 md:max-w-[300px] mb-5 md:mb-0 md:mr-5")
      details(:open="isLargeScreen" class="space-y-3")
        summary(class="list-none flex")
          h1(class="text-stone-600 dark:text-neutral-500 text-xl") 使用说明
          svg(viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="ml-auto w-6 h-6 md:hidden")
            path(d="M8.25 9L12 5.25 15.75 9")
            path(d="M8.25 15L12 18.75 15.75 15")
        ol.custom-counter(class="list-inside dark:text-neutral-300 text-sm space-y-3")
          li 点击标题可编辑
          li 查询表达式支持简单的四则运算
          li 暂不支持匹配语法（旧版查询器的 <code>$</code>）
          li 试一试这些有趣的榜单
            ul(class="pl-5 pt-2 space-y-2")
              li(v-if="loadingAdvices")
                span(class="ml-0.5 inline-block w-[0.8em] h-[0.8em] bg-current animate-spin")
              li(v-for="it of advices")
                a(href="javascript:" class="text-[#337121] dark:text-[#4ba032] hover:underline hover:underline-offset-3" @click="applyAdvice(it)") {{ it.title }}
                span(v-if="it.contributor" class="text-stone-500 dark:text-neutral-400 text-sm") &nbsp;by {{ it.contributor }}
      div(class="flex")
    section(class="md:flex-none box-content md:w-[400px] p-3 -m-3 space-y-3")
      div(class="relative")
        AdaptiveInput(v-model="title" class="text-xl")
        //- span(class="absolute left-full top-0 ml-6 mc-input px-0 dark:bg-transparent border-0 text-stone-600 dark:text-neutral-300 text-xl whitespace-nowrap flex items-center")
          | &ZeroWidthSpace;
          span(class="text-sm") ← 单击编辑标题
      div(class="relative")
        QueryEditor(v-model="query" @submit="submit()")
      div(class="text-sm text-stone-600 dark:text-neutral-500 flex items-center")
        label(class="flex items-center")
          span 服务器：
          select(v-model="server" class="bg-transparent outline-none")
            option(value="kedama" :selected="server === 'kedama'") 毛线
            option(value="nyaa" :selected="server === 'nyaa'") 喵窝
        //- span(class="ml-auto") 数据更新日期：0000-00-00
        Button.primary(type="button" :disabled="querying || !query" class="ml-auto w-[128px] text-sm grid place-content-center" @click="submit()")
          template(v-if="querying")
            span(class="inline-block w-[0.8em] h-[0.8em] bg-current animate-spin")
          template(v-else)
            | {{ `查询 (${hotkey})` }}
      TheList(:data="data")
</template>

<style lang="scss" scoped>
ol.custom-counter {
  counter-reset: usageCounter;

  > li {
    counter-increment: usageCounter;

    &::before {
      @apply inline-block w-5;
      content: counters(usageCounter, '') '.';
    }
  }
}
</style>
