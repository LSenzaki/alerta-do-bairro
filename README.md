# Alerta do Bairro

> **Se apenas o registro de uma ocorrência (tipo, rua e horário) e sua exibição para os moradores do mesmo bairro funcionar, nosso produto ainda resolve algo real para moradores que hoje dependem de boca a boca e de grupos de WhatsApp dispersos para saber o que acontece na rua deles.**

Aplicação web comunitária de avisos de furto e roubo para bairros. Projeto da disciplina **Computação, Sociedade e Meio Ambiente**.

## O que o produto faz hoje

Sprint 0: página inicial com o nome do produto, a frase de corte e o primeiro campo real do formulário de ocorrência ("Tipo de ocorrência"). O envio ainda não grava dados.

## Como rodar

Requisitos: Python 3.10+

```bash
cd src
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Abra http://localhost:5000 no navegador.

## Estrutura

```
docs/
  aulas/        Documentos das Aulas 01 a 05 (termo, ODS, ética, usuários, vieses, plano de pesquisa)
  adr/          Registros de decisão de arquitetura
  diario/       Diário de cada aula
  canvas-3-eixos.md
  priorizacao.md
  definition-of-done.md
src/            Código da aplicação (Flask + SQLite)
```

## Decisões registradas

- [ADR-001](docs/adr/ADR-001-aplicacao-web.md): Aplicação web em vez de app nativo

## Limitação declarada dos dados

As ocorrências são enviadas por moradores e dependem de quem tem celular e conhece o produto. **Poucos registros não significa área segura.**

## Equipe

| Membro | Responsabilidade nesta sprint |
|---|---|
| _nome_ | Repositório, estrutura e README |
| _nome_ | Página inicial com campo do formulário |
| _nome_ | Canvas dos 3 eixos e migração de documentos |
| _nome_ | ADR-001 e diário da aula |
