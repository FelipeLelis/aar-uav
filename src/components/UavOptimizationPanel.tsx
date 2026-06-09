type Module = {
  title: string;
  text: string;
};

type UavOptimizationPanelProps = {
  modules: Module[];
};

export function UavOptimizationPanel({ modules }: UavOptimizationPanelProps) {
  return (
    <section className="section" id="pythrust">
      <div className="section-header">
        <div>
          <p className="eyebrow">PyThrust / UAV</p>
          <h2>Capacidades previstas para o solver Python completo.</h2>
        </div>
        <p>
          O módulo acima faz triagem rápida no navegador. Estes blocos mostram
          o que será acoplado quando a ponte PyThrust/OpenMDAO executar os
          solvers reais do projeto Python.
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
