'use client';

import { useMemo, useState } from 'react';
import { motorCatalog, propellerCatalog } from '@/data/uavCatalog';

type UavResult = {
  key: string;
  motor: string;
  propeller: string;
  hoverPowerW: number;
  totalPowerW: number;
  currentA: number;
  throttlePct: number;
  enduranceMin: number;
  marginPct: number;
  score: number;
  feasible: boolean;
  reason: string;
};

const G = 9.80665;
const RHO = 1.225;
const IN_TO_M = 0.0254;

function estimateMaxThrustN(maxPowerW: number, diameterIn: number) {
  const diameterM = diameterIn * IN_TO_M;
  const diskArea = Math.PI * (diameterM / 2) ** 2;
  const propulsiveEfficiency = 0.58;
  return (maxPowerW * propulsiveEfficiency * Math.sqrt(2 * RHO * diskArea)) ** (2 / 3);
}

function estimateHoverPowerW(thrustN: number, diameterIn: number, pitchIn: number) {
  const diameterM = diameterIn * IN_TO_M;
  const diskArea = Math.PI * (diameterM / 2) ** 2;
  const pitchPenalty = 1 + Math.max(0, pitchIn / diameterIn - 0.45) * 0.55;
  const figureOfMerit = 0.62 / pitchPenalty;
  return thrustN ** 1.5 / Math.sqrt(2 * RHO * diskArea) / figureOfMerit;
}

function evaluateUav(
  massKg: number,
  rotorCount: number,
  batteryWh: number,
  reservePct: number,
  thrustMarginPct: number,
  cruisePowerFactor: number,
): UavResult[] {
  const requiredThrustPerRotor = (massKg * G * (1 + thrustMarginPct / 100)) / rotorCount;
  const usableBatteryWh = batteryWh * (1 - reservePct / 100);

  return motorCatalog.flatMap((motor) =>
    propellerCatalog.map((propeller) => {
      const maxThrust = estimateMaxThrustN(motor.maxPowerW, propeller.diameterIn);
      const hoverPower = estimateHoverPowerW(requiredThrustPerRotor, propeller.diameterIn, propeller.pitchIn);
      const motorLoss = motor.noLoadCurrentA * 11.1 + motor.resistanceOhm * (hoverPower / 14.8) ** 2;
      const perMotorPower = hoverPower + motorLoss;
      const current = perMotorPower / 14.8;
      const totalPower = perMotorPower * rotorCount * cruisePowerFactor;
      const throttlePct = Math.sqrt(requiredThrustPerRotor / Math.max(maxThrust, 1e-6)) * 100;
      const endurance = (usableBatteryWh / Math.max(totalPower, 1)) * 60;
      const marginPct = ((maxThrust - requiredThrustPerRotor) / requiredThrustPerRotor) * 100;
      const feasible = maxThrust >= requiredThrustPerRotor && current <= motor.maxCurrentA && throttlePct <= 90;
      const reason = feasible
        ? 'viável'
        : maxThrust < requiredThrustPerRotor
          ? 'empuxo insuficiente'
          : current > motor.maxCurrentA
            ? 'corrente acima do motor'
            : 'throttle acima do limite';
      const score = endurance + Math.max(0, marginPct) * 0.08 - totalPower * 0.006 - motor.weightG * rotorCount * 0.004;

      return {
        key: `${motor.id}-${propeller.id}`,
        motor: `${motor.manufacturer} ${motor.name}`,
        propeller: `${propeller.manufacturer} ${propeller.model}`,
        hoverPowerW: perMotorPower,
        totalPowerW: totalPower,
        currentA: current,
        throttlePct,
        enduranceMin: endurance,
        marginPct,
        score,
        feasible,
        reason,
      };
    }),
  ).sort((a, b) => Number(b.feasible) - Number(a.feasible) || b.score - a.score);
}

export function UavSimulationModule() {
  const [massKg, setMassKg] = useState(2.4);
  const [rotorCount, setRotorCount] = useState(4);
  const [batteryWh, setBatteryWh] = useState(92);
  const [reservePct, setReservePct] = useState(20);
  const [thrustMarginPct, setThrustMarginPct] = useState(35);
  const [cruisePowerFactor, setCruisePowerFactor] = useState(0.72);

  const results = useMemo(
    () => evaluateUav(massKg, rotorCount, batteryWh, reservePct, thrustMarginPct, cruisePowerFactor),
    [massKg, rotorCount, batteryWh, reservePct, thrustMarginPct, cruisePowerFactor],
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
            <input type="number" min="0.2" step="0.1" value={massKg} onChange={(event) => setMassKg(Number(event.target.value))} />
          </label>
          <label>
            Número de rotores
            <select value={rotorCount} onChange={(event) => setRotorCount(Number(event.target.value))}>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </label>
          <label>
            Bateria útil nominal (Wh)
            <input type="number" min="10" step="5" value={batteryWh} onChange={(event) => setBatteryWh(Number(event.target.value))} />
          </label>
          <label>
            Reserva de bateria (%)
            <input type="number" min="0" max="70" step="5" value={reservePct} onChange={(event) => setReservePct(Number(event.target.value))} />
          </label>
          <label>
            Margem de empuxo (%)
            <input type="number" min="0" max="150" step="5" value={thrustMarginPct} onChange={(event) => setThrustMarginPct(Number(event.target.value))} />
          </label>
          <label>
            Fator de potência em missão
            <input type="number" min="0.4" max="1.4" step="0.02" value={cruisePowerFactor} onChange={(event) => setCruisePowerFactor(Number(event.target.value))} />
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
