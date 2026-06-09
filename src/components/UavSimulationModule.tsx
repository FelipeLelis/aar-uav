'use client';

import { useMemo, useState } from 'react';
import { motorCatalog, propellerCatalog } from '@/data/uavCatalog';
import { evaluateUav, type UavSolverInput } from '@/domain/uavSolver';

const initialInput: UavSolverInput = {
  massKg: 2.4,
  rotorCount: 4,
  batteryWh: 92,
  reservePct: 20,
  thrustMarginPct: 35,
  cruisePowerFactor: 0.72,
};

export function UavSimulationModule() {
  const [input, setInput] = useState(initialInput);
  const updateInput = (key: keyof UavSolverInput, value: number) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const results = useMemo(
    () => evaluateUav(input, motorCatalog, propellerCatalog),
    [input],
  );
  const best = results.find((result) => result.feasible) ?? results[0];
  const visibleResults = results.slice(0, 6);

  return (
    <section className="simulation-module uav-module" id="uav">
      <div className="module-strip">
        <div>
          <span className="module-kicker">Módulo UAV / PyThrust</span>
          <h2>Otimização preliminar de propulsão elétrica</h2>
        </div>
        <div className="module-status">
          <span>catálogo reduzido · solver aproximado no browser</span>
          <strong>{best?.feasible ? 'combinação viável' : 'sem solução viável'}</strong>
        </div>
      </div>

      <div className="uav-console">
        <form className="uav-form">
          <label>
            Massa total do UAV (kg)
            <input type="number" min="0.2" step="0.1" value={input.massKg} onChange={(event) => updateInput('massKg', Number(event.target.value))} />
          </label>
          <label>
            Número de rotores
            <select value={input.rotorCount} onChange={(event) => updateInput('rotorCount', Number(event.target.value))}>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </label>
          <label>
            Bateria útil nominal (Wh)
            <input type="number" min="10" step="5" value={input.batteryWh} onChange={(event) => updateInput('batteryWh', Number(event.target.value))} />
          </label>
          <label>
            Reserva de bateria (%)
            <input type="number" min="0" max="70" step="5" value={input.reservePct} onChange={(event) => updateInput('reservePct', Number(event.target.value))} />
          </label>
          <label>
            Margem de empuxo (%)
            <input type="number" min="0" max="150" step="5" value={input.thrustMarginPct} onChange={(event) => updateInput('thrustMarginPct', Number(event.target.value))} />
          </label>
          <label>
            Fator de potência em missão
            <input type="number" min="0.4" max="1.4" step="0.02" value={input.cruisePowerFactor} onChange={(event) => updateInput('cruisePowerFactor', Number(event.target.value))} />
          </label>
        </form>

        <div className="uav-summary">
          <span>melhor combinação</span>
          <strong>{best?.motor}</strong>
          <p>{best?.propeller}</p>
          <dl>
            <div>
              <dt>Autonomia</dt>
              <dd>{best?.enduranceMin.toFixed(1)} min</dd>
            </div>
            <div>
              <dt>Potência total</dt>
              <dd>{best?.totalPowerW.toFixed(0)} W</dd>
            </div>
            <div>
              <dt>Corrente/motor</dt>
              <dd>{best?.currentA.toFixed(1)} A</dd>
            </div>
            <div>
              <dt>Throttle</dt>
              <dd>{best?.throttlePct.toFixed(0)}%</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="uav-results">
        <div className="uav-results-head">
          <span>ranking</span>
          <span>motor</span>
          <span>hélice</span>
          <span>autonomia</span>
          <span>margem</span>
          <span>estado</span>
        </div>
        {visibleResults.map((result, index) => (
          <div className="uav-result-row" key={result.key}>
            <span>{index + 1}</span>
            <span>{result.motor}</span>
            <span>{result.propeller}</span>
            <span>{result.enduranceMin.toFixed(1)} min</span>
            <span>{result.marginPct.toFixed(0)}%</span>
            <span className={result.feasible ? 'state-ok' : 'state-bad'}>{result.reason}</span>
          </div>
        ))}
      </div>

      <p className="module-note">
        Esta versão usa uma aproximação física para triagem rápida. A próxima etapa é trocar o avaliador por uma ponte Python que execute o solver PyThrust/OpenMDAO completo.
      </p>
    </section>
  );
}
