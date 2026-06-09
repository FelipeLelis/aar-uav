import Link from 'next/link';

const navigation = [
  { href: '/', label: 'Console' },
  { href: '/simulador/', label: 'AAR' },
  { href: '/uav/', label: 'UAV' },
];

export function AppHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Ir para o console">
        <span className="brand-mark">A</span>
        <span className="brand-copy">
          <strong>AAR + UAV</strong>
          <small>Sistema de simulação e otimização de missão</small>
        </span>
      </Link>
      <nav className="nav" aria-label="Navegação principal">
        {navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
