import { z } from "zod"

const timeEntrySchema = z.object({
  projectId: z.string(),
  date: z
    .string()
    .date()
    .transform((date) => new Date(date)),
  duration: z.coerce.number(),
  description: z.string(),
})

export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await requireUserSession(event)
  // Validate request body
  const body = await readValidatedBody(event, timeEntrySchema.parse)

  // Create time entry within a transaction
  const timeEntry = await prisma.$transaction(async (tx) => {
    // Get current project hours
    const currentProjectHours = await tx.project.findUnique({
      where: { id: body.projectId },
      select: { projectHours: true },
    })

    // Update project hours
    await tx.project.update({
      where: { id: body.projectId },
      data: {
        projectHours:
          (currentProjectHours?.projectHours ?? 0) + body.duration / 60,
      },
    })

    // Create new time entry
    return await tx.timeEntry.create({
      data: {
        ...body,
        userId: user.id!,
      },
      include: {
        project: true,
      },
    })
  })

  return timeEntry
})
