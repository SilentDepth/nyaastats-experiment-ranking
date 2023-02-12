<script lang="ts" setup>
useDark()
const isLargeScreen = useMediaQuery('(min-width: 768px)')

let urlConfig = $(useUrlConfig())

const rankingStore = useRanking()
const { querying, data, total, submit } = $(rankingStore)
let { server, query } = $(rankingStore)
if (urlConfig.query) {
  query = urlConfig.query
  if (urlConfig.server) {
    server = urlConfig.server
  }
  submit()
}

const hotkey = navigator.platform.startsWith('Mac') ? '⌘⏎' : 'Ctrl-Enter'

const DEFAULT_TITLE = '玩家数据榜单'
let title = $ref(urlConfig.title || DEFAULT_TITLE)

watch([$$(server), $$(query), $$(title)], () => {
  urlConfig = {
    title: title === DEFAULT_TITLE ? undefined : title,
    server,
    query,
  }
})

const { data: advices, pending: loadingAdvices } = useAdvices()

function applyAdvice (advice: Advice) {
  title = advice.title
  submit(advice.query)
}
</script>

<template lang="pug">
div(class="min-h-screen bg-stone-200 dark:bg-black dark:text-stone-200 flex flex-col items-center")
  main(class="my-10 w-screen md:w-auto max-w-[400px] md:max-w-unset p-3 md:flex md:flex-row")
    section(class="md:flex-1 md:max-w-[300px] mb-5 md:mb-0 md:mr-5")
      details(:open="isLargeScreen" class="space-y-3")
        summary(class="list-none flex")
          h1(class="text-stone-600 dark:text-neutral-500 text-xl") 使用说明
          svg(viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="ml-auto w-6 h-6 md:hidden")
            path(d="M8.25 9L12 5.25 15.75 9")
            path(d="M8.25 15L12 18.75 15.75 15")
        ol.custom-counter(class="list-inside dark:text-neutral-300 text-sm space-y-2")
          li 点击标题可编辑
            p(class="pl-5 pt-1") 可回车换行
          li 查询表达式支持以下用法
            ul(class="pl-5 pt-1 space-y-1")
              li
                code(class="text-xs") crafted.glass
                br
                | 单指标查询
              li
                code(class="text-xs") crafted.glass - used.glass
                br
                | 四则运算
              li
                code(class="text-xs") crafted.$('*_glass')
                br
                | 指标匹配
          li 指标名即游戏统计项的简略写法，即
            p(class="pl-5 pt-1") <code>minecraft:used/minecraft:glass</code><br>↓<br><code>used.glass</code>
          li 拖动榜单底边可调整榜单行数
            p(class="pl-5 pt-1") 最少 1 行，最多 20 行
          li 试一试这些有趣的榜单
            ul(class="pl-5 pt-2 space-y-2")
              li(v-if="loadingAdvices")
                span(class="ml-0.5 inline-block w-[0.8em] h-[0.8em] bg-current animate-spin")
              li(v-for="it of advices")
                a(href="javascript:" class="text-[#337121] dark:text-[#4ba032] hover:underline hover:underline-offset-3" @click="applyAdvice(it)") {{ it.title }}
                span(v-if="it.contributor" class="text-stone-500 dark:text-neutral-400 text-xs") &nbsp;by {{ it.contributor }}
      div(class="flex")
    section(class="md:flex-none box-content md:w-[400px] p-3 -m-3 space-y-3")
      div(class="relative")
        AdaptiveInput(v-model="title" class="text-xl")
        //- span(class="absolute left-full top-0 ml-6 mc-input px-0 dark:bg-transparent border-0 text-stone-600 dark:text-neutral-300 text-xl whitespace-nowrap flex items-center")
          | &ZeroWidthSpace;
          span(class="text-sm") ← 单击编辑标题
      div(class="relative")
        QueryEditor(v-model="query" placeholder="查询表达式" @submit="submit()")
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
      TheList(:data="data" :total="total")
  footer(class="mt-auto p-3")
    a(href="https://github.com/SilentDepth/nyaastats-experiment-ranking" target="_blank")
      svg(viewBox="0 0 24 24" class="w-6 h-6 fill-stone-600 dark:fill-neutral-400 hover:fill-stone-800 dark:hover:fill-neutral-300")
        path(d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z")
</template>

<style lang="scss" scoped>
@import url(https://rsms.me/inter/inter.css);

main {
  font-family: Inter, -apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif;
}

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
