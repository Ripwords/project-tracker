<script setup lang="ts">
const { userId } = useRoute("admin-users-userId").params

const { data } = await useLazyFetch(`/api/admin/users/${userId}/projects`, {
  transform: (data) => {
    return {
      ...data,
      projects: data.projects.map((project) => ({
        ...project,
        TimeEntry: project.TimeEntry || [],
      })),
    }
  },
})
</script>

<template>
  <div class="p-6">
    <div v-if="data">
      <h1 class="text-2xl font-bold mb-6">
        {{ data.user?.username }}'s Projects
      </h1>

      <UsersProjects :projects-data="data.projects" />
    </div>
  </div>
</template>
