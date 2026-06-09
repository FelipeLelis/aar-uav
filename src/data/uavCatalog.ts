export type MotorCatalogItem = {
  id: string;
  name: string;
  manufacturer: string;
  kv: number;
  resistanceOhm: number;
  noLoadCurrentA: number;
  maxCurrentA: number;
  weightG: number;
  maxPowerW: number;
};

export type PropellerCatalogItem = {
  id: string;
  manufacturer: string;
  model: string;
  diameterIn: number;
  pitchIn: number;
  bladeCount: number;
};

export const motorCatalog: MotorCatalogItem[] = [
  {
    id: '4-Max_PPB-2834-1000',
    name: 'PPB-2834-1000',
    manufacturer: '4-Max',
    kv: 1000,
    resistanceOhm: 0.172,
    noLoadCurrentA: 0.8,
    maxCurrentA: 16,
    weightG: 47.9,
    maxPowerW: 180,
  },
  {
    id: '4-Max_PPO-3536-1000',
    name: 'PPO-3536-1000',
    manufacturer: '4-Max',
    kv: 1000,
    resistanceOhm: 0.065,
    noLoadCurrentA: 1.2,
    maxCurrentA: 35,
    weightG: 102,
    maxPowerW: 420,
  },
  {
    id: 'Aeolian_C3542-KV1000',
    name: 'C3542-KV1000',
    manufacturer: 'Aeolian',
    kv: 1000,
    resistanceOhm: 0.055,
    noLoadCurrentA: 1.5,
    maxCurrentA: 42,
    weightG: 132,
    maxPowerW: 520,
  },
  {
    id: 'Xnova_2812_Freestyle_900KV',
    name: '2812 Freestyle 900KV',
    manufacturer: 'Xnova',
    kv: 900,
    resistanceOhm: 0.075,
    noLoadCurrentA: 1.0,
    maxCurrentA: 38,
    weightG: 78,
    maxPowerW: 480,
  },
  {
    id: 'X-Team_XTO4008_380KV',
    name: 'XTO4008 380KV',
    manufacturer: 'X-Team',
    kv: 380,
    resistanceOhm: 0.11,
    noLoadCurrentA: 0.7,
    maxCurrentA: 18,
    weightG: 96,
    maxPowerW: 320,
  },
];

export const propellerCatalog: PropellerCatalogItem[] = [
  { id: 'APC_9x4.5E', manufacturer: 'APC', model: '9x4.5E', diameterIn: 9, pitchIn: 4.5, bladeCount: 2 },
  { id: 'APC_10x4.5MR', manufacturer: 'APC', model: '10x4.5MR', diameterIn: 10, pitchIn: 4.5, bladeCount: 2 },
  { id: 'APC_10x6', manufacturer: 'APC', model: '10x6', diameterIn: 10, pitchIn: 6, bladeCount: 2 },
  { id: 'APC_11x5.5E', manufacturer: 'APC', model: '11x5.5E', diameterIn: 11, pitchIn: 5.5, bladeCount: 2 },
  { id: 'APC_12x6E', manufacturer: 'APC', model: '12x6E', diameterIn: 12, pitchIn: 6, bladeCount: 2 },
  { id: 'APC_13x6.5E', manufacturer: 'APC', model: '13x6.5E', diameterIn: 13, pitchIn: 6.5, bladeCount: 2 },
];
