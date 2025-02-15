export default defineAppConfig({
  ui: {
    colors: {
      primary: "emerald",
      neutral: "stone",
    },
    table: {
      slots: {
        base: "rounded-lg",
        thead: "bg-neutral-800",
        th: "[&:not(:first-child)]:border-l [&:not(:last-child)]:border-r px-4 py-3 border-b border-neutral-700 font-medium text-neutral-400 text-sm",
        td: "[&:not(:first-child)]:border-l [&:not(:last-child)]:border-r px-4 py-3 border-b border-neutral-700 text-neutral-200",
        tr: "hover:bg-neutral-800/50 transition-colors [&:not(:last-child)]:border-b",
        tbody: "divide-y divide-neutral-700 bg-neutral-900",
      },
    },
  },
})
