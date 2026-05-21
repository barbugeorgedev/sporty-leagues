import type { BadgeResult } from './league'

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }

export type BadgeAsyncState = AsyncState<BadgeResult>

export type LeaguesAsyncState = AsyncState<import('./league').League[]>
