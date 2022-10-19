// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    ['@unocss/nuxt', {
      uno: true,
    }],
    '@vueuse/nuxt',
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/minecraft.scss',
    '~/assets/css/global.css',
  ],
  ssr: false,
  experimental: {
    reactivityTransform: true,
  },
})
