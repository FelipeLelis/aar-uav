import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="brand-mark">ITA</span>
        <span>
          <h1>AAR + UAV Mission Lab</h1>
          <p>Simulacao operacional, ontologia e otimizacao de sistemas aeronauticos.</p>
        </span>
      </Link>
      <nav className="nav" aria-label="Navegacao principal">
        <Link href="/">Visao integrada</Link>
        <Link href="/simulador/">Simulador AAR</Link>
        <a href="https://github.com/YgorLog/sim-aar" target="_blank" rel="noreferrer">
          Fork original
        </a>
      </nav>
    </header>
  );
}
