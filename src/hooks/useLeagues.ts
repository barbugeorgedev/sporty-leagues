import { useEffect, useState } from 'react'
import { fetchLeagues } from '../api/sportsdb'
import type { LeaguesAsyncState } from '../types/async'

export function useLeagues(): LeaguesAsyncState {
  const [state, setState] = useState<LeaguesAsyncState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setState({ status: 'loading' })

      try {
        const data = await fetchLeagues({ signal: controller.signal })
        setState({ status: 'success', data })
      } catch (error) {
        if (isAbortError(error)) {
          return
        }

        setState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Something went wrong while loading leagues.',
        })
      }
    }

    void load()

    return () => {
      controller.abort()
    }
  }, [])

  return state
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}
