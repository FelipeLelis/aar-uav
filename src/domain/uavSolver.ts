import type { MotorCatalogItem, PropellerCatalogItem } from '@/data/uavCatalog';

export type UavSolverInput = {
  massKg: number;
  rotorCount: number;
  batteryWh: number;
  reservePct: number;
  thrustMarginPct: number;
  cruisePowerFactor: number;
};

export type UavResult = {
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
const BUS_VOLTAGE = 14.8;

export function estimateMaxThrustN(maxPowerW: number, diameterIn: number) {
  const diameterM = diameterIn * IN_TO_M;
  const diskArea = Math.PI * (diameterM / 2) ** 2;
  const propulsiveEfficiency = 0.58;
  return (maxPowerW * propulsiveEfficiency * Math.sqrt(2 * RHO * diskArea)) ** (2 / 3);
}

export function estimateHoverPowerW(thrustN: number, diameterIn: number, pitchIn: number) {
  const diameterM = diameterIn * IN_TO_M;
  const diskArea = Math.PI * (diameterM / 2) ** 2;
  const pitchPenalty = 1 + Math.max(0, pitchIn / diameterIn - 0.45) * 0.55;
  const figureOfMerit = 0.62 / pitchPenalty;
  return thrustN ** 1.5 / Math.sqrt(2 * RHO * diskArea) / figureOfMerit;
}

export function evaluateUav(
  input: UavSolverInput,
  motors: MotorCatalogItem[],
  propellers: PropellerCatalogItem[],
): UavResult[] {
  const requiredThrustPerRotor = (input.massKg * G * (1 + input.thrustMarginPct / 100)) / input.rotorCount;
  const usableBatteryWh = input.batteryWh * (1 - input.reservePct / 100);

  return motors.flatMap((motor) =>
    propellers.map((propeller) => {
      const maxThrust = estimateMaxThrustN(motor.maxPowerW, propeller.diameterIn);
      const hoverPower = estimateHoverPowerW(requiredThrustPerRotor, propeller.diameterIn, propeller.pitchIn);
      const motorLoss = motor.noLoadCurrentA * 11.1 + motor.resistanceOhm * (hoverPower / BUS_VOLTAGE) ** 2;
      const perMotorPower = hoverPower + motorLoss;
      const current = perMotorPower / BUS_VOLTAGE;
      const totalPower = perMotorPower * input.rotorCount * input.cruisePowerFactor;
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
      const score = endurance + Math.max(0, marginPct) * 0.08 - totalPower * 0.006 - motor.weightG * input.rotorCount * 0.004;

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
