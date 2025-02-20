<script setup lang="ts">
definePageMeta({
  middleware: "user-only",
})
import { z } from "zod"

const { data: projectsData, status } = useFetch("/api/users/projects")
const router = useRouter()
const toast = useToast()

const state = reactive({
  projectId: "",
  date: new Date().toISOString().split("T")[0],
  duration: 0,
  description: "",
  durationUnit: "hours" as "minutes" | "hours",
})

const schema = z.object({
  projectId: z.string().min(1, "Project is required"),
  date: z.string().date().min(1, "Date is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  description: z.string().min(1, "Description is required"),
  durationUnit: z.enum(["minutes", "hours"]),
})

async function onSubmit() {
  try {
    const durationInMinutes =
      state.durationUnit === "hours" ? state.duration * 60 : state.duration

    await $fetch("/api/time-entries", {
      method: "POST",
      body: {
        ...state,
        duration: durationInMinutes,
      },
    })
    toast.add({
      title: "Success",
      description: "Time entry added successfully",
      color: "success",
    })
    router.push("/")
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to add time entry",
      color: "error",
    })
    console.error(error)
  }
}

const durationOptions = [
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
]
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Add Time Entry</h1>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          to="/"
        >
          Back
        </UButton>
      </div>

      <UCard class="backdrop-blur-sm">
        <UForm
          :state
          :schema
          @submit="onSubmit"
          class="space-y-6"
        >
          <UFormField
            name="projectId"
            label="Project"
            required
          >
            <USelect
              v-model="state.projectId"
              :loading="status === 'pending'"
              :items="projectsData || []"
              label-key="name"
              value-key="id"
              placeholder="Select a project"
              icon="i-heroicons-building-office"
              required
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField
              name="date"
              label="Date"
              required
            >
              <UInput
                v-model="state.date"
                type="date"
                icon="i-heroicons-calendar"
                required
              />
            </UFormField>

            <div class="space-y-2">
              <UFormField
                name="duration"
                :label="`Duration (${state.durationUnit})`"
                required
              >
                <div class="flex gap-2">
                  <UInput
                    v-model="state.duration"
                    type="number"
                    :min="1"
                    :step="1"
                    icon="i-heroicons-clock"
                    required
                    class="flex-1"
                  />
                  <USelect
                    v-model="state.durationUnit"
                    :items="durationOptions"
                    icon="i-heroicons-clock"
                    class="w-32"
                  />
                </div>
              </UFormField>
            </div>
          </div>

          <UFormField
            name="description"
            label="Description"
            help="What did you work on?"
            required
          >
            <UTextarea
              v-model="state.description"
              :rows="3"
              icon="i-heroicons-pencil"
              placeholder="Describe your work..."
              required
            />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton
              color="neutral"
              variant="soft"
              to="/"
              icon="i-heroicons-x-mark"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              icon="i-heroicons-check"
            >
              Save Time Entry
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
