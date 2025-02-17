export type DiscordOAuthSuccessResponse = {
  tokens: {
    token_type: string
    access_token: string
    expires_in: number
    refresh_token: string
    scope: string
  }
  user: {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    flags: number
    banner: string | null
    accent_color: number
    global_name: string
    avatar_decoration_data: string | null
    banner_color: string
    clan: string | null
    primary_guild: string | null
    mfa_enabled: boolean
    locale: string
    premium_type: number
    email: string
    verified: boolean
  }
}
