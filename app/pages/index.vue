<script lang="ts" setup>
definePageMeta({
  middleware: ["auth", "user-only"],
})

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js"

const dayjs = useDayjs()

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    tension: number
    fill: boolean
    pointBackgroundColor: string
  }[]
}

const {
  data: projectsData,
  status,
  error,
} = useFetch(`/api/users/projects`, {
  transform: (data) => {
    return data.map((project) => ({
      ...project,
      TimeEntry: project.TimeEntry || [],
    }))
  },
})
const chartRefs = ref<Record<string, HTMLCanvasElement | null>>({})
const charts = ref<Record<string, Chart | null>>({})

const getChartData = (
  timeEntries: Api["/api/users/projects"]["get"][number]["TimeEntry"]
): ChartData => {
  // Group entries by day and sum durations
  const entriesByDay = timeEntries.reduce<Record<string, number>>(
    (acc, entry) => {
      // Parse the date and handle timezone consistently
      const date = new Date(entry.date)
      if (isNaN(date.getTime())) {
        return acc
      }

      // Convert to local date string in YYYY-MM-DD format
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`

      acc[dateStr] = (acc[dateStr] || 0) + entry.duration
      return acc
    },
    {}
  )

  // Sort by date and prepare chart data
  const sortedDates = Object.keys(entriesByDay).sort()

  const chartData = {
    labels: sortedDates.map((date) => {
      const parts = date.split("-")
      if (parts.length < 3) return date

      const [yearStr = "", monthStr = "", dayStr = ""] = parts
      const year = parseInt(yearStr, 10)
      const month = parseInt(monthStr, 10)
      const day = parseInt(dayStr, 10)

      if (isNaN(year) || isNaN(month) || isNaN(day)) return date

      return dayjs(new Date(year, month - 1, day)).format("MMM D")
    }),
    datasets: [
      {
        label: "Duration (hours)",
        data: sortedDates.map((date) => {
          const duration = entriesByDay[date] || 0
          return +duration.toFixed(2)
        }),
        borderColor: "#3B82F6",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#3B82F6",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  return chartData
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.formattedValue}h`,
      },
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 12,
      titleFont: {
        size: 13,
      },
      bodyFont: {
        size: 12,
        weight: "bold" as const,
      },
    },
  },
  scales: {
    x: {
      type: "category" as const,
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        color: "white",
        font: {
          size: 11,
          weight: "bold" as const,
        },
        padding: 8,
      },
    },
    y: {
      type: "linear" as const,
      beginAtZero: true,
      grid: {
        color: "rgba(128, 128, 128, 0.1)",
      },
      ticks: {
        maxTicksLimit: 6,
        callback: function (this: any, tickValue: number | string) {
          return typeof tickValue === "number" ? `${tickValue}h` : tickValue
        },
        precision: 1,
        color: "white",
        font: {
          size: 11,
          weight: "bold" as const,
        },
        padding: 8,
      },
      border: {
        display: false,
      },
    },
  },
} as const

// Add a watch to handle data changes and update charts
watch(
  projectsData,
  (newProjects) => {
    if (!newProjects) return

    nextTick(() => {
      newProjects.forEach((project) => {
        if (project.TimeEntry.length && chartRefs.value[project.id]) {
          // Destroy existing chart if it exists
          if (charts.value[project.id]) {
            charts.value[project.id]?.destroy()
          }

          const ctx = chartRefs.value[project.id]?.getContext("2d")
          if (ctx) {
            const chartData = getChartData(project.TimeEntry)
            charts.value[project.id] = new Chart(ctx, {
              type: "line",
              data: chartData,
              options: chartOptions,
            })
          }
        }
      })
    })
  },
  { immediate: true }
)

// Clean up charts on component unmount
onUnmounted(() => {
  Object.values(charts.value).forEach((chart) => chart?.destroy())
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Projects</h1>

    <div
      v-if="status === 'error'"
      class="text-red-500"
    >
      Error: {{ error }}
    </div>
    <div
      v-if="status === 'success'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard
        v-for="project in projectsData"
        :key="project.id"
        class="relative"
      >
        <template #header>
          <h3 class="text-lg font-semibold">{{ project.name }}</h3>
        </template>

        <div class="h-[200px] mt-4">
          <canvas
            v-if="project.TimeEntry.length"
            :ref="(el) => el && (chartRefs[project.id] = el as HTMLCanvasElement)"
            class="w-full h-full"
          />
          <div
            v-else
            class="flex items-center justify-center h-full text-gray-500"
          >
            No time entries yet
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <span class="text-sm">Total hours:</span>
            <span class="font-medium">
              {{
                project.TimeEntry.length
                  ? project.TimeEntry.reduce(
                      (acc, curr) => acc + curr.duration,
                      0
                    ).toFixed(2)
                  : "0.00"
              }}h
            </span>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
