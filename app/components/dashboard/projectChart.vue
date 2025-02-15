<script setup lang="ts">
import { Bar } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js"

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface ProjectStats {
  projectName: string
  totalHours: number
}

const props = defineProps<{
  stats: ProjectStats[]
}>()

const chartData = computed(() => ({
  labels: props.stats.map((stat) => stat.projectName),
  datasets: [
    {
      label: "Hours",
      data: props.stats.map((stat) => stat.totalHours),
      backgroundColor: "#3B82F6",
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Hours",
      },
    },
  },
}
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-base font-semibold leading-6 text-gray-900">
        Project Hours Distribution
      </h3>
    </template>
    <Bar
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </UCard>
</template>
