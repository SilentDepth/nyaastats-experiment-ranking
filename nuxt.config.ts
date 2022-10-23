import transformerDirective from '@unocss/transformer-directives'

export default defineNuxtConfig({
  modules: [
    ['@unocss/nuxt', {
      uno: true,
      transformers: [
        transformerDirective(),
      ],
    }],
    '@vueuse/nuxt',
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/minecraft.scss',
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
