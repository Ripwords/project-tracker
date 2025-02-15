<script setup lang="ts">
import { PAGE_SIZE } from "#shared/constants"
import { ref } from "vue"

const pageIndex = ref(1)
const pageSize = ref(PAGE_SIZE)

const { data, refresh, status } = await useFetch("/api/admin/projects", {
  query: {
    page: pageIndex.value,
    limit: pageSize.value,
  },
  watch: [pageIndex, pageSize],
})

const projects = computed(() => data.value?.projects ?? [])
const total = computed(() => data.value?.total ?? 0)
</script>

<template>
  <div>
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
