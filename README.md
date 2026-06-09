# Simulador AAR — Reabastecimento em Voo

Ferramenta web para simular reabastecimento aéreo em ciranda: uma aeronave **reabastecedora** atende várias **reabastecidas**, modelando os fluxos pod→asa e asa→aeronave, o consumo em espera, os ciclos de pausa/retomada e a análise de threshold operacional.

O projeto agora está migrado para **Next.js** com App Router, paleta clara inspirada no ITA e uma primeira camada de integração com o **PyThrust** para evoluir de simulação AAR para um sistema único de análise AAR + UAV/MDO.

## Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview
```

O build Next está configurado com `output: 'export'` e gera a pasta `out/` para publicação estática.

## Deploy na Vercel

1. Suba este repositório para o GitHub.
2. Na Vercel, clique em **Add New Project** e importe o repositório.
3. A Vercel lerá o `vercel.json`:
   - Build Command: `npm run build`
   - Framework: `nextjs`
4. Publique.

## Como abrir

Rode `npm run dev`. A página principal apresenta o console integrado AAR + UAV; a rota **`/simulador`** abre diretamente o módulo AAR.

> O estado é guardado apenas na sessão do navegador (`sessionStorage`) e descartado ao fechar a aba — nada é gravado em servidor.

## Estrutura do repositório

| Caminho | O quê |
|---|---|
| `src/app/` | Rotas Next.js (`/` e `/simulador`) |
| `src/components/` | Componentes React do sistema |
| `src/data/platform.ts` | Dados da visão AAR + UAV/PyThrust |
| `public/simulador-aar.html` | Superfície atual do módulo AAR enquanto o motor é extraído para TypeScript |
| `simulador_aar.html` | Cópia standalone da aplicação original evoluída |
| `pythrust/` | Projeto PyThrust para futura ponte Python/MDO |
| `scripts/dev-server.mjs` | Preview local de export estático (`out/`) |
| `vercel.json` | Configuração de build/deploy na Vercel |
| `README.md` | Este guia do usuário |

## Integração AAR + PyThrust

A primeira etapa da união dos projetos cria um sistema comum:

- **AAR Engine**: simula reabastecimento em ciranda, pausas, bingo fuel, threshold e ontologia operacional.
- **PyThrust**: mantido em `pythrust/` para análise de propulsão elétrica, calibração, busca em bancos de motores/hélices e MDO com OpenMDAO.
- **Próxima extração**: mover o motor de simulação do HTML para módulos TypeScript testáveis e criar uma ponte Python/API para executar rotinas PyThrust.

---

## 1. Visão geral

Uma **aeronave reabastecedora** atende **N aeronaves reabastecidas** (1–20) em ciranda: uma é atendida por vez, as demais aguardam consumindo combustível.

A reabastecedora tem dois compartimentos:

- **Pod** — reservatório de grande capacidade.
- **Asa** — tanque dispensador, do qual o combustível é entregue à aeronave atendida.

Dois fluxos governam o sistema:

- **X** — pod → asa (interno à reabastecedora).
- **Y** — asa → aeronave reabastecida.

Quando `Y > X`, a asa esvazia mais rápido do que o pod a realimenta. O procedimento externo pausa quando a asa cai abaixo de um limiar e retoma quando volta a uma margem maior (histerese).

A interface tem duas abas: **Introdução** (visão geral, como operar e as fórmulas) e **Simulador** (a ferramenta). Na primeira visita da sessão o app abre na Introdução; depois, vai direto ao Simulador.

No Simulador, os painéis são numerados e **começam recolhidos** — clique no título para expandir.

### Ordem do planejamento na interface

1. **Aeronaves Reabastecidas** — necessidade da missão.
2. **Aeronave Reabastecedora** — primeiro as unidades, depois (a) plataforma fixa, depois (b) combustível embarcado.
3. **Cenários** — carregar um cenário de exemplo pronto ou salvar/carregar `.json` (ver seção 7).
4. **Parâmetros de Simulação** — dt, tempo máximo, política de fila; e os botões **Executar** e **Analisar Threshold**.

---

## 2. Unidades e densidade

Internamente tudo é convertido para **kg + kg/min**.

- Massa/volume: kg, lb, L, gal (US).
- Fluxo: {kg, lb, L, gal} × {/min, /h}.
- Densidade ρ (kg/L): necessária para qualquer conversão envolvendo L ou gal. Padrão 0,804 (Jet A-1 a 15 °C).

Cada bloco tem suas próprias unidades, independentes entre si:

- **Reabastecedora** — um par (massa + fluxo) para pod, asa, capacidade, X, Y e limiares.
- **Bingo fuel** — unidade própria de massa/volume.
- **Reabastecidas** — no modo *uniforme*, um par para toda a frota; no modo *por aeronave*, cada aeronave tem o seu.
- **Gráfico** — unidade de exibição independente das de entrada.

---

## 3. Campos de entrada

### 3.1 Reabastecidas

| Campo | Significado |
|---|---|
| Quantidade | Número de aeronaves a atender (1–20) |
| Comb. inicial | Combustível em cada aeronave em t = 0 |
| Comb. alvo | Combustível desejado ao fim do atendimento |
| Consumo em espera | Taxa de queima quando aguardando ou em voo livre |
| Consumo em contato | Taxa de queima durante o reabastecimento |
| Bingo fuel | Combustível mínimo operacional; se uma aeronave em espera cair abaixo, a missão falha |

**Modos de configuração**

- *Uniforme* — combustível inicial, alvo, consumos e o par de unidades são únicos para toda a frota.
- *Por aeronave* — cada aeronave tem seus próprios valores e unidades. Usado em frotas mistas (ex.: A1, A2 em lb/h; A3 em L; A4 em gal/h).

### 3.2 Tolerância de espera pós-reabastecimento

Após atingir o alvo, uma aeronave continua voando em espera enquanto as demais são atendidas, consumindo combustível. Em missões longas isso pode levá-la abaixo de um limite aceitável e exigir um novo encaixe (topup).

| Campo | Significado |
|---|---|
| Checkbox de ativação | Quando desligada, aeronaves concluídas não consomem e nunca reentram |
| Modo do limite | *Por consumo desde a conclusão* (dispara se consumir mais que esse valor após concluir) ou *Por combustível absoluto* (dispara se o combustível cair abaixo desse nível) |
| Valor do limite | Quantidade na unidade de massa da aeronave (uniforme para a frota ou por aeronave) |

Quando ativada, aeronaves concluídas continuam consumindo. Ao cruzar o limite, voltam à fila e disputam a próxima vaga segundo a política configurada.

### 3.3 Reabastecedora

**(a) Plataforma fixa** — propriedades do reabastecedor, raramente mudam entre missões.

| Campo | Significado |
|---|---|
| Fluxo X | Taxa de transferência pod → asa |
| Fluxo Y | Taxa de transferência asa → aeronave reabastecida |
| Capacidade máx. asa | Limite superior da asa; a transferência pod→asa pausa quando enche |
| Limiar pausa | Nível da asa abaixo do qual o procedimento externo pausa |
| Margem retomada | Nível da asa que precisa ser atingido para retomar o procedimento externo |
| Consumo da reabastecedora | Combustível que a própria reabastecedora queima em voo, por unidade de tempo. Drenado da asa a cada passo (o motor alimenta-se da asa; o pod não alimenta o motor). Padrão 0 (ignora). Ver Fase 0 (seção 4.0) |

Restrição: `Margem retomada > Limiar pausa`. A diferença cria a histerese que evita oscilação rápida.

**(b) Combustível embarcado nesta missão**

| Campo | Significado |
|---|---|
| Comb. pod inicial | Combustível no pod em t = 0 |
| Comb. asa inicial | Combustível na asa em t = 0 |

Podem ser preenchidos pelo botão **Sugerir combustível** (seção 6).

### 3.4 Simulação

| Campo | Significado |
|---|---|
| Passo dt | Resolução temporal. Menor dt = mais preciso. Padrão 0,5 min |
| Tempo máx. | Limite superior da simulação. Se atingido sem conclusão, falha por tempo |
| Política de fila | Ordem de seleção da próxima aeronave quando a reabastecedora fica livre. Ver seção 4.5 |

---

## 4. Modelo de cálculo

A cada passo `dt`, executam-se as fases abaixo, nesta ordem. A Fase 0 só atua quando há consumo da reabastecedora configurado.

### 4.0 Fase 0 — Consumo da reabastecedora

```
b = consumo_reabastecedora · dt
Asa ← max(0, Asa − b)   (o motor alimenta-se da asa; o pod não alimenta o motor)
```

Representa o combustível que a própria aeronave-tanque queima para voar — e o motor consome da **asa**, não do pod (o pod só realimenta a asa pela Fase 1). Quando o consumo é 0 (padrão), esta fase não altera nada. Modelá-lo evita superestimar o combustível disponível para offload em missões longas.

### 4.1 Fase 1 — Pod → Asa

```
ΔPA = min(X · dt, Pod, AsaMax − Asa)
Pod ← Pod − ΔPA
Asa ← Asa + ΔPA
```

Limitada pela taxa X, pelo combustível disponível no pod e pelo espaço livre na asa.

### 4.2 Fase 2 — Gestão da fila e da pausa

**Sem aeronave em atendimento** e fila não-vazia:
- Inicia atendimento da próxima aeronave se `Asa ≥ Margem retomada`.

**Com aeronave em atendimento:**
- Se `Asa ≤ Limiar pausa` → pausa.
- Se em pausa e `Asa ≥ Margem retomada` → retoma.

### 4.3 Fase 3 — Asa → Aeronave atendida

Executada apenas se há aeronave em atendimento e o procedimento não está pausado.

```
ΔAR = min(Y · dt, Asa, Alvoᵢ − Combᵢ)
Asa  ← Asa − ΔAR
Combᵢ ← Combᵢ + ΔAR
```

Quando `Combᵢ ≥ Alvoᵢ`, a aeronave passa ao estado **concluída** e a reabastecedora fica livre para o próximo ciclo.

### 4.4 Fase 4 — Consumo e gatilho de reentrada

Todas as aeronaves consomem a cada passo, com taxa que depende do estado:

```
cᵢ = consumo_contatoᵢ   se a aeronave está em atendimento
cᵢ = consumo_esperaᵢ    caso contrário (em espera ou concluída)

