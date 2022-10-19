<script lang="ts" setup>
useDark()

const { title, defaultTitle, queryCode, ranking } = useRanking()
</script>

<template lang="pug">
div(class="min-h-screen bg-stone-200 dark:bg-black dark:text-stone-200 grid place-content-center md:grid-flow-col")
  TheForm
  TheList(:title="title || defaultTitle" :description="queryCode" :data="ranking" style="width: 400px;")
</template>
