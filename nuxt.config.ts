// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  future: {
    compatibilityVersion: 4,
  },
  prisma: {
    runMigration: false,
  },
  runtimeConfig: {
    adminUser: undefined,
    adminPassword: undefined,
  },
  nitro: {
    imports: {
      dirs: ["server/lib/**/*.ts"],
    },
    experimental: {
      openAPI: true,
    },
  },
  experimental: {
    typedPages: true,
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  css: ["~/assets/css/main.css"],
  pwa: {
    manifest: {},
  },
  modules: [
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@prisma/nuxt",
    "@vite-pwa/nuxt",
    "nuxt-time",
    "dayjs-nuxt",
  ],
})
