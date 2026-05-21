import { useRef } from 'react'
import { useModal } from '../hooks/useModal'
import type { BadgeAsyncState } from '../types/async'
import type { League } from '../types/league'

type LeagueModalProps = {
  league: League
  badgeState: BadgeAsyncState
  onClose: () => void
}

export default function LeagueModal({ league, badgeState, onClose }: LeagueModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useModal({
    isOpen: true,
    onClose,
    dialogRef,
    initialFocusRef: closeButtonRef,
  })

  const isLoading = badgeState.status === 'loading'
  const error = badgeState.status === 'error' ? badgeState.message : null
  const badgeData = badgeState.status === 'success' ? badgeState.data : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="league-modal-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <p className="modal__sport">{league.strSport}</p>
        <h2 id="league-modal-title">{league.strLeague}</h2>

        {isLoading ? (
          <p className="modal__status" role="status" aria-live="polite">
            Loading badge...
          </p>
        ) : null}

        {!isLoading && error ? (
          <p className="modal__status modal__status--error" role="alert">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && badgeData?.badgeUrl ? (
          <div className="modal__content">
            <img src={badgeData.badgeUrl} alt={`${league.strLeague} season badge`} />
            <p className="modal__season">
              Season: {badgeData.seasonName || 'Unknown season'}
            </p>
          </div>
        ) : null}

        {!isLoading && !error && !badgeData?.badgeUrl ? (
          <p className="modal__status">No season badge available for this league.</p>
        ) : null}
      </div>
    </div>
  )
}
