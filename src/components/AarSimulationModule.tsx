type AarSimulationModuleProps = {
  compact?: boolean;
};

export function AarSimulationModule({ compact = false }: AarSimulationModuleProps) {
  return (
    <section className={compact ? 'simulation-module compact' : 'simulation-module'} id="aar-legado">
      <div className="module-strip">
        <div>
          <span className="module-kicker">Simulador legado</span>
          <h2>Interface completa herdada</h2>
        </div>
        <div className="module-status">
          <span>modelo: pod → asa → aeronave</span>
          <strong>preservado</strong>
        </div>
      </div>
      <div className="simulation-surface">
        <iframe src="/simulador-aar.html" title="Simulador AAR legado" />
      </div>
    </section>
  );
}
