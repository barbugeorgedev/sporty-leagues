import { useEffect, useRef, useState } from 'react'
import { fetchLeagueBadgeById, getCachedBadge } from '../api/sportsdb'
import type { BadgeAsyncState } from '../types/async'

type FetchSnapshot = {
  leagueId: string
  state: BadgeAsyncState
}

/**
 * Loads badge data for the active league. Aborts in-flight work when the league
 * changes or the hook unmounts. Request generation prevents stale setState.
 */
export function useLeagueBadge(leagueId: string | null): BadgeAsyncState {
  const cached = leagueId ? getCachedBadge(leagueId) : undefined
  const [fetchSnapshot, setFetchSnapshot] = useState<FetchSnapshot | null>(null)
  const requestGeneration = useRef(0)

  useEffect(() => {
    if (!leagueId || cached) {
      return
    }

    const generation = ++requestGeneration.current
    const controller = new AbortController()

    void fetchLeagueBadgeById(leagueId, { signal: controller.signal })
      .then((data) => {
        if (requestGeneration.current !== generation) {
          return
        }
        setFetchSnapshot({
          leagueId,
          state: { status: 'success', data },
        })
      })
      .catch((error) => {
        if (isAbortError(error) || requestGeneration.current !== generation) {
          return
        }

        setFetchSnapshot({
          leagueId,
          state: {
            status: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Something went wrong while loading the badge.',
          },
        })
      })

    return () => {
      controller.abort()
    }
  }, [leagueId, cached])

  if (!leagueId) {
    return { status: 'idle' }
  }

  if (cached) {
    return { status: 'success', data: cached }
  }

  if (fetchSnapshot?.leagueId === leagueId) {
    return fetchSnapshot.state
  }

  return { status: 'loading' }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}
