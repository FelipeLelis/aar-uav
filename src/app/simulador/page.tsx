import { AppHeader } from '@/components/AppHeader';
import { LegacySimulatorFrame } from '@/components/LegacySimulatorFrame';

export default function SimulatorPage() {
  return (
    <main className="app-shell">
      <AppHeader />
      <LegacySimulatorFrame />
      <footer className="footer">
        Projeto derivado de{' '}
        <a href="https://github.com/YgorLog/sim-aar" target="_blank" rel="noreferrer">
          YgorLog/sim-aar
        </a>
        .
      </footer>
    </main>
  );
}
