import { AarSimulationModule } from '@/components/AarSimulationModule';
import { AppHeader } from '@/components/AppHeader';

export default function SimulatorPage() {
  return (
    <main className="app-shell">
      <AppHeader />
      <AarSimulationModule compact />
      <footer className="footer">
        Projeto próprio derivado de{' '}
        <a href="https://github.com/YgorLog/sim-aar" target="_blank" rel="noreferrer">
          YgorLog/sim-aar
        </a>
        .
      </footer>
    </main>
  );
}
