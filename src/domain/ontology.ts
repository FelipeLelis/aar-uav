export type EnergyCarrier = 'fuel' | 'battery';

export type MissionDomain = 'aar' | 'uav' | 'combined';

export type ConstraintState = 'ok' | 'warning' | 'failed';

export type EnergyReserve = {
  carrier: EnergyCarrier;
  initial: number;
  reserve: number;
  unit: 'kg' | 'Wh';
};

export type OperationalConstraint = {
  key: string;
  label: string;
  state: ConstraintState;
  value: number;
  limit: number;
  unit: string;
};

export type MissionOntology = {
  domain: MissionDomain;
  vehicle: string;
  energy: EnergyReserve;
  constraints: OperationalConstraint[];
  notes: string[];
};

export const ontologyTerms = [
  { term: 'Missão', meaning: 'perfil operacional, duração, fila, carga e objetivo de análise' },
  { term: 'Energia', meaning: 'combustível ou bateria disponível, consumida e reservada' },
  { term: 'Restrição', meaning: 'bingo fuel, corrente, throttle, empuxo, tempo ou reserva mínima' },
  { term: 'Catálogo', meaning: 'base de motores, hélices e configurações candidatas' },
  { term: 'Solver', meaning: 'rotina que transforma parâmetros de entrada em eventos, rankings e estados' },
];
