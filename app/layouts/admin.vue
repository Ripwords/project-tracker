<script lang="ts" setup>
const { loggedIn, user } = useUserSession()

const items = ref([
  [
    {
      label: "Home",
      icon: "i-heroicons-home",
      to: "/",
    },
    {
      label: "Users",
      icon: "i-heroicons-user",
      to: "/admin/users",
    },
    {
      label: "Projects",
      icon: "i-heroicons-building-office",
      to: "/admin/projects",
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
])
</script>

<template>
  <div>
    <UNavigationMenu
      v-if="loggedIn && user?.isAdmin"
      :items
      class="px-3"
    />
    <slot />
  </div>
</template>
