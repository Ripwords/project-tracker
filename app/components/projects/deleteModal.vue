<script setup lang="ts">
const props = defineProps<{
  projectId?: string
  refresh: () => void
}>()

const isModalOpen = defineModel<boolean>("open", {
  required: true,
  default: false,
})
const toast = useToast()

async function deleteProject() {
  try {
    if (!props.projectId) {
      throw new Error("Project ID is required")
    }
    await $fetch(`/api/admin/projects/${props.projectId}`, {
      method: "DELETE",
    })
    toast.add({
      title: "Project deleted successfully!",
      color: "success",
    })
    props.refresh()
  } catch (error) {
    toast.add({
      title: "Failed to delete project",
      color: "error",
    })
  } finally {
    isModalOpen.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isModalOpen">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold leading-6">Delete Project</h3>
        </template>
        <div class="space-y-4 p-4">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this project? This action cannot be
            undone.
          </p>
          <div class="flex gap-3 justify-end *:cursor-pointer">
            <UButton
              color="neutral"
              variant="soft"
              label="Cancel"
              @click="isModalOpen = false"
            />
            <UButton
              color="error"
              variant="solid"
              label="Delete"
              icon="i-heroicons-trash"
              @click="deleteProject"
            />
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
