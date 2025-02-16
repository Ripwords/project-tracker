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
    manifest: {
      icons: [
        {
          src: "public/img/icons/manifest-icon-192.maskable.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "public/img/icons/manifest-icon-192.maskable.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "public/img/icons/manifest-icon-512.maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "public/img/icons/manifest-icon-512.maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
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