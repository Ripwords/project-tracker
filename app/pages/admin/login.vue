<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"

const toast = useToast()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const state = reactive({
  email: "",
  password: "",
})

const onSubmit = async (
  event: FormSubmitEvent<z.infer<typeof loginSchema>>
) => {
  try {
    await $fetch("/api/admin/login", {
      method: "POST",
      body: event.data,
    })
    await navigateTo("/admin", {
      external: true,
    })
    toast.add({
      title: "Success",
      description: "Logged in successfully",
      color: "success",
    })
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Invalid email or password",
      color: "error",
    })
  }
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
      <div class="p-6">
        <UForm
          class="flex flex-col gap-4"
          :validation="loginSchema"
          :state="state"
          @submit="onSubmit"
        >
          <UFormField
            label="Email"
            name="email"
          >
            <UInput
              v-model="state.email"
              class="w-full p-2 rounded"
              type="email"
              placeholder="Enter your email"
            />
          </UFormField>
          <UFormField
            label="Password"
            name="password"
          >
            <UInput
              v-model="state.password"
              class="w-full p-2 rounded"
              type="password"
              placeholder="Enter your password"
            />
          </UFormField>
          <div class="flex justify-center gap-4">
            <UButton
              class="py-2 rounded"
              type="submit"
            >
              Login
              <UIcon
                class="text-3xl"
                name="material-symbols:mail-rounded"
              />
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>
