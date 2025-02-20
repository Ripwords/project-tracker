<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

const props = defineProps<{
  project: Api["/api/admin/projects/:projectId"]["get"]
  refresh: () => void
}>()
const UButton = resolveComponent("UButton")

const isModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const userToRemove = ref<string | null>(null)
const toast = useToast()
const { data: availableUsers } = await useFetch("/api/admin/users")
const selectedUsers = ref(props.project.users.map((user) => user.id))

const handleUpdateUsers = async () => {
  try {
    await $fetch(`/api/admin/projects/${props.project.id}/users`, {
      method: "PATCH",
      body: {
        userIds: selectedUsers.value,
      },
    })
    props.refresh()
    toast.add({
      title: "Users updated",
      description: "Users have been updated successfully",
    })
  } catch (error) {
    toast.add({
      title: "Error updating users",
      description: "Failed to update users",
      color: "error",
    })
  } finally {
    isModalOpen.value = false
  }
}

const handleRemoveUser = async (userId: string) => {
  userToRemove.value = userId
  isConfirmModalOpen.value = true
}

const confirmRemoveUser = async () => {
  if (!userToRemove.value) return

  const updatedUsers = selectedUsers.value.filter(
    (id) => id !== userToRemove.value
  )
  selectedUsers.value = updatedUsers

  try {
    await handleUpdateUsers()
    toast.add({
      title: "User removed",
      description: "User has been removed from the project successfully",
    })
  } catch (error) {
    toast.add({
      title: "Error removing user",
      description: "Failed to remove user from the project",
      color: "error",
    })
  } finally {
    isConfirmModalOpen.value = false
    userToRemove.value = null
  }
}

// Filter out users that are already assigned
const unassignedUsers = computed(() => {
  return availableUsers.value
    ? availableUsers.value?.users.filter(
        (user) =>
          !props.project.users.some((projectUser) => projectUser.id === user.id)
      ) || []
    : []
})

const columns: TableColumn<(typeof props.project.users)[number]>[] = [
  {
    accessorKey: "username",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "hours",
    header: "Hour(s)",
    cell: ({ row }) => {
      return (
        (availableUsers.value?.users
          .find((user) => user.id === row.original.id)
          ?.TimeEntry.reduce((acc, curr) => acc + curr.duration, 0) ?? 0) / 60
      )
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return h(UButton, {
        icon: "i-heroicons-user-minus",
        color: "error",
        variant: "ghost",
        size: "xs",
        onClick: () => handleRemoveUser(row.original.id),
      })
    },
  },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Project Users</h3>
      <UButton
        icon="i-heroicons-user-plus"
        color="primary"
        variant="ghost"
        @click="isModalOpen = true"
      >
        Add Users
      </UButton>
    </div>

    <!-- Current Users List -->
    <UTable
      v-if="project.users.length > 0"
      :data="project.users"
      :columns
    >
      <template #actions-data="{ row }">
        <UButton
          icon="i-heroicons-user-minus"
          color="error"
          variant="ghost"
          size="xs"
          @click="handleRemoveUser(row.id)"
        />
      </template>
    </UTable>

    <!-- Add Users Modal -->
    <UModal v-model:open="isModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-base font-semibold">
              Add Users to {{ project.name }}
            </h3>
          </template>

          <div class="space-y-4">
            <USelect
              class="w-full"
              v-model="selectedUsers"
              :items="unassignedUsers"
              multiple
              label-key="username"
              value-key="id"
              placeholder="Select users to add"
            />
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                @click="isModalOpen = false"
              >
                Cancel
              </UButton>
              <UButton
                color="primary"
                @click="handleUpdateUsers"
              >
                Save Changes
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Confirmation Modal -->
    <UModal v-model:open="isConfirmModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-base font-semibold leading-6">
              Confirm Remove User
            </h3>
          </template>

          <p class="text-sm">
            Are you sure you want to remove this user from the project? This
            action cannot be undone.
          </p>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                variant="outline"
                @click="isConfirmModalOpen = false"
              >
                Cancel
              </UButton>
              <UButton
                color="error"
                @click="confirmRemoveUser"
              >
                Remove User
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
