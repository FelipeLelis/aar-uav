type Module = {
  title: string;
  text: string;
};

type UavOptimizationPanelProps = {
  modules: Module[];
};

export function UavOptimizationPanel({ modules }: UavOptimizationPanelProps) {
  return (
    <section className="section" id="uav">
      <div className="section-header">
        <div>
          <p className="eyebrow">PyThrust / UAV</p>
          <h2>Da logistica de reabastecimento para co-design de propulsao eletrica.</h2>
        </div>
        <p>
          A uniao proposta transforma o simulador AAR em uma plataforma de missao:
          aeronaves tripuladas, UAVs, combustivel, bateria, payload e catalogos reais
          podem entrar no mesmo processo de decisao.
        </p>
      </div>
      <div className="grid cols-2">
        {modules.map((module) => (
          <article className="panel" key={module.title}>
            <h3>{module.title}</h3>
            <p>{module.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
