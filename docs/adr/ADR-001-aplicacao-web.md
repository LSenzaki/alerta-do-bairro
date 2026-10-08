# ADR-001: Aplicação web em vez de app nativo

| Data | Squad | Status |
|---|---|---|
| _preencher_ | _preencher_ | Aceito |

## Contexto
O board do projeto descreve o produto como "aplicativo", mas o mapa de inclusão mostra usuários com celular simples, pouca familiaridade com instalar apps (morador idoso) e conexão instável. Precisamos decidir a plataforma antes de escrever código.

## Decisão
Construir uma aplicação web responsiva, acessada por link no navegador do celular.

## Alternativas consideradas
| Opção | Por que não |
|---|---|
| A: App nativo Android | Exige instalação e espaço no aparelho, deixa usuários de iPhone de fora e é mais lento de desenvolver no semestre |
| B: Bot de WhatsApp | Depende da API paga da Meta, pouco controle sobre os dados e risco de bloqueio do número |

## Impacto nos 3 eixos
- **Computação:** um único código, deploy simples, qualquer integrante consegue rodar localmente.
- **Sociedade:** abre em qualquer celular com navegador e pode ser compartilhado por link no próprio grupo de WhatsApp do bairro. HTML semântico facilita o uso com leitor de tela.
- **Meio Ambiente:** nenhum download de app; páginas de poucos KB, sem fontes ou bibliotecas externas.

## Como saberemos que erramos
Se nas entrevistas ou nos testes os moradores disserem que só usariam o produto com alerta push no celular, ou se poucos voltarem à página por falta de um aviso ativo.
