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

const USelect = resolveComponent("USelect")
const columns: TableColumn<Api["/api/admin/users"]["get"]["users"][number]>[] =
  [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return h("div", { class: "w-12" }, row.original.username || "")
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
            await $fetch(`/api/admin/users/${row.original.id}/role`, {
              method: "PATCH",
              body: {
                role: value,
              },
            })
            refresh()
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
