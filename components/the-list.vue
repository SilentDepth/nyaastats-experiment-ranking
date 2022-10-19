<script lang="ts" setup>
import { type PropType } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  data: {
    type: Array as PropType<any[]>,
    default: null,
  },
})

function formatNumber (num: number): string {
  return String(num).replaceAll(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
</script>

<template lang="pug">
div(class="p-5")
  h2(class="mb-3 text-stone-800 dark:text-stone-200 text-xl keep-lineheight") {{ title }}
  p(class="mb-3 text-stone-600 dark:text-stone-400 text-xs font-mono keep-lineheight") {{ description.replaceAll('/', '/​') }}
  ol.mc-box(class="bg-white dark:bg-neutral-800 overflow-hidden divide-y-2 divide-black/20 dark:divide-black/40")
    li(v-for="(it, idx) of data || 20" class="h-10 px-3 flex items-center")
      template( v-if="data")
        span(class="flex-none w-7 text-stone-400 dark:text-neutral-500 text-sm") {{ idx + 1 }}
        span(class="mr-3") {{ it.name || it.uuid }}
        span(class="ml-auto text-stone-600 dark:text-neutral-400 tabular-nums") {{ formatNumber(it.value) }}
    li(v-if="data?.length === 0" class="h-10 px-3 flex justify-center items-center") NO DATA
</template>
