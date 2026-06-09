import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { IntegrationMap } from '@/components/IntegrationMap';
import { LegacySimulatorFrame } from '@/components/LegacySimulatorFrame';
import { MetricCard } from '@/components/MetricCard';
import { UavOptimizationPanel } from '@/components/UavOptimizationPanel';
import { aarCapabilities, integrationMap, pythrustModules, roadmap } from '@/data/platform';

export default function Home() {
  return (
    <main className="app-shell">
      <AppHeader />

      <section className="hero">
        <div>
          <p className="eyebrow">Instituto Tecnologico de Aeronautica / Mission Lab</p>
          <h2>Simulacao AAR e otimizacao UAV em uma unica plataforma.</h2>
          <p className="hero-copy">
            A proposta evolui o simulador de reabastecimento em ciranda para um
            laboratorio de missoes: AAR, UAVs eletricos, autonomia, energia,
            catalogos reais de motores/helices e decisao por restricoes.
          </p>
          <div className="actions">
            <Link className="button primary" href="/simulador/">
              Abrir simulador AAR
            </Link>
            <a className="button secondary" href="#uav">
              Ver integracao PyThrust
            </a>
          </div>
        </div>
        <aside className="panel">
          <h3>Ontologia operacional inicial</h3>
          <p>
            O sistema passa a tratar combustivel, bateria, espera, empuxo,
            catalogo e margem operacional como entidades conectadas por uma
            mesma linguagem de missao.
          </p>
          <div style={{ marginTop: 14 }}>
            <IntegrationMap rows={integrationMap} />
          </div>
        </aside>
      </section>

      <section className="section">
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

      <UavOptimizationPanel modules={pythrustModules} />

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Roadmap tecnico</p>
            <h2>Migracao incremental, sem perder o simulador funcionando.</h2>
          </div>
          <p>
            O monolito HTML fica preservado como baseline. A partir dele, cada
            area vira modulo: UI, motor AAR, ontologia, ponte PyThrust e
            visualizacao.
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

      <LegacySimulatorFrame />

      <footer className="footer">
        Projeto derivado de{' '}
        <a href="https://github.com/YgorLog/sim-aar" target="_blank" rel="noreferrer">
          YgorLog/sim-aar
        </a>
        . PyThrust preservado em <code>pythrust/</code> para integracao UAV/MDO.
      </footer>
    </main>
  );
}
