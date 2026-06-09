import { sampleAarInput } from '@/data/sampleMission';
import { simulateAar } from '@/domain/aarEngine';

const eventLabels = {
  start: 'início',
  transfer: 'transferência',
  pause: 'pausa',
  complete: 'concluído',
  bingo: 'bingo',
  done: 'fim',
  timeout: 'limite',
};

export function AarNativePanel() {
  const result = simulateAar(sampleAarInput);
  const highlightedEvents = result.events
    .filter((event) => ['start', 'pause', 'complete', 'bingo', 'done', 'timeout'].includes(event.type))
    .slice(0, 9);
  const transferEvents = result.events.filter((event) => event.type === 'transfer');
  const activeAircraft = transferEvents[transferEvents.length - 1]?.aircraftId ?? sampleAarInput.aircraft[0]?.id;
  const wingLevel = Math.max(0, Math.min(100, (result.remainingWingFuelKg / sampleAarInput.wingCapacityKg) * 100));
  const podLevel = Math.max(0, Math.min(100, (result.remainingPodFuelKg / sampleAarInput.podFuelKg) * 100));

  return (
    <section className="simulation-module aar-native-module">
      <div className="module-strip">
        <div>
          <span className="module-kicker">Motor AAR TypeScript</span>
          <h2>Visualização conectada aos eventos do novo motor</h2>
        </div>
        <div className="module-status">
          <span>cenário amostral · sem iframe</span>
          <strong>{result.success ? 'operação fecha' : 'revisar cenário'}</strong>
        </div>
      </div>

      <div className="aar-native-grid">
        <div className="aar-scene-card">
          <div className="aar-scene">
            <div className="aar-orbit" />
            <div className="aar-tanker">
              <span />
            </div>
            <div className="aar-refuel-line" />
            {sampleAarInput.aircraft.map((aircraft, index) => (
              <div
                className={aircraft.id === activeAircraft ? 'aar-receiver active' : 'aar-receiver'}
                key={aircraft.id}
                style={{ transform: `rotate(${index * 34 - 24}deg) translateX(${96 + index * 10}px)` }}
              >
                <span>{aircraft.id}</span>
              </div>
            ))}
          </div>

          <div className="aar-levels">
            <div>
              <span>Pod</span>
              <strong>{result.remainingPodFuelKg.toFixed(0)} kg</strong>
              <i><b style={{ width: `${podLevel}%` }} /></i>
            </div>
            <div>
              <span>Asa</span>
              <strong>{result.remainingWingFuelKg.toFixed(0)} kg</strong>
              <i><b style={{ width: `${wingLevel}%` }} /></i>
            </div>
          </div>
        </div>

        <div className="aar-summary-card">
          <div className="aar-summary-grid">
            <div>
              <span>Tempo total</span>
              <strong>{result.totalTimeMin.toFixed(1)} min</strong>
            </div>
            <div>
              <span>Aeronaves</span>
              <strong>{result.supportedAircraft}/{sampleAarInput.aircraft.length}</strong>
            </div>
            <div>
              <span>Eventos</span>
              <strong>{result.events.length}</strong>
            </div>
            <div>
              <span>Fluxo X/Y</span>
              <strong>{sampleAarInput.podToWingKgPerMin}/{sampleAarInput.wingToAircraftKgPerMin}</strong>
            </div>
          </div>

          <div className="aar-event-list">
            {highlightedEvents.map((event, index) => (
              <div className={`aar-event ${event.type}`} key={`${event.type}-${event.timeMin}-${index}`}>
                <span>{event.timeMin.toFixed(1)} min</span>
                <strong>{eventLabels[event.type]}</strong>
                <p>{event.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
