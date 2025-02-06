<script setup lang="ts">
definePageMeta({
  layout: "admin",
})

import { PAGE_SIZE } from "#shared/constants"
import { ref } from "vue"

const pageIndex = ref(1)
const pageSize = ref(PAGE_SIZE)
const isModalOpen = ref(false)
const newProjectName = ref("")
const toast = useToast()

const { data, refresh, status } = await useLazyAsyncData(
  "projects",
  () =>
    useRequestFetch()<Api["/api/admin/projects"]["get"]>(
      "/api/admin/projects?" +
        new URLSearchParams({
          page: pageIndex.value.toString(),
          limit: pageSize.value.toString(),
        })
    ),
  {
    watch: [pageIndex, pageSize],
  }
)

const projects = computed(() => data.value?.projects ?? [])
const total = computed(() => data.value?.total ?? 0)

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
    refresh()
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
  <div>
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
            />
          </div>

          <template #footer>
            <div class="flex justify-end gap-2 p-4">
              <UButton
                label="Cancel"
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

    <ProjectsTable
      :projects="projects"
      :total="total"
      :loading="status === 'pending'"
      :page-index="pageIndex"
      :page-size="pageSize"
      :refresh="refresh"
    />
  </div>
</template>
