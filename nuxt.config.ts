// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image'
  ],

  googleFonts: {
    families: {
      'DM Sans': [400, 500, 600, 700],
    },
    display: 'swap',
  },

  css: [],

  runtimeConfig: {
    public: {
      firebaseApiKey:            process.env.NUXT_PUBLIC_FIREBASE_API_KEY            ?? '',
      firebaseAuthDomain:        process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? '',
      firebaseProjectId:         process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID         ?? '',
      firebaseStorageBucket:     process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
      firebaseAppId:             process.env.NUXT_PUBLIC_FIREBASE_APP_ID             ?? '',
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    // Replace with your actual GitHub repository name
    baseURL: '/<repository-name>/', 
    
    // Changes default '_nuxt' to 'assets' to avoid Jekyll folder removal conflicts
    buildAssetsDir: 'public/assets/', 
  },

  compatibilityDate: '2024-04-03',
})
