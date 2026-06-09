import type { AarSimulationResult } from './aarEngine';
import type { MissionOntology, OperationalConstraint } from './ontology';
import type { UavResult, UavSolverInput } from './uavSolver';

export type CombinedMissionInput = {
  aar?: AarSimulationResult;
  uav?: {
    input: UavSolverInput;
    best: UavResult;
  };
};

export type CombinedMissionSummary = {
  state: 'ready' | 'partial' | 'failed';
  ontologies: MissionOntology[];
  recommendations: string[];
};

function constraint(
  key: string,
  label: string,
  value: number,
  limit: number,
  unit: string,
  okWhen: 'gte' | 'lte',
): OperationalConstraint {
  const ok = okWhen === 'gte' ? value >= limit : value <= limit;
  const warning = okWhen === 'gte' ? value >= limit * 0.9 : value <= limit * 1.1;

  return {
    key,
    label,
    value,
    limit,
    unit,
    state: ok ? 'ok' : warning ? 'warning' : 'failed',
  };
}

export function summarizeCombinedMission(input: CombinedMissionInput): CombinedMissionSummary {
  const ontologies: MissionOntology[] = [];
  const recommendations: string[] = [];

  if (input.aar) {
    ontologies.push({
      domain: 'aar',
      vehicle: 'Aeronaves reabastecidas',
      energy: {
        carrier: 'fuel',
        initial: input.aar.remainingPodFuelKg + input.aar.remainingWingFuelKg,
        reserve: input.aar.remainingWingFuelKg,
        unit: 'kg',
      },
      constraints: [
        constraint('time', 'Tempo de operação', input.aar.totalTimeMin, input.aar.totalTimeMin, 'min', 'lte'),
        constraint('supported', 'Aeronaves atendidas', input.aar.supportedAircraft, 1, 'un', 'gte'),
      ],
      notes: [input.aar.success ? 'A operação AAR fecha no cenário informado.' : 'O cenário AAR não fecha sem revisar fluxos ou reservas.'],
    });

    if (!input.aar.success) {
      recommendations.push('Rever fluxo Y, fluxo X, bingo fuel ou quantidade de aeronaves no módulo AAR.');
    }
  }

  if (input.uav) {
    ontologies.push({
      domain: 'uav',
      vehicle: 'UAV elétrico',
      energy: {
        carrier: 'battery',
        initial: input.uav.input.batteryWh,
        reserve: input.uav.input.batteryWh * (input.uav.input.reservePct / 100),
        unit: 'Wh',
      },
      constraints: [
        constraint('endurance', 'Autonomia estimada', input.uav.best.enduranceMin, 10, 'min', 'gte'),
        constraint('throttle', 'Throttle estimado', input.uav.best.throttlePct, 90, '%', 'lte'),
        constraint('margin', 'Margem de empuxo', input.uav.best.marginPct, input.uav.input.thrustMarginPct, '%', 'gte'),
      ],
      notes: [input.uav.best.feasible ? 'A combinação UAV é viável na triagem aproximada.' : 'A combinação UAV viola uma ou mais restrições.'],
    });

    if (!input.uav.best.feasible) {
      recommendations.push('Executar busca ampliada de motor/hélice ou reduzir massa/payload no módulo UAV.');
    }
  }

  const hasFailedConstraint = ontologies.some((ontology) =>
    ontology.constraints.some((item) => item.state === 'failed'),
  );

  return {
    state: hasFailedConstraint ? 'failed' : ontologies.length > 1 ? 'ready' : 'partial',
    ontologies,
    recommendations,
  };
}
