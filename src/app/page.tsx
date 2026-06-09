import { AarSimulationModule } from '@/components/AarSimulationModule';
import { AppHeader } from '@/components/AppHeader';
import { IntegrationMap } from '@/components/IntegrationMap';
import { MetricCard } from '@/components/MetricCard';
import { UavSimulationModule } from '@/components/UavSimulationModule';
import { UavOptimizationPanel } from '@/components/UavOptimizationPanel';
import { aarCapabilities, integrationMap, pythrustModules, roadmap } from '@/data/platform';

export default function Home() {
  return (
    <main className="app-shell">
      <AppHeader />

      <section className="console-header">
        <div>
          <p className="eyebrow">Console de simulação</p>
          <h2>AAR + UAV</h2>
          <p>
            Ambiente único para estudar reabastecimento em ciranda, consumo em
            espera, limites de missão e futuras rotinas de otimização UAV via
            PyThrust.
          </p>
        </div>
        <aside className="run-state">
          <span>estado do sistema</span>
          <strong>em desenvolvimento</strong>
          <small>AAR ativo · PyThrust acoplado como base local</small>
        </aside>
      </section>

      <section className="section tight">
        <div className="grid cols-3">
          {aarCapabilities.map((capability) => (
            <MetricCard
              key={capability.label}
              label={capability.label}
              value={capability.value}
              detail={capability.detail}
            />
          ))}
        </div>
      </section>

      <AarSimulationModule />

      <section className="section technical-grid" id="modelo">
        <article className="panel">
          <h3>Ontologia de missão</h3>
          <p>
            O mesmo vocabulário cobre combustível, bateria, fila, carga,
            empuxo, catálogo e margem operacional.
          </p>
          <div style={{ marginTop: 14 }}>
            <IntegrationMap rows={integrationMap} />
          </div>
        </article>
        <article className="panel">
          <h3>Escopo atual</h3>
          <p>
            O módulo AAR está operacional. O PyThrust entra como núcleo Python
            para catalogar e otimizar sistemas de propulsão elétrica em UAVs.
          </p>
          <div className="scope-list">
            <span>AAR: simulação temporal discreta</span>
            <span>UAV: motores, hélices, bateria e perfil</span>
            <span>MDO: objetivos, restrições e busca em catálogos</span>
          </div>
        </article>
      </section>

      <UavSimulationModule />

      <UavOptimizationPanel modules={pythrustModules} />

      <section className="section compact-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Modularização</p>
            <h2>Próximas extrações técnicas</h2>
          </div>
          <p>
            A prioridade é transformar o simulador em módulos próprios do
            projeto: motor AAR, visualização, ontologia e ponte PyThrust.
          </p>
        </div>
        <div className="grid cols-2 workflow">
          {roadmap.map((item) => (
            <article className="panel" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        Projeto próprio derivado de{' '}
        <a href="https://github.com/YgorLog/sim-aar" target="_blank" rel="noreferrer">
          YgorLog/sim-aar
        </a>
        . PyThrust em <code>pythrust/</code> para integração UAV/MDO.
      </footer>
    </main>
  );
}
