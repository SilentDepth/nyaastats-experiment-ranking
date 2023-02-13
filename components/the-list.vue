<script lang="ts" setup>
import { type PropType } from 'vue'

defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: null,
  },
  total: {
    type: Number,
    default: 0,
  },
})

function formatNumber (num: number | 'Infinity'): string {
  switch (num) {
    case 'Infinity':
      return '♾️'
    default:
      return String(Math.round(num)).replaceAll(/(\d)(?=(?:\d{3})+(\.|$))/g, '$1,')
  }
}

let $list = $ref<HTMLOListElement>()
let listSize = $ref<number>()

function startResize (ev: PointerEvent) {
  const posList = [...$list!.querySelectorAll('li')].map($li => [$li.offsetTop, $li.offsetTop + $li.offsetHeight])
  let startSize = $list!.offsetHeight
  let startY = ev.screenY

  document.documentElement.style.userSelect = 'none'
  document.addEventListener('touchmove', preventDefault, { passive: false })
  document.addEventListener('pointermove', resizing)
  document.addEventListener('pointerup', stopResize)

  function preventDefault (ev: Event) {
    ev.preventDefault()
  }

  function resizing (ev: PointerEvent) {
    const _size = Math.max(0, startSize + (ev.screenY - startY))
    const idx = posList.findIndex(it => it[0] <= _size && _size <= it[1])
    const [min, max] = posList.at(idx)!
    if (idx === 0) {
      listSize = max
      return
    }
    const med = (min + max) / 2
    listSize = _size < med ? min : max
  }

  function stopResize () {
    document.documentElement.style.userSelect = ''
    document.removeEventListener('touchmove', preventDefault)
    document.removeEventListener('pointermove', resizing)
    document.removeEventListener('pointerup', stopResize)
  }
}
</script>

<template lang="pug">
div(class="relative")
  ol(
    ref="$list"
    class="bg-white dark:bg-neutral-800 overflow-hidden divide-y-2 divide-black/20 dark:divide-black/40"
    :style="{ height: typeof listSize === 'number' ? listSize + 'px' : null }"
  )
    li(v-for="(it, idx) of data || 20" class="relative h-10 px-3 flex items-center")
      template(v-if="data")
        span(class="relative z-1 flex-none w-7 text-stone-400 dark:text-neutral-500 text-sm") {{ idx + 1 }}
        span(class="relative z-1 mr-3") {{ it.name || it.uuid }}
        span(class="relative z-1 ml-auto text-stone-600 dark:text-neutral-400 tabular-nums") {{ formatNumber(it.value) }}
        transition(
          appear
          enter-from-class="w-0!"
          enter-active-class="transition-all duration-500 ease-out"
        )
          span(class="absolute right-0 inset-y-0 z-0 bg-stone-100 dark:bg-neutral-700/50" :style="{ width: it.value / total * 100 + '%' }")
    li(v-if="data?.length === 0" class="h-10 px-3 text-stone-400 dark:text-neutral-500 flex justify-center items-center") NO DATA
  div(class="h-2")
    div(
      class="w-full h-2 absolute bottom-0 inset-x-0 bg-black/25 flex justify-center items-center space-x-1 hover:bg-green-600/75 active:bg-green-600/75 cursor-ns-resize"
      @pointerdown="startResize"
    )
      div(v-for="_ of 3" class="w-[2px] h-[2px] bg-white rounded-full")
</template>
