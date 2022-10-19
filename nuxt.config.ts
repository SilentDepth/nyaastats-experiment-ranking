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
  app: {
    head: {
      title: 'NyaaStats Ranking Service',
      link: [
        { rel: 'shortcut icon', type: 'image/png', href: './favicon.png' },
      ],
    },
  },
  experimental: {
    reactivityTransform: true,
    writeEarlyHints: false,
  },
})
