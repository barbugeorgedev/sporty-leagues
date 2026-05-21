import type { SportsDbLeaguesResponse, SportsDbSeasonsResponse } from '../types/api'
import type { BadgeResult, League } from '../types/league'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

const badgeCache = new Map<string, BadgeResult>()
const badgeInFlight = new Map<string, Promise<BadgeResult>>()

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as T
  } catch (cause) {
    throw new Error('Failed to parse response JSON', { cause })
  }
}

function normalizeLeagueId(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }
  return null
}

function normalizeLeague(raw: unknown): League | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const record = raw as Record<string, unknown>
  const idLeague = normalizeLeagueId(record.idLeague)
  if (!idLeague) {
    return null
  }

  return {
    idLeague,
    strLeague: typeof record.strLeague === 'string' ? record.strLeague : '',
    strSport: typeof record.strSport === 'string' ? record.strSport : '',
    strLeagueAlternate:
      typeof record.strLeagueAlternate === 'string' ? record.strLeagueAlternate : '',
  }
}

function extractBadgeResult(data: SportsDbSeasonsResponse | null): BadgeResult {
  const seasons = Array.isArray(data?.seasons) ? data.seasons : []

  const firstWithBadge = seasons.find(
    (season) =>
      typeof season.strBadge === 'string' && season.strBadge.trim().length > 0,
  )

  return {
    badgeUrl: firstWithBadge?.strBadge ?? null,
    seasonName: firstWithBadge?.strSeason ?? null,
  }
}

/** Read-through cache lookup for synchronous UI updates on cache hit. */
export function getCachedBadge(leagueId: string): BadgeResult | undefined {
  return badgeCache.get(leagueId)
}

export async function fetchLeagues(options?: RequestInit): Promise<League[]> {
  const url = `${BASE_URL}/all_leagues.php`
  const data = await safeFetch<SportsDbLeaguesResponse>(url, options)

  if (!data || !Array.isArray(data.leagues)) {
    return []
  }

  return data.leagues
    .map(normalizeLeague)
    .filter((league): league is League => league !== null)
}

export async function fetchLeagueBadgeById(
  leagueId: string,
  options?: RequestInit,
): Promise<BadgeResult> {
  if (!leagueId) {
    throw new Error('Missing league ID')
  }

  const cached = badgeCache.get(leagueId)
  if (cached) {
    return cached
  }

  const inFlight = badgeInFlight.get(leagueId)
  if (inFlight) {
    return inFlight
  }

  const url = `${BASE_URL}/search_all_seasons.php?badge=1&id=${encodeURIComponent(leagueId)}`

  let pending = badgeInFlight.get(leagueId)
  if (!pending) {
    pending = loadBadge(leagueId, url, options).finally(() => {
      badgeInFlight.delete(leagueId)
    })
    badgeInFlight.set(leagueId, pending)
  }

  return pending
}

async function loadBadge(
  leagueId: string,
  url: string,
  options?: RequestInit,
): Promise<BadgeResult> {
  const data = await safeFetch<SportsDbSeasonsResponse>(url, options)
  const result = extractBadgeResult(data)
  badgeCache.set(leagueId, result)
  return result
}
