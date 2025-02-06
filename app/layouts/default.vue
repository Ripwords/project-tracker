<script setup lang="ts">
const { loggedIn } = useUserSession()

const items = [
  [
    {
      label: "Home",
      icon: "i-heroicons-home",
      to: "/",
    },
  ],
  [
    {
      label: "Logout",
      icon: "line-md:log-out",
      to: "/auth/logout",
      external: true,
    },
  ],
]
</script>

<template>
  <div>
    <UNavigationMenu
      v-if="loggedIn"
      :items
      class="px-3"
    />
    <slot />
  </div>
</template>