Combᵢ ← max(0, Combᵢ − cᵢ · dt)
```

Aeronaves concluídas também consomem — refletem a realidade de continuarem voando em espera.

Se a **tolerância** estiver ativada e a aeronave estiver concluída, verifica-se o gatilho:

```
limiteᵢ = Alvoᵢ − tolerânciaᵢ        (modo: por consumo desde a conclusão)
limiteᵢ = tolerânciaᵢ                (modo: por combustível absoluto)

se Combᵢ < limiteᵢ:
    aeronave volta à fila como em espera
    contador de reconexões += 1
```

### 4.5 Política de fila

Define qual aeronave é atendida quando a reabastecedora fica livre:

- **Ordem de chegada (reentradas no fim)** — a frota inicial é atendida na ordem A1, A2, …. Aeronaves que reentram via gatilho vão para o final, atrás das que ainda não foram atendidas. Determinística.
- **Menor combustível primeiro** — a próxima é a aeronave em espera com o menor combustível absoluto no momento, sem distinção entre primeira visita e reentrada.

### 4.6 Detecção de falhas

A simulação encerra em falha quando:

| Falha | Condição |
|---|---|
| Deadlock | `Pod ≈ 0` e `Asa < Margem retomada` e há aeronave em espera |
| Bingo fuel | Alguma aeronave que **não está recebendo combustível neste passo** com `Combᵢ < Bingo` |
| Tempo excedido | `t > t_max` sem todas concluídas |

A regra de bingo isenta apenas a aeronave que está **efetivamente sendo abastecida**. A aeronave conectada porém **em pausa** (queima combustível sem receber, enquanto a asa se recupera) está sujeita ao bingo como qualquer outra — situação crítica quando o fluxo X é muito menor que Y.

Encerra em **sucesso** quando todas as aeronaves estão concluídas simultaneamente. Com tolerância ativa, esse estado pode ser atingido, perdido e re-atingido várias vezes — só o estado final estável conta. (Observação: o critério de sucesso é o instante em que todas estão no alvo; com tolerância ligada, esse instante pode ser frágil — uma aeronave logo acima do limiar de reentrada poderia voltar à fila no passo seguinte.)

---

## 5. Saídas

### 5.1 Métricas

- **Tempo total** — instante final da simulação.
- **Pausas** — número de pausas do procedimento externo.
- **Reabastecidas concluídas** — quantas atingiram o alvo no estado final.
- **Tempo total pausado** — soma dos intervalos em pausa.
- **Reconexões pós-alvo** — total de reentradas disparadas pelo gatilho de tolerância.

### 5.2 Gráfico Combustível × Tempo

Usa **dois eixos verticais** para não comprimir as curvas: o pod (valores grandes) fica no **eixo direito**; asa, reabastecidas e linhas de referência no **eixo esquerdo**.

- Curva âmbar sólida: pod (eixo direito).
- Curva ciano preenchida: asa (eixo esquerdo).
- Curvas tracejadas: cada aeronave reabastecida (eixo esquerdo).
- Linhas horizontais: limiar de pausa, margem de retomada, bingo fuel.
- A **Visualização da Operação** (animação) aparece acima do gráfico.

### 5.3 Log de eventos

| Tipo | Significado |
|---|---|
| `start` | Início do primeiro reabastecimento de uma aeronave |
| `start-topup` | Reencaixe de uma aeronave já concluída |
| `pause` | Procedimento externo pausou por asa baixa |
| `resume` | Procedimento externo retomou |
| `complete` | Aeronave atingiu o alvo (em qualquer visita) |
| `topup` | Aeronave concluída cruzou a tolerância e voltou à fila |
| `deadlock` | Pod vazio com asa abaixo da margem |
| `bingo` | Alguma aeronave caiu abaixo do bingo fuel |

### 5.4 Playback

Animação da missão. Aeronaves em reentrada (visitas ≥ 2) aparecem com o marcador **↻**. Com tolerância ativa, o HUD superior mostra o contador acumulado de reconexões.

---

## 6. Sugestão de combustível da reabastecedora

O botão **Sugerir combustível**, no sub-bloco (b), preenche pod inicial e asa inicial a partir da necessidade configurada das aeronaves reabastecidas.

```
Para cada aeronave i:
  netᵢ       = max(0, Alvoᵢ − Inicialᵢ)             (entrega líquida necessária)
  efetivoᵢ   = Y − consumo_contatoᵢ                  (fluxo líquido de enchimento)
  t_contatoᵢ = netᵢ / efetivoᵢ                       (tempo de contato estimado)
  brutoᵢ     = netᵢ · Y / efetivoᵢ                   (combustível bruto que sai da reabastecedora para i)

