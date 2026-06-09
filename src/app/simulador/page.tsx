import { AarSimulationModule } from '@/components/AarSimulationModule';
import { AppHeader } from '@/components/AppHeader';

export default function SimulatorPage() {
  return (
    <main className="app-shell">
      <AppHeader />

      <section className="console-header">
        <div>
          <p className="eyebrow">Módulo AAR</p>
          <h2>Reabastecimento aéreo em ciranda</h2>
          <p>
            Ambiente dedicado para avaliar fluxos pod-asa-aeronave, espera em
            fila, pausas operacionais, bingo fuel e capacidade de atendimento.
          </p>
        </div>
        <aside className="run-state">
          <span>estado do módulo</span>
          <strong>operacional</strong>
          <small>Simulador herdado integrado à rota AAR</small>
        </aside>
      </section>

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
