export default function LeagueModal({
  league,
  badgeData,
  isLoading,
  error,
  onClose,
}) {
  if (!league) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="league-modal-title"
      >
        <button type="button" className="modal__close" onClick={onClose}>
          ✕
        </button>

        <p className="modal__sport">{league.strSport}</p>
        <h2 id="league-modal-title">{league.strLeague}</h2>

        {isLoading && <p className="modal__status">Loading badge...</p>}

        {!isLoading && error && (
          <p className="modal__status modal__status--error">{error}</p>
        )}

        {!isLoading && !error && badgeData?.badgeUrl && (
          <div className="modal__content">
            <img
              src={badgeData.badgeUrl}
              alt={`${league.strLeague} season badge`}
            />
            <p className="modal__season">
              Season: {badgeData.seasonName || 'Unknown season'}
            </p>
          </div>
        )}

        {!isLoading && !error && !badgeData?.badgeUrl && (
          <p className="modal__status">No season badge available for this league.</p>
        )}
      </div>
    </div>
  );
}

