import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchLeagueBadgeById, getCachedBadge } from './sportsdb'

describe('fetchLeagueBadgeById cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('deduplicates concurrent requests for the same league', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          seasons: [{ strBadge: 'https://example.com/a.png', strSeason: '2024' }],
        }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const [first, second] = await Promise.all([
      fetchLeagueBadgeById('99'),
      fetchLeagueBadgeById('99'),
    ])

    expect(first).toEqual(second)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(getCachedBadge('99')).toEqual(first)
  })
})
