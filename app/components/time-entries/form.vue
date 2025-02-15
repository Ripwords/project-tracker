<script setup lang="ts">
interface TimeEntryForm {
  projectId: string
  date: string
  duration: number
  description: string
}

const form = ref<TimeEntryForm>({
  projectId: "",
  date: new Date().toISOString().split("T")[0] || "",
  duration: 0,
  description: "",
})

const { data: projects } = await useFetch("/api/projects")

const emit = defineEmits(["submit"])

const handleSubmit = () => {
  emit("submit", { ...form.value, duration: Number(form.value.duration) * 60 }) // Convert hours to minutes
}
</script>

<template>
  <UCard>
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <USelect
          v-model="form.projectId"
          :options="projects"
          option-attribute="name"
          value-attribute="id"
          label="Project"
          required
        />

        <UFormGroup label="Date">
          <UInput
            v-model="form.date"
            type="date"
            required
          />
        </UFormGroup>

        <UFormGroup label="Duration (hours)">
          <UInput
            v-model="form.duration"
            type="number"
            min="0"
            step="0.5"
            required
          />
        </UFormGroup>

        <UFormGroup label="Description">
          <UTextarea
            v-model="form.description"
            :rows="3"
            required
          />
        </UFormGroup>

        <div class="flex justify-end">
          <UButton
            type="submit"
            color="primary"
          >
            Save Time Entry
          </UButton>
        </div>
      </div>
    </form>
  </UCard>
</template>
