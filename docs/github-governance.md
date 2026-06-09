# Governança do GitHub

Este documento descreve a configuração recomendada para proteger a branch `main` do repositório `FelipeLelis/aar`.

## Objetivo

- Permitir issues e pull requests de colaboradores externos.
- Permitir forks.
- Impedir que terceiros façam merge ou push direto na `main`.
- Garantir que Felipe Lelis seja o responsável final por merges na branch principal.

## Arquivos versionados

- `.github/CODEOWNERS`: define `@FelipeLelis` como responsável por todo o código.
- `.github/PULL_REQUEST_TEMPLATE.md`: orienta PRs.
- `.github/ISSUE_TEMPLATE/`: padroniza issues.
- `CONTRIBUTING.md`: explica o fluxo de contribuição.
- `SECURITY.md`: orienta reporte de problemas sensíveis.

## Configuração recomendada no GitHub

Em `Settings > Branches > Branch protection rules`, crie uma regra para:

```text
main
```

Ative:

- Require a pull request before merging.
- Require approvals.
- Require review from Code Owners.
- Dismiss stale pull request approvals when new commits are pushed.
- Require status checks to pass before merging.
- Require branches to be up to date before merging.
- Require conversation resolution before merging.
- Restrict who can push to matching branches.
- Do not allow bypassing the above settings.

Em `Restrict who can push to matching branches`, adicione apenas:

```text
FelipeLelis
```

## Permissões do repositório

Em `Settings > Collaborators and teams`:

- Não conceda acesso `Write`, `Maintain` ou `Admin` para pessoas que não devam fazer merge.
- Contribuidores externos devem usar fork + pull request.

## Observação importante

O arquivo `CODEOWNERS` sozinho não bloqueia merges. Ele só passa a ser obrigatório quando a proteção da branch exige revisão de Code Owner.
