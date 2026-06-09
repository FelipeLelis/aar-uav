type AarSimulationModuleProps = {
  compact?: boolean;
};

export function AarSimulationModule({ compact = false }: AarSimulationModuleProps) {
  return (
    <section className={compact ? 'simulation-module compact' : 'simulation-module'} id="aar">
      <div className="module-strip">
        <div>
          <span className="module-kicker">Módulo AAR</span>
          <h2>Reabastecimento em ciranda</h2>
        </div>
        <div className="module-status">
          <span>modelo: pod → asa → aeronave</span>
          <strong>operacional</strong>
        </div>
      </div>
      <div className="simulation-surface">
        <iframe src="/simulador-aar.html" title="Módulo de simulação AAR" />
      </div>
    </section>
  );
}
