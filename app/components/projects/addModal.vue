<script setup lang="ts">
const props = defineProps<{
  refresh: () => void
}>()

const isModalOpen = ref(false)
const newProjectName = ref("")
const toast = useToast()

async function addProject() {
  try {
    await $fetch("/api/admin/projects", {
      method: "POST",
      body: { name: newProjectName.value },
    })
    toast.add({
      title: "Project added successfully!",
      color: "success",
    })
    props.refresh()
    isModalOpen.value = false
    newProjectName.value = ""
  } catch (error) {
    toast.add({
      title: "Failed to add project",
      color: "error",
    })
  }
}
</script>

<template>
  <UModal v-model:open="isModalOpen">
    <UButton label="Add Project" />
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Add New Project</h3>
        </template>

        <div class="p-4">
          <UInput
            v-model="newProjectName"
            placeholder="Project Name"
            class="w-full"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2 p-4 *:cursor-pointer">
            <UButton
              label="Cancel"
              variant="outline"
              color="error"
              @click="isModalOpen = false"
            />
            <UButton
              label="Add"
              @click="addProject"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
