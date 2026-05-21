export type SportsDbLeaguesResponse = {
  leagues?: unknown[]
}

export type SportsDbSeason = {
  strBadge?: string
  strSeason?: string
}

export type SportsDbSeasonsResponse = {
  seasons?: SportsDbSeason[]
}
