import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="brand-mark">AAR</span>
        <div>
          <h1>Sistema AAR + UAV</h1>
          <p>Sistema de simulação AAR, UAV e otimização de missão.</p>
        </div>
      </Link>
      <nav className="nav" aria-label="Navegação principal">
        <Link href="/">Console</Link>
        <Link href="/simulador/">AAR</Link>
        <Link href="/uav/">UAV / PyThrust</Link>
      </nav>
    </header>
  );
}
