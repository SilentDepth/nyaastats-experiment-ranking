<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'update:ref'])
const modelValue = useVModel(props, 'modelValue', emit)

let textarea = $ref<HTMLTextAreaElement>(null)
whenever($$(textarea), el => emit('update:ref', el))
</script>

<template lang="pug">
div
  div(class="relative")
    div(inert class="whitespace-pre-wrap invisible pointer-events-none") {{ modelValue }}&ZeroWidthSpace;
    textarea(
      ref="textarea"
      v-model="modelValue"
      :placeholder="placeholder"
      class="absolute inset-0 w-full h-full bg-transparent outline-none overflow-hidden resize-none"
    )
</template>

<style scoped>
.debug {
  visibility: visible !important;
  transform: translateX(100%);
  outline: 1px solid #f0f;
  outline-offset: -1px;
}
</style>
