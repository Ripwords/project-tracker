<script lang="ts" setup>
definePageMeta({
  middleware: ["auth", "user-only"],
})

const { data: projectsData } = useFetch(`/api/users/projects`, {
  transform: (data) => {
    return data.map((project) => ({
      ...project,
      TimeEntry: project.TimeEntry || [],
    }))
  },
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Your projects</h1>
    <UsersProjects
      v-if="projectsData"
      :projects-data
    />
  </div>
</template>
