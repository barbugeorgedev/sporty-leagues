import { describe, expect, it } from 'vitest'
import type { League } from '../types/league'
import { filterLeagues, getUniqueSports } from './filterLeagues'

const sampleLeagues: League[] = [
  {
    idLeague: '1',
    strLeague: 'Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'EPL',
  },
  {
    idLeague: '2',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: '',
  },
  {
    idLeague: '3',
    strLeague: 'La Liga',
    strSport: 'Soccer',
    strLeagueAlternate: '',
  },
]

describe('filterLeagues', () => {
  it('filters by league name search', () => {
    const result = filterLeagues(sampleLeagues, 'premier', '')
    expect(result).toHaveLength(1)
    expect(result[0]?.strLeague).toBe('Premier League')
  })

  it('filters by exact sport match', () => {
    const result = filterLeagues(sampleLeagues, '', 'Soccer')
    expect(result).toHaveLength(2)
    expect(result.every((league) => league.strSport === 'Soccer')).toBe(true)
  })

  it('returns all leagues when filters are empty', () => {
    expect(filterLeagues(sampleLeagues, '', '')).toHaveLength(3)
  })
})

describe('getUniqueSports', () => {
  it('returns sorted unique sports', () => {
    expect(getUniqueSports(sampleLeagues)).toEqual(['Basketball', 'Soccer'])
  })
})
