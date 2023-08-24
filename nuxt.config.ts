// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: process.env.NODE_ENV !== 'development',
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || ''
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          // Google Fonts
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Noto+Serif+SC:600&display=swap'
        }
        // {
        //   rel: 'stylesheet',
        //   href: 'https://fastly.jsdelivr.net/npm/css-spaces@latest/dist/spaces.min.css'
        // }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  css: [
    '~/node_modules/modern-normalize/modern-normalize.css', // CSS reset
    '~/assets/scss/main.scss'
  ],
  modules: [
    '@unocss/nuxt',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // PWA
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-gtag',
    '@ant-design-vue/nuxt',
    '@vant/nuxt', // 偷一点 Vant 的组件，改善移动端体验
    [
      'unplugin-icons/nuxt',
      {
        /* options */
      }
    ],
    '@vueuse/nuxt'
  ],
  antd: {},
  gtag: {
    id: 'G-86GDBEXXNZ'
  },

  imports: {
    dirs: ['./stores']
  },

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },

  devtools: { enabled: true },
  components: true,
  runtimeConfig: {
    public: {
      endpoint: {
        commonAPI: process.env.HITOKOTO_COMMON_API_ENDPOINT || '',
        reviewerAPI: process.env.HITOKOTO_REVIEWER_API_ENDPOINT || '',
        searchAPI: process.env.HITOKOTO_SEARCH_API_ENDPOINT || ''
      }
    }
  }
})
