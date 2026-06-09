export const aarCapabilities = [
  { label: 'AAR', value: 'Ciranda', detail: 'Fluxos pod-asa-aeronave, fila, pausas e bingo fuel.' },
  { label: 'UAV', value: 'Propulsao', detail: 'Motor brushless, helice, bateria e perfil de missao.' },
  { label: 'MDO', value: 'Otimizacao', detail: 'Busca de configuracoes por autonomia, empuxo, eficiencia e massa.' },
];

export const integrationMap = [
  ['Missao', 'define', 'perfil AAR ou UAV'],
  ['Energia', 'limita', 'combustivel, bateria e reservas'],
  ['Fila / carga', 'consome', 'tempo, potencia e margem operacional'],
  ['PyThrust', 'otimiza', 'motor, helice, bateria e catalogos'],
  ['AAR Engine', 'simula', 'ciranda, pausas, bingo e threshold'],
];

export const pythrustModules = [
  {
    title: 'Solvers de desempenho',
    text: 'Modelos em regime permanente para estimar empuxo, torque, potencia, eficiencia e limites eletricos.',
  },
  {
    title: 'Calibracao automatica',
    text: 'Ajuste de parametros para aproximar o modelo aos dados de teste do fabricante.',
  },
  {
    title: 'Busca em catalogos',
    text: 'Mapeia projeto teorico em motores brushless e helices reais a partir dos bancos do PyThrust.',
  },
  {
    title: 'OpenMDAO / MDO',
    text: 'Permite co-design multidisciplinar com objetivos e restricoes de missao.',
  },
];

export const roadmap = [
  {
    title: 'Fase 1 - Plataforma Next',
    text: 'Separar apresentacao, simulador legado, dados de integracao e documentacao em componentes mantiveis.',
  },
  {
    title: 'Fase 2 - Motor AAR modular',
    text: 'Extrair o simulador de dentro do HTML para um modulo TypeScript testavel e reutilizavel.',
  },
  {
    title: 'Fase 3 - Ponte PyThrust',
    text: 'Executar otimizacoes Python via job/API, notebook ou pipeline local, preservando OpenMDAO e bancos reais.',
  },
  {
    title: 'Fase 4 - Missao combinada',
    text: 'Comparar reabastecimento, endurance UAV, swaps de bateria, payload e trajetorias sob a mesma ontologia.',
  },
];
