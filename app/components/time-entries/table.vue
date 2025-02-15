<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { format } from "date-fns"

interface TimeEntry {
  id: string
  projectId: string
  project: {
    name: string
  }
  date: string
  duration: number
  description: string
}

const props = defineProps<{
  entries: TimeEntry[]
}>()

const columns: TableColumn<TimeEntry>[] = [
  {
    accessorKey: "project.name",
    header: "Project",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
]

const formatDate = (date: string) => {
  return format(new Date(date), "MMM d, yyyy")
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

defineEmits(["edit", "delete"])
</script>

<template>
  <UCard>
    <UTable
      :rows="entries"
      :columns="columns"
    >
      <template #date-data="{ row }">
        {{ formatDate(row.original.date) }}
      </template>

      <template #duration-data="{ row }">
        {{ formatDuration(row.original.duration) }}
      </template>

      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            icon="i-heroicons-pencil-square"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="$emit('edit', row)"
          />
          <UButton
            icon="i-heroicons-trash"
            color="error"
            variant="ghost"
            size="xs"
            @click="$emit('delete', row)"
          />
        </div>
      </template>
    </UTable>
  </UCard>
</template>
