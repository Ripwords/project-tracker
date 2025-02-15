<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui"

const NuxtLink = resolveComponent("NuxtLink")
const UButton = resolveComponent("UButton")
const UIcon = resolveComponent("UIcon")

const isDeleteModalOpen = ref(false)
const selectedProjectId = ref()

const { projects, pageSize, refresh } = defineProps<{
  projects: Api["/api/admin/projects"]["get"]["projects"]
  total: number
  loading: boolean
  pageSize: number
  refresh: () => void
}>()

const pageIndex = defineModel<number>("pageIndex", { required: true })
const columns: TableColumn<
  Api["/api/admin/projects"]["get"]["projects"][number]
>[] = [
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => {
      return h(
        NuxtLink,
        {
          href: `/admin/projects/${row.original.id}`,
          class: "hover:underline w-28 font-bold",
          onClick: (e: Event) => {
            e.preventDefault()
            navigateTo(`/admin/projects/${row.original.id}`)
          },
        },
        () => row.original.name
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return h("div", [
        h(
          UButton,
          {
            class: "cursor-pointer",
            variant: "solid",
            color: "error",
            icon: "i-heroicons-trash",
            onClick: async () => {
              selectedProjectId.value = row.original.id
              isDeleteModalOpen.value = true
            },
          },
          () => "Delete"
        ),
      ])
    },
  },
]
</script>

<template>
  <UContainer>
    <div class="flex-1 divide-y divide-(--ui-border-accented) w-full">
      <div
        class="flex justify-end items-center gap-2 px-4 py-3.5 overflow-x-auto"
      >
        <ProjectsAddModal :refresh />
        <ProjectsDeleteModal
          v-model:open="isDeleteModalOpen"
          :project-id="selectedProjectId"
          :refresh
        />
      </div>
      <UTable
        class="h-96"
        :loading
        :columns
        :data="projects"
      />
    </div>

    <div class="flex justify-center border-t border-[var(--ui-border)] pt-4">
      <UPagination
        :default-page="1"
        :items-per-page="pageSize"
        :total
        @update:page="(p) => (pageIndex = p)"
      />
    </div>
  </UContainer>
</template>
