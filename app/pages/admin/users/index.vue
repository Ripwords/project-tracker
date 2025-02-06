<script setup lang="ts">
definePageMeta({
  layout: "admin",
})

import type { TableColumn } from "@nuxt/ui"
import { Role } from "@prisma/client"
import { PAGE_SIZE } from "#shared/constants"

const pageIndex = ref(1)
const pageSize = ref(PAGE_SIZE)

const { data, refresh, status } = await useLazyAsyncData(
  "users",
  () =>
    useRequestFetch()<Api["/api/admin/users"]["get"]>(
      "/api/admin/users?" +
        new URLSearchParams({
          page: pageIndex.value.toString(),
          limit: pageSize.value.toString(),
        })
    ),
  {
    watch: [pageIndex, pageSize],
  }
)

const users = computed(() => data.value?.users)
const total = computed(() => data.value?.total)

const USelect = resolveComponent("USelect")
const columns: TableColumn<Api["/api/admin/users"]["get"]["users"][number]>[] =
  [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return h("div", { class: "w-28" }, row.original.username || "")
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return h(USelect, {
          class: "w-56",
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
  <div class="p-6 flex flex-col gap-4 items-center">
    <UTable
      class="w-[60%]"
      :loading="status === 'pending'"
      :columns
      :data="users"
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
