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

function formatNumber (num: number): string {
  return String(Math.round(num)).replaceAll(/(\d)(?=(?:\d{3})+(\.|$))/g, '$1,')
}
</script>

<template lang="pug">
div(class="")
  ol.mc-box(class="bg-white dark:bg-neutral-800 overflow-hidden divide-y-2 divide-black/20 dark:divide-black/40")
    li(v-for="(it, idx) of data || 20" class="relative h-10 px-3 flex items-center")
      template(v-if="data")
        span(class="relative z-1 flex-none w-7 text-stone-400 dark:text-neutral-500 text-sm") {{ idx + 1 }}
        span(class="relative z-1 mr-3") {{ it.name || it.uuid }}
        span(class="relative z-1 ml-auto text-stone-600 dark:text-neutral-400 tabular-nums") {{ formatNumber(it.value) }}
        span(class="absolute right-0 inset-y-0 z-0 bg-stone-100 dark:bg-neutral-700/50" :style="{ width: it.value / total * 100 + '%' }")
    li(v-if="data?.length === 0" class="h-10 px-3 text-stone-400 dark:text-neutral-500 flex justify-center items-center") NO DATA
</template>
