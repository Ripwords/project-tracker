import { z } from "zod"

const timeEntrySchema = z.object({
  projectId: z.string(),
  date: z.string().transform((date) => {
    const d = new Date(date)
    // Normalize to start of day in UTC
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    )
  }),
  duration: z.coerce.number(),
  description: z.string(),
})

export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await requireUserSession(event)
  // Validate request body
  const body = await readValidatedBody(event, timeEntrySchema.parse)

  // Create or update time entry within a transaction
  const timeEntry = await prisma.$transaction(async (tx) => {
    // Find existing time entry
    const existingEntry = await tx.timeEntry.findFirst({
      where: {
        projectId: body.projectId,
        userId: user.id,
        date: body.date,
      },
    })

    // Calculate the duration difference for project hours
    const durationDiff = existingEntry
      ? body.duration - existingEntry.duration
      : body.duration

    // Get current project hours
    const currentProjectHours = await tx.project.findUnique({
      where: { id: body.projectId },
      select: { projectHours: true },
    })

    // Update project hours
    await tx.project.update({
      where: { id: body.projectId },
      data: {
        projectHours: (currentProjectHours?.projectHours ?? 0) + durationDiff,
      },
    })

    // Create or update time entry
    return await tx.timeEntry.upsert({
      where: {
        id: existingEntry?.id,
        projectId_userId_date: {
          projectId: body.projectId,
          userId: user.id!,
          date: body.date,
        },
      },
      create: {
        ...body,
        userId: user.id!,
      },
      update: {
        duration: body.duration,
        description: body.description,
      },
      include: {
        project: true,
      },
    })
  })

  return timeEntry
})
