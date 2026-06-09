type IntegrationMapProps = {
  rows: string[][];
};

export function IntegrationMap({ rows }: IntegrationMapProps) {
  return (
    <div className="system-map" aria-label="Mapa de integracao AAR UAV PyThrust">
      {rows.map(([source, relation, target]) => (
        <div className="map-row" key={`${source}-${relation}-${target}`}>
          <span className="map-node">{source}</span>
          <span className="map-edge">{relation}</span>
          <span className="map-node">{target}</span>
        </div>
      ))}
    </div>
  );
}
