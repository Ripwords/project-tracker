import type { DiscordOAuthSuccessResponse } from "#shared/types"

export default defineOAuthDiscordEventHandler({
  async onSuccess(event, { user }) {
    const discordUser = user as DiscordOAuthSuccessResponse["user"]

    const existingUser = await prisma.user.findFirst({
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
        id: existingUser?.id,
        discordId: discordUser.id,
        username: discordUser.username,
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
