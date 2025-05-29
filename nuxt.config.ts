// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  ssr: false,
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // 私有配置（仅在服务器端可用）
    appwrite: {
      apiKey: process.env.APPWRITE_API_KEY || ''
    },
    // 公共配置（客户端和服务器端都可用）
    public: {
      appwrite: {
        endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
        projectId: process.env.APPWRITE_PROJECT_ID || ''
      }
    }
  }
})
