import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Filters from './components/Filters.jsx';
import LeagueGrid from './components/LeagueGrid.jsx';
import LeagueModal from './components/LeagueModal.jsx';
import StateCard from './components/StateCard.jsx';
import { fetchLeagues, fetchLeagueBadgeById } from './api/sportsdb.js';
import { filterLeagues, getUniqueSports } from './utils/filterLeagues.js';

function App() {
  const [leagues, setLeagues] = useState([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);
  const [leaguesError, setLeaguesError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');

  const [selectedLeague, setSelectedLeague] = useState(null);

  const [badgeCache, setBadgeCache] = useState({});
  const [badgeData, setBadgeData] = useState(null);
  const [isLoadingBadge, setIsLoadingBadge] = useState(false);
  const [badgeError, setBadgeError] = useState('');

  useEffect(() => {
    async function loadLeagues() {
      try {
        setIsLoadingLeagues(true);
        setLeaguesError('');

        const data = await fetchLeagues();
        setLeagues(data || []);
      } catch (error) {
        setLeaguesError(error.message || 'Something went wrong while loading leagues.');
      } finally {
        setIsLoadingLeagues(false);
      }
    }

    loadLeagues();
  }, []);

  const sportOptions = useMemo(() => {
    const uniqueSports = getUniqueSports(leagues);
    return ['All', ...uniqueSports];
  }, [leagues]);

  const filteredLeagues = useMemo(() => {
    if (selectedSport === 'All') {
      return filterLeagues(leagues, searchTerm, '');
    }
    return filterLeagues(leagues, searchTerm, selectedSport);
  }, [leagues, searchTerm, selectedSport]);

  async function handleLeagueClick(league) {
    setSelectedLeague(league);
    setBadgeError('');

    const leagueId = league.idLeague;

    if (badgeCache[leagueId]) {
      setBadgeData(badgeCache[leagueId]);
      return;
    }

    try {
      setIsLoadingBadge(true);
      setBadgeData(null);

      const result = {
        badgeUrl: await fetchLeagueBadgeById(leagueId),
        seasonName: null,
      };

      setBadgeCache((prev) => ({
        ...prev,
        [leagueId]: result,
      }));

      setBadgeData(result);
    } catch (error) {
      setBadgeError(error.message || 'Something went wrong while loading the badge.');
    } finally {
      setIsLoadingBadge(false);
    }
  }

  function closeModal() {
    setSelectedLeague(null);
    setBadgeData(null);
    setBadgeError('');
    setIsLoadingBadge(false);
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    if (selectedLeague) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedLeague]);

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

        {isLoadingLeagues && (
          <StateCard>Loading leagues...</StateCard>
        )}

        {!isLoadingLeagues && leaguesError && (
          <StateCard variant="error">{leaguesError}</StateCard>
        )}

        {!isLoadingLeagues && !leaguesError && filteredLeagues.length === 0 && (
          <StateCard>No leagues match your current filters.</StateCard>
        )}

        {!isLoadingLeagues && !leaguesError && filteredLeagues.length > 0 && (
          <LeagueGrid leagues={filteredLeagues} onLeagueClick={handleLeagueClick} />
        )}
      </main>

      <LeagueModal
        league={selectedLeague}
        badgeData={badgeData}
        isLoading={isLoadingBadge}
        error={badgeError}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;