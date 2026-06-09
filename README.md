# AAR + UAV Simulation System

Sistema web para estudar missões aéreas envolvendo **reabastecimento em voo** e **análise de propulsão elétrica para UAVs**.

O projeto combina um simulador AAR em ciranda com um módulo UAV inspirado no PyThrust, criando uma base única para analisar energia, fila, autonomia, empuxo, restrições operacionais e cenários de missão.

> Autor: [Felipe Lelis](https://github.com/FelipeLelis/aar)  
> Projeto derivado de [YgorLog/sim-aar](https://github.com/YgorLog/sim-aar) e [Setuav/PyThrust](https://github.com/Setuav/PyThrust).

---

## Visão Geral

O sistema nasceu como um simulador de **AAR - Air-to-Air Refueling**. Nesse modelo, uma aeronave reabastecedora atende múltiplas aeronaves, uma por vez, enquanto as demais aguardam consumindo combustível.

A reabastecedora possui dois reservatórios:

- **Pod**: grande reserva de combustível.
- **Asa**: tanque dispensador que entrega combustível para a aeronave em atendimento.

Dois fluxos governam a operação:

- **X**: pod -> asa.
- **Y**: asa -> aeronave.

Quando `Y > X`, a asa esvazia mais rápido do que o pod consegue recompor. O procedimento pode pausar até a asa se recuperar, e é nessa espera que as aeronaves em fila continuam consumindo combustível e podem cruzar o limite operacional de **bingo fuel**.

O projeto evoluiu para também estudar **UAVs**, integrando conceitos de propulsão elétrica, autonomia, motor, hélice, bateria e restrições de missão.

---

## Principais Recursos

- Simulação AAR em ciranda com fila, pausa, retomada e bingo fuel.
- Motor AAR em TypeScript como função pura para eventos e análise incremental.
- Simulador legado AAR preservado enquanto a migração para React avança.
- Módulo UAV com solver aproximado para triagem de motor, hélice, bateria e autonomia.
- Visualizações SVG para ranking de combinações UAV.
- Cena 3D animada para UAV com rotores, hover e coluna de empuxo.
- Painel AAR nativo com cena 3D, níveis de pod/asa e timeline de eventos.
- Camada de ontologia para comparar AAR e UAV por energia, restrições e recomendações.
- Painel de missão combinada.
- Estrutura Next.js pronta para deploy na Vercel.
- Templates de issue, pull request, CODEOWNERS e guia de governança.

---

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Console principal, módulos, missão combinada, ontologia e roadmap |
| `/simulador/` | Módulo AAR com painel nativo e simulador legado |
| `/uav/` | Módulo UAV / PyThrust com solver, gráficos e cena 3D |

---

## Arquitetura

```text
src/
  app/                 Rotas Next.js
  components/          Componentes React de interface
  data/                Catálogos, cenários e dados de plataforma
  domain/              Regras de negócio e solvers puros
public/
  simulador-aar.html   Simulador AAR legado embarcado
docs/
  *.md                 Notas técnicas e governança
pythrust/
  ...                  Base PyThrust derivada para evolução UAV/MDO
tests/
  domain/              Smoke tests de domínio
```

### Camada de domínio

| Arquivo | Responsabilidade |
|---|---|
| `src/domain/aarEngine.ts` | Simulação AAR: eventos, fila, pausa, transferência e bingo |
| `src/domain/uavSolver.ts` | Solver UAV aproximado para triagem rápida |
| `src/domain/ontology.ts` | Vocabulário comum de missão, energia e restrições |
| `src/domain/combinedMission.ts` | Síntese AAR + UAV sob a mesma ontologia |

---

## Rodando Localmente

Instale as dependências:

```bash
npm install
```

Rode em desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

---

## Testes

O projeto possui um teste mínimo de domínio que não depende do Next:

```bash
npm test
```

Esse teste cobre cenários essenciais do motor AAR enquanto a suíte formal TypeScript ainda está sendo estruturada.

---

## Build e Deploy

Build de produção:

```bash
npm run build
```

Preview do export estático:

```bash
npm run preview
```

O projeto está configurado para Vercel com:

- `next.config.mjs`
- `vercel.json`
- `output: 'export'`

---

## Integração com PyThrust

O módulo UAV é inspirado no [Setuav/PyThrust](https://github.com/Setuav/PyThrust), uma estrutura open-source para análise, projeto conjunto e otimização de parâmetros de sistemas de propulsão elétrica em UAVs.

No estado atual:

- O solver UAV no browser faz triagem aproximada.
- O catálogo reduzido permite comparar combinações de motor e hélice.
- A arquitetura já separa solver e interface.

Próximo passo técnico:

- Criar uma ponte Python/API para executar rotinas PyThrust/OpenMDAO completas fora do browser.

---

## Roadmap Técnico

- Migrar gradualmente o simulador AAR legado para componentes React nativos.
- Conectar controles do AAR diretamente ao `aarEngine.ts`.
- Expandir os testes unitários para AAR, UAV e missão combinada.
- Integrar PyThrust real via Python/API.
- Evoluir a missão combinada para cenários salvos e relatórios.
- Melhorar visualizações 3D e playback operacional.

Detalhes em [docs/proximas-extracoes.md](docs/proximas-extracoes.md).

---

## Governança

O repositório inclui:

- `CODEOWNERS`
- templates de issue
- template de pull request
- `CONTRIBUTING.md`
- `SECURITY.md`

Para proteger a branch `main`, aplique a regra descrita em:

[docs/github-governance.md](docs/github-governance.md)

Resumo recomendado:

- exigir pull request antes de merge;
- exigir aprovação;
- exigir review de Code Owner;
- restringir push na `main` a `FelipeLelis`;
- impedir bypass das regras.

---

## Créditos

Este projeto é autoral de **Felipe Lelis** e deriva de estudos e bases abertas:

- [YgorLog/sim-aar](https://github.com/YgorLog/sim-aar)
- [Setuav/PyThrust](https://github.com/Setuav/PyThrust)

O objetivo é unir simulação operacional, engenharia aeroespacial, visualização interativa e otimização de sistemas UAV em uma plataforma web moderna.
