const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

// Simple in-memory cache for badge requests keyed by league ID
const badgeCache = new Map()

async function safeFetch(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  // Some APIs return 204 with no content; guard against that
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch (_err) {
    throw new Error('Failed to parse response JSON', _err)
  }
}

export async function fetchLeagues() {
  const url = `${BASE_URL}/all_leagues.php`
  const data = await safeFetch(url)

  if (!data || !Array.isArray(data.leagues)) {
    return []
  }

  return data.leagues
}

export async function fetchLeagueBadgeById(leagueId) {
  if (!leagueId) {
    throw new Error('Missing league ID')
  }

  if (badgeCache.has(leagueId)) {
    return badgeCache.get(leagueId)
  }

  const url = `${BASE_URL}/search_all_seasons.php?badge=1&id=${encodeURIComponent(
    leagueId,
  )}`

  const data = await safeFetch(url)

  const seasons = Array.isArray(data?.seasons) ? data.seasons : []

  const firstWithBadge = seasons.find(
    (season) =>
      typeof season?.strBadge === 'string' && season.strBadge.trim().length > 0,
  )

  const badgeUrl = firstWithBadge?.strBadge ?? null

  // Cache even null responses so we do not refetch for leagues without badges
  badgeCache.set(leagueId, badgeUrl)

  return badgeUrl
}

export function clearBadgeCache() {
  badgeCache.clear()
}

