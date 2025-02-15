<script setup lang="ts">
const route = useRoute("admin-projects-id")
const { data: project, refresh } = await useLazyFetch<
  Api["/api/admin/projects/:projectId"]["get"]
>(`/api/admin/projects/${route.params.id}`)
</script>

<template>
  <div
    v-if="project"
    class="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3"
  >
    <div
      class="flex items-center justify-between border-b border-neutral-600 pb-6"
    >
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">
          {{ project.name }}
        </h1>
      </div>
      <UButton
        to="/admin/projects"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-left"
      >
        Back to Projects
      </UButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Project Details</h2>
            <UButton
              color="primary"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              size="sm"
            >
              Edit Details
            </UButton>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <div class="text-sm font-medium text-gray-500">Created</div>
            <div class="flex items-center space-x-2">
              <UIcon
                name="i-heroicons-calendar"
                class="text-gray-400"
              />
              <NuxtTime
                :datetime="project.createdAt"
                format="MMMM D, YYYY"
              />
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-sm font-medium text-gray-500">Last Updated</div>
            <div class="flex items-center space-x-2">
              <UIcon
                name="i-heroicons-clock"
                class="text-gray-400"
              />
              <NuxtTime
                :datetime="project.updatedAt"
                relative
              />
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Quick Stats</h2>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-2 rounded-lg">
            <div class="text-sm font-medium">Total Users</div>
            <div class="text-lg font-semibold">
              {{ project.users?.length || 0 }}
            </div>
          </div>
          <!-- Add more stats here if available -->
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Team Members</h2>
      </template>

      <ProjectsUserAssignment
        :project
        :refresh
      />
    </UCard>
  </div>
</template>
