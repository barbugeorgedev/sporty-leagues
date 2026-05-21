import { useCallback, useMemo, useState } from 'react'
import Filters from './components/Filters'
import Header from './components/Header'
import LeagueGrid from './components/LeagueGrid'
import LeagueModal from './components/LeagueModal'
import StateCard from './components/StateCard'
import { useLeagueBadge } from './hooks/useLeagueBadge'
import { useLeagues } from './hooks/useLeagues'
import type { League } from './types/league'
import { filterLeagues, getUniqueSports } from './utils/filterLeagues'

function App() {
  const leaguesState = useLeagues()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('All')
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)

  const badgeState = useLeagueBadge(selectedLeague?.idLeague ?? null)

  const leagues = useMemo(
    () => (leaguesState.status === 'success' ? leaguesState.data : []),
    [leaguesState],
  )

  const sportOptions = useMemo(() => {
    const uniqueSports = getUniqueSports(leagues)
    return ['All', ...uniqueSports]
  }, [leagues])

  const filteredLeagues = useMemo(() => {
    const sportFilter = selectedSport === 'All' ? '' : selectedSport
    return filterLeagues(leagues, searchTerm, sportFilter)
  }, [leagues, searchTerm, selectedSport])

  const closeModal = useCallback(() => {
    setSelectedLeague(null)
  }, [])

  const handleLeagueClick = useCallback((league: League) => {
    setSelectedLeague(league)
  }, [])

  const isLoadingLeagues = leaguesState.status === 'loading'
  const leaguesError =
    leaguesState.status === 'error' ? leaguesState.message : null

  return (
    <div className="app">
      <Header
        title="Sports Leagues"
        subtitle="Browse leagues, filter by sport, and click a league to preview a season badge."
      />

      <main className="container">
        <Filters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          sportOptions={sportOptions}
          totalCount={filteredLeagues.length}
        />

        {isLoadingLeagues ? <StateCard>Loading leagues...</StateCard> : null}

        {!isLoadingLeagues && leaguesError ? (
          <StateCard variant="error">{leaguesError}</StateCard>
        ) : null}

        {!isLoadingLeagues && !leaguesError && filteredLeagues.length === 0 ? (
          <StateCard>No leagues match your current filters.</StateCard>
        ) : null}

        {!isLoadingLeagues && !leaguesError && filteredLeagues.length > 0 ? (
          <LeagueGrid leagues={filteredLeagues} onLeagueClick={handleLeagueClick} />
        ) : null}
      </main>

      {selectedLeague ? (
        <LeagueModal
          league={selectedLeague}
          badgeState={badgeState}
          onClose={closeModal}
        />
      ) : null}
    </div>
  )
}

export default App
