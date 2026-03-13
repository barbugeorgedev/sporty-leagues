export default function Header({ title, subtitle }) {
  return (
    <header className="hero">
      <div className="hero__content">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}

