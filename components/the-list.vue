<script lang="ts" setup>
import { type PropType } from 'vue'

defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: null,
  },
})

function formatNumber (num: number): string {
  return String(Math.round(num)).replaceAll(/(\d)(?=(?:\d{3})+(\.|$))/g, '$1,')
}
</script>

<template lang="pug">
div(class="")
  ol.mc-box(class="bg-white dark:bg-neutral-800 overflow-hidden divide-y-2 divide-black/20 dark:divide-black/40")
    li(v-for="(it, idx) of data || 20" class="h-10 px-3 flex items-center")
      template( v-if="data")
        span(class="flex-none w-7 text-stone-400 dark:text-neutral-500 text-sm") {{ idx + 1 }}
        span(class="mr-3") {{ it.name || it.uuid }}
        span(class="ml-auto text-stone-600 dark:text-neutral-400 tabular-nums") {{ formatNumber(it.value) }}
    li(v-if="data?.length === 0" class="h-10 px-3 text-stone-400 dark:text-neutral-500 flex justify-center items-center") NO DATA
</template>
