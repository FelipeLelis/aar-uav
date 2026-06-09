export function LegacySimulatorFrame() {
  return (
    <section className="section" id="simulador-aar">
      <div className="section-header">
        <div>
          <p className="eyebrow">AAR Engine</p>
          <h2>Simulador AAR preservado como modulo operacional.</h2>
        </div>
        <p>
          Esta etapa mantem a simulacao validada funcionando enquanto o motor e a
          visualizacao 3D sao extraidos para componentes React/TypeScript.
        </p>
      </div>
      <div className="sim-frame">
        <iframe src="/simulador-aar.html" title="Simulador AAR" />
      </div>
    </section>
  );
}