demanda_total  = Σ brutoᵢ
tempo_estimado = Σ t_contatoᵢ

asa_sugerida = max(Margem retomada, 0,6 · Capacidade máx. asa)
pod_sugerido = demanda_total · (1 + folga) − asa_sugerida
```

A **folga (%)** é editável ao lado do botão — padrão 15%. Cobre pausas, reentradas por tolerância e arredondamentos. Quando a tolerância está ativa, considere 25–30%.

> A sugestão **não inclui** o consumo da própria reabastecedora (Fase 0). Se você configurou esse consumo, some à mão `consumo_reabastecedora · tempo_estimado` ao pod, ou aumente a folga proporcionalmente.

Avisos automáticos:
- Se `consumo_contatoᵢ ≥ Y` para alguma aeronave, ela nunca enche — o cálculo a ignora e exibe alerta.
- Se `Y ≤ 0`, a sugestão não roda.

A sugestão é apenas um ponto de partida — os campos podem ser editados livremente depois.

---

## 7. Cenários (salvar e carregar)

- **Cenários de exemplo** — biblioteca embutida (Nominal, No limite, Falha). Selecione no menu e o cenário é carregado e executado na hora; sirva como ponto de partida e edite à vontade.
- **Salvar (.json)** — gera download da configuração completa: unidades, modo, tolerância, política de fila, valores das aeronaves, fluxos e consumo da reabastecedora, combustível embarcado, parâmetros da simulação e folga da sugestão. Nome: `cenario-aar-<timestamp>.json`.
- **Carregar (.json)** — abre seletor de arquivo, repreenche todos os campos e executa a simulação.
- **Persistência por sessão** — a cada execução o estado é salvo no `sessionStorage` do navegador: ele é restaurado enquanto a aba permanece aberta e **é descartado ao fechar a aba**. Nada é gravado no servidor, e o estado não vaza entre usuários em uma máquina compartilhada.

Os arquivos JSON são portáveis e podem ser versionados para montar bibliotecas de cenários (ex.: `KC-390_caça_4x.json`).

---

## 8. Análise de threshold

O botão **Analisar Threshold** executa um *sweep* de `N = 1, 2, …, 20` aeronaves usando a configuração **uniforme** atual (painel 1, modo uniforme). Se você estiver no modo *por aeronave*, a varredura ignora a frota mista e usa os valores uniformes — um aviso é exibido nesse caso.

Para cada N, a frota recebe N aeronaves idênticas e a simulação roda **com o seu tempo máximo** (sem orçamento artificial por aeronave). O resultado é classificado em quatro estados:

| Estado | Cor | Significado |
|---|---|---|
| Viável no tempo | verde | Fecha dentro do `Tempo máx.` definido |
| Fecha além do tempo | âmbar | Fisicamente fecharia, mas só com mais tempo que o limite definido |
| Falha física | vermelho | Deadlock ou bingo — não fecha por mais tempo que se dê |
| Não converge | magenta | Oscila/trava sem terminar (ex.: chatter de pausa) |

A distinção *além do tempo* × *falha física* é feita rodando um segundo passo com teto generoso: assim, um "estouro de tempo" não é confundido com inviabilidade real.

Saídas:

- **Máx. aeronaves (no tempo)** — maior N tal que **todos** os valores de 1 a N são viáveis no tempo (maior bloco contínuo a partir de N=1, não um sucesso isolado).
- **Tempo @ máx** — duração da operação nesse N.
- **Limitante em N+1** — o que barra o próximo N (deadlock, bingo, excede tempo ou não converge).
- **Margem ao bingo @ máx** — menor folga de combustível (acima do bingo) atingida por aeronave fora de contato no N máximo. Indica quão "no fio" é a operação.
- **Reconexões @ máx** — total de reentradas por tolerância no N máximo.
- **Gráfico de barras N × Tempo** — colorido pelos quatro estados, com legenda.

Avisos automáticos: **não-monotonicidade** (quando existe N viável depois de um N inviável) e **margem ao bingo apertada** no N máximo.

Responde à pergunta: *dadas as condições de fluxo, bingo, consumo, tolerância e tempo, quantas aeronaves a operação suporta, em quanto tempo e com qual folga?*

---

## 9. Convenções e fatores de conversão

| De | Para | Fator |
|---|---|---|
| lb | kg | × 0,45359237 |
| L | kg | × ρ (densidade em kg/L) |
| gal (US) | L | × 3,785411784 |
| gal (US) | kg | × 3,785411784 · ρ |
| qualquer/h | qualquer/min | ÷ 60 |

Densidade típica a 15 °C de combustíveis aeronáuticos:

| Combustível | ρ (kg/L) |
|---|---|
| Jet A / Jet A-1 | 0,775–0,840 (nominal 0,804) |
| JP-8 | ~0,81 |
| JP-5 | ~0,82 |
| AVGAS 100LL | ~0,71 |
