import { z } from "zod"

const timeEntrySchema = z.object({
  projectId: z.string(),
  date: z.string(),
  duration: z.number(),
  description: z.string(),
})

export default defineEventHandler(async (event) => {
  // Check authentication
  const session = await getUserSession(event)
  if (!session || !session.user || !session.user.discordId) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    })
  }

  // Validate request body
  const body = await readBody(event)
  const validatedData = timeEntrySchema.parse(body)

  // Create time entry
  const timeEntry = await event.context.prisma.timeEntry.create({
    data: {
      ...validatedData,
      userId: session.user.discordId,
      date: new Date(validatedData.date),
    },
    include: {
      project: true,
    },
  })

  return timeEntry
})
