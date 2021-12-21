import { defineNuxtConfig } from '@nuxt/bridge'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default defineNuxtConfig ({
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#61A6FF',
    height: '3px',
  },
  router: {
    middleware: ['auth'],
  },

  /*
   ** Global CSS
   */
  css: [
    'ant-design-vue/dist/antd.css',
    { src: '@/assets/scss/default.scss', lang: 'scss' },
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/antd-ui',
    { src: '@/plugins/cursor-effects', ssr: false },
    { src: '~/plugins/notifications-ssr', mode: 'server' },
    { src: '~/plugins/notifications-client', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-158766433-3',
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    [
      'nuxt-vuex-localstorage',
      {
        localStorage: ['localStorage', 'token'], //  If not entered, “localStorage” is the default value
        sessionStorage: ['sessionStorage'], //  If not entered, “sessionStorage” is the default value
      },
    ],
    'cookie-universal-nuxt',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    loaders: {
      sass: {
        implementation: require('sass'),
      },
    },
    extend(config, ctx) {},
  },
  manifest: {
    name: '一言投票服务',
    short_name: '一言投票',
    description:
      '一言审核员投票模块。在这里，你可以为你喜欢的句子投出赞成票；对自己厌恶的句子投出否决票。公开透明，共同维护。你们是一言前进的动力与榜样，一言有你们更精彩！',
    background_color: '#ebebeb',
    theme_color: '#343a40',
    lang: 'zh',
    start_url: '/',
  },
  render: {
    http2: {
      push: true,
    },
    static: {
      maxAge: '1y',
      setHeaders(res, path) {
        if (path.includes('sw.js')) {
          res.setHeader('Cache-Control', `public, max-age=${15 * 60}`)
        }
      },
    },
    resourceHints: false,
  },
})
