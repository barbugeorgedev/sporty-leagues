import type { League } from '../types/league'

export function getUniqueSports(leagues: readonly League[]): string[] {
  const sports = new Set<string>()

  for (const league of leagues) {
    const sport = league.strSport.trim()
    if (sport) {
      sports.add(sport)
    }
  }

  return Array.from(sports).sort((a, b) => a.localeCompare(b))
}

export function filterLeagues(
  leagues: readonly League[],
  searchQuery: string,
  selectedSport: string,
): League[] {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const normalizedSport = selectedSport.trim().toLowerCase()

  return leagues.filter((league) => {
    const name = league.strLeague.toLowerCase()
    const sport = league.strSport.toLowerCase()

    const matchesSearch = !normalizedQuery || name.includes(normalizedQuery)
    const matchesSport = !normalizedSport || sport === normalizedSport

    return matchesSearch && matchesSport
  })
}
