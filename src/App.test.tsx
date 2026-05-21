import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { BadgeResult, League } from './types/league'

const mockLeagues: League[] = [
  {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'EPL',
  },
  {
    idLeague: '4387',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: '',
  },
]

const mockBadge: BadgeResult = {
  badgeUrl: 'https://example.com/badge.png',
  seasonName: '2024-2025',
}

vi.mock('./api/sportsdb', () => ({
  fetchLeagues: vi.fn(),
  fetchLeagueBadgeById: vi.fn(),
  getCachedBadge: vi.fn(() => undefined),
}))

import { fetchLeagueBadgeById, fetchLeagues, getCachedBadge } from './api/sportsdb'

const fetchLeaguesMock = vi.mocked(fetchLeagues)
const fetchLeagueBadgeByIdMock = vi.mocked(fetchLeagueBadgeById)
const getCachedBadgeMock = vi.mocked(getCachedBadge)

describe('App integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchLeaguesMock.mockResolvedValue(mockLeagues)
    fetchLeagueBadgeByIdMock.mockResolvedValue(mockBadge)
    getCachedBadgeMock.mockReturnValue(undefined)
  })

  it('filters leagues by search term', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('English Premier League')).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/search leagues/i), 'NBA')

    await waitFor(() => {
      expect(screen.queryByText('English Premier League')).not.toBeInTheDocument()
      expect(screen.getByText('NBA')).toBeInTheDocument()
    })

    expect(screen.getByText(/1 league found/i)).toBeInTheDocument()
  })

  it('opens modal and shows badge after league click', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('English Premier League')).toBeInTheDocument()
    })

    await user.click(
      screen.getByRole('button', { name: /english premier league/i }),
    )

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    expect(
      await screen.findByAltText(/english premier league season badge/i),
    ).toHaveAttribute('src', mockBadge.badgeUrl)

    expect(screen.getByText(/season: 2024-2025/i)).toBeInTheDocument()

    expect(fetchLeagueBadgeByIdMock).toHaveBeenCalledWith(
      '4328',
      expect.objectContaining({
        signal: expect.any(AbortSignal) as AbortSignal,
      }),
    )
  })
})
