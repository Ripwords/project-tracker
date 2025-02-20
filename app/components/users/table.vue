<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui"
import { Role } from "@prisma/client"

const { users, pageSize, refresh } = defineProps<{
  users: Api["/api/admin/users"]["get"]["users"]
  total: number
  loading: boolean
  pageSize: number
  refresh: () => void
}>()
const pageIndex = defineModel<number>("pageIndex", { required: true })
const toast = useToast()

const USelect = resolveComponent("USelect")
const router = useRouter()
const columns: TableColumn<Api["/api/admin/users"]["get"]["users"][number]>[] =
  [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return h(
          "div",
          {
            class: "w-12 hover:underline hover:cursor-pointer",
            onClick: () => router.push(`/admin/users/${row.original.id}`),
          },
          row.original.username || ""
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return h(USelect, {
          class: "w-46",
          modelValue: row.original.role,
          items: Object.values(Role)
            .filter((role) => role !== "ADMIN")
            .map((role) => ({
              label: role,
              value: role,
            })),
          "onUpdate:modelValue": async (value: Role) => {
            try {
              await $fetch(`/api/admin/users/${row.original.id}/role`, {
                method: "PATCH",
                body: {
                  role: value,
                },
              })
              toast.add({
                title: "Role updated",
                description: "The role of the user has been updated",
                icon: "i-heroicons-check-circle",
              })
            } catch {
              toast.add({
                title: "Error",
                description: "An error occurred while updating the role",
              })
            } finally {
              refresh()
            }
          },
        })
      },
    },
    {
      id: "action",
      header: "Actions",
    },
  ]
</script>

<template>
  <UContainer>
    <UTable
      class="h-96"
      :loading
      :columns
      :data="users"
      :caption="`${total} users`"
    >
      <template #action-cell="{ row }">
        {{ row.id }}
      </template>
    </UTable>

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
