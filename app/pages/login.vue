<script setup lang="ts">
const loginWithDiscord = () => {
  navigateTo("/auth/discord", {
    external: true,
  })
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <UCard class="max-w-lg w-full shadow-lg">
      <template #header>
        <div class="flex items-center gap-2 p-4">
          <UIcon name="i-heroicons-user" />
          <span class="text-xl font-semibold">Login</span>
        </div>
      </template>
      <div class="flex justify-center items-center gap-2 mt-4">
        <UButton
          class="py-2 rounded"
          variant="outline"
          color="neutral"
          @click="loginWithDiscord"
        >
          <UIcon
            class="text-2xl"
            name="logos:discord"
          />
        </UButton>
      </div>
    </UCard>
  </div>
</template>
