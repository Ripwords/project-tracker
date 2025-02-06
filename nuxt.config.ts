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
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "nuxt-auth-utils", "@prisma/nuxt"],
})
