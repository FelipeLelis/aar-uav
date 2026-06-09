export const aarCapabilities = [
  { label: 'AAR', value: 'Ciranda', detail: 'Fluxos pod-asa-aeronave, fila, pausas e bingo fuel.' },
  { label: 'UAV', value: 'Propulsão', detail: 'Motor brushless, hélice, bateria e perfil de missão.' },
  { label: 'MDO', value: 'Parâmetros', detail: 'Busca por autonomia, empuxo, eficiência, massa e restrições.' },
];

export const integrationMap = [
  ['Missão', 'define', 'perfil AAR ou UAV'],
  ['Energia', 'limita', 'combustível, bateria e reservas'],
  ['Fila / carga', 'consome', 'tempo, potência e margem operacional'],
  ['PyThrust', 'otimiza', 'motor, hélice, bateria e catálogos'],
  ['Módulo AAR', 'simula', 'ciranda, pausas, bingo e threshold'],
];

export const pythrustModules = [
  {
    title: 'Solvers de desempenho',
    text: 'Modelos em regime permanente para estimar empuxo, torque, potência, eficiência e limites elétricos.',
  },
  {
    title: 'Calibração automática',
    text: 'Ajuste de parâmetros para aproximar o modelo aos dados de teste do fabricante.',
  },
  {
    title: 'Busca em catálogos',
    text: 'Mapeia projeto teórico em motores brushless e hélices reais a partir dos bancos do PyThrust.',
  },
  {
    title: 'OpenMDAO / MDO',
    text: 'Permite co-design multidisciplinar com objetivos e restrições de missão.',
  },
];

export const roadmap = [
  {
    title: 'Motor AAR',
    text: 'Criado em TypeScript como função pura para eventos, pausa, fila e bingo. O painel nativo já consome esse motor.',
  },
  {
    title: 'Visualização',
    text: 'UAV e AAR possuem cenas 3D próprias; a próxima etapa é substituir o iframe legado por componentes React completos.',
  },
  {
    title: 'Ponte PyThrust',
    text: 'Solver UAV separado do componente React, preparado para trocar a triagem aproximada por execução Python/OpenMDAO.',
  },
  {
    title: 'Missão combinada',
    text: 'Criada camada de ontologia para comparar AAR e UAV por energia, restrições e recomendações.',
  },
];
