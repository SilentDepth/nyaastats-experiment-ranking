// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    ['@unocss/nuxt', {
      uno: true,
    }],
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/minecraft.scss',
  ],
})
