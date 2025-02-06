<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui"

const { projects, pageSize, refresh } = defineProps<{
  projects: Api["/api/admin/projects"]["get"]["projects"]
  total: number
  loading: boolean
  pageSize: number
  refresh: () => void
}>()
const pageIndex = defineModel<number>("pageIndex", { required: true })
const toast = useToast()
const columns: TableColumn<
  Api["/api/admin/projects"]["get"]["projects"][number]
>[] = [
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => {
      return h("div", { class: "w-28" }, row.original.name || "")
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return h("div", [
        h(
          "button",
          {
            class: "text-red-500",
            onClick: async () => {
              try {
                await $fetch(`/api/admin/projects/${row.original.id}`, {
                  method: "DELETE",
                })
                toast.add({
                  title: "Project deleted",
                  color: "success",
                })
                refresh()
              } catch (error) {
                toast.add({
                  title: "Failed to delete project",
                  color: "error",
                })
              }
            },
          },
          "Delete"
        ),
      ])
    },
  },
  // Add more columns as needed
]
</script>

<template>
  <div class="p-6 flex flex-col gap-4 items-center">
    <UTable
      class="w-fit"
      :loading
      :columns
      :data="projects"
    />

    <div class="flex justify-center border-t border-[var(--ui-border)] pt-4">
      <UPagination
        :default-page="1"
        :items-per-page="pageSize"
        :total
        @update:page="(p) => (pageIndex = p)"
      />
    </div>
  </div>
</template>
