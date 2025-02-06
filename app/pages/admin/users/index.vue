<script setup lang="ts">
definePageMeta({
  layout: "admin",
})

import type { TableColumn } from "@nuxt/ui"
import { Role, type User } from "@prisma/client"

const { data: users, refresh } = await useLazyAsyncData("users", () =>
  useRequestFetch()<User[]>("/api/admin/users")
)
console.log(users.value)

const USelect = resolveComponent("USelect")
const columns: TableColumn<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return h(USelect, {
        class: "w-full max-w-52",
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
]
</script>

<template>
  <div class="p-6">
    <UTable
      :columns="columns"
      :data="users"
    />
  </div>
</template>
