import type { DiscordOAuthSuccessResponse } from "#shared/types"
import prisma from "~~/server/lib/prisma"

export default defineOAuthDiscordEventHandler({
  async onSuccess(event, { user }) {
    const discordUser = user as DiscordOAuthSuccessResponse["user"]

    const existingUser = await prisma.user.findUnique({
      where: {
        discordId: discordUser.id,
      },
    })

    if (!existingUser) {
      await prisma.user.create({
        data: {
          discordId: discordUser.id,
          username: discordUser.username,
        },
      })
    }

    await setUserSession(event, {
      user: {
        discordId: user.discordId,
        username: user.username,
      },
    })

    return sendRedirect(event, "/")
  },
  onError(event, error) {
    console.error(error)
    clearUserSession(event)
    return sendRedirect(event, "/")
  },
})
