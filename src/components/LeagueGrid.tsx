import type { League } from '../types/league'

type LeagueGridProps = {
  leagues: readonly League[]
  onLeagueClick: (league: League) => void
}

export default function LeagueGrid({ leagues, onLeagueClick }: LeagueGridProps) {
  if (leagues.length === 0) {
    return null
  }

  return (
    <section className="league-grid">
      {leagues.map((league) => (
        <button
          key={league.idLeague}
          type="button"
          className="league-card"
          onClick={() => onLeagueClick(league)}
        >
          <p className="league-card__sport">{league.strSport || 'Unknown sport'}</p>
          <h2 className="league-card__title">{league.strLeague || 'Unnamed league'}</h2>
          <p className="league-card__alt">
            {league.strLeagueAlternate || 'No alternate name available'}
          </p>
          <span className="league-card__cta">View badge →</span>
        </button>
      ))}
    </section>
  )
}
