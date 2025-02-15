<script setup lang="ts">
import { PAGE_SIZE } from "#shared/constants"

const pageIndex = ref(1)
const pageSize = ref(PAGE_SIZE)

const { data, refresh, status } = await useLazyFetch("/api/admin/users", {
  query: {
    page: pageIndex.value,
    limit: pageSize.value,
  },
  watch: [pageIndex, pageSize],
})

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
