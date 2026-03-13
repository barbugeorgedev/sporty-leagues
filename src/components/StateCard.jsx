export default function StateCard({ children, variant = 'default' }) {
  const className =
    variant === 'error' ? 'state-card state-card--error' : 'state-card';

  return <div className={className}>{children}</div>;
}

