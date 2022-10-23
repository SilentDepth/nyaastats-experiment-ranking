<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'submit'])
const modelValue = useVModel(props, 'modelValue', emit)

let input = $ref<HTMLElement>(null)

const { cmd_enter, ctrl_enter } = $(useMagicKeys())
const activeElement = $(useActiveElement())

whenever(() => activeElement as any === input && (cmd_enter || ctrl_enter), () => {
  emit('submit')
})
</script>

<template lang="pug">
AdaptiveInput(
  v-model="modelValue"
  :placeholder="placeholder"
  class="mc-input bg-white text-sm font-mono"
  @update:ref="el => input = el"
)
</template>
