export const aarCapabilities = [
  { label: 'AAR', value: 'Ciranda', detail: 'Fluxos pod-asa-aeronave, fila, pausas e bingo fuel.' },
  { label: 'UAV', value: 'Propulsão', detail: 'Motor brushless, hélice, bateria e perfil de missão.' },
  { label: 'MDO', value: 'Parâmetros', detail: 'Busca por autonomia, empuxo, eficiência, massa e restrições.' },
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
    title: 'Motor AAR',
    text: 'Extrair o cálculo temporal para TypeScript, com testes para eventos, bingo, deadlock e threshold.',
  },
  {
    title: 'Visualização',
    text: 'Substituir a superfície embarcada por componentes React e cena 3D própria do projeto.',
  },
  {
    title: 'Ponte PyThrust',
    text: 'Executar solvers Python por job/API local, mantendo OpenMDAO e bancos reais de motores/hélices.',
  },
  {
    title: 'Missão combinada',
    text: 'Comparar AAR, endurance UAV, swaps de bateria, payload e trajetórias sob a mesma ontologia.',
  },
];
