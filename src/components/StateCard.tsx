import type { ReactNode } from 'react'

type StateCardProps = {
  children: ReactNode
  variant?: 'default' | 'error'
}

export default function StateCard({ children, variant = 'default' }: StateCardProps) {
  const className =
    variant === 'error' ? 'state-card state-card--error' : 'state-card'

  return <div className={className}>{children}</div>
}
