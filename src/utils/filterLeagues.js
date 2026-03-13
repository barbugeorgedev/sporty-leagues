export function getUniqueSports(leagues) {
  const sports = new Set()

  leagues.forEach((league) => {
    const sport = league?.strSport
    if (typeof sport === 'string' && sport.trim()) {
      sports.add(sport.trim())
    }
  })

  return Array.from(sports).sort((a, b) => a.localeCompare(b))
}

export function filterLeagues(leagues, searchQuery, selectedSport) {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const normalizedSport = selectedSport.trim().toLowerCase()

  return leagues.filter((league) => {
    const name = (league?.strLeague || '').toLowerCase()
    const sport = (league?.strSport || '').toLowerCase()

    const matchesSearch = !normalizedQuery || name.includes(normalizedQuery)
    const matchesSport =
      !normalizedSport || sport === normalizedSport || sport.includes(normalizedSport)

    return matchesSearch && matchesSport
  })
}

