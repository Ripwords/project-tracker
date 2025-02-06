<script setup lang="ts">
definePageMeta({
  layout: "admin",
})

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

const users = computed(() => data.value?.users ?? [])
const total = computed(() => data.value?.total ?? 0)
</script>

<template>
  <div>
    <UsersTable
      :users
      :total
      :loading="status === 'pending'"
      :page-index
      :page-size
      :refresh
    />
  </div>
</template>
