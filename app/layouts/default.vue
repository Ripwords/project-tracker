<script lang="ts" setup>
const { loggedIn, user } = useUserSession()
const items = computed(() => {
  if (user.value?.isAdmin) {
    return [
      [
        { label: "Dashboard", icon: "i-heroicons-home", to: "/admin" },
        { label: "Users", icon: "i-heroicons-user", to: "/admin/users" },
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
    ]
  } else {
    return [
      [
        { label: "Home", icon: "i-heroicons-home", to: "/" },
        {
          label: "Add Time Entry",
          icon: "i-heroicons-plus",
          to: "/time-entries/add",
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
  }
})
</script>
<template>
  <div>
    <header>
      <UNavigationMenu
        v-if="loggedIn"
        :items="items"
        class="px-3"
      />
    </header>
    <slot />
  </div>
</template>
