<script lang="ts" setup>
const { loggedIn, user } = useUserSession()

const items = computed(() => [
  [
    {
      label: "Home",
      icon: "i-heroicons-home",
      to: "/",
    },
    {
      label: "Home",
      icon: "i-heroicons-home",
      to: "/admin",
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
  ].filter((item) => {
    if (user.value?.isAdmin) {
      return item.to.includes("/admin")
    }
    return !item.to.includes("/admin")
  }),
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
      v-if="loggedIn"
      :items
      class="px-3"
    />
    <slot />
  </div>
</template>
