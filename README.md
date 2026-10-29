# Alerta do Bairro

Aplicação web comunitária para registrar ocorrências, visualizar avisos no mapa e configurar alertas por distância. O MVP usa **React + TypeScript** no frontend, **FastAPI + SQLite** no backend e foi pensado primeiro para celulares.

> Poucos registros não significa área segura. Os avisos são enviados pela própria comunidade e não substituem um boletim de ocorrência.

## O que já funciona

- login simples; no primeiro acesso a conta é criada automaticamente;
- mapa com ocorrências dos últimos 7 dias e distância até o morador;
- registro com tipo, referência, horário e ponto aproximado no mapa;
- alertas dentro do aplicativo com raio entre 0,5 e 10 km;
- sessão protegida por token e senha armazenada com hash PBKDF2;
- layout responsivo e navegação por teclado;
- nenhum campo de foto ou descrição de pessoas.

Notificação push em segundo plano e moderação são evoluções futuras, não fazem parte deste MVP.

## Como rodar

Requisitos: Python 3.10+ e Node.js 20+.

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

A API estará em `http://localhost:8000` e a documentação em `http://localhost:8000/docs`.

### 2. Frontend

Em outro terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Abra `http://localhost:5173`. Use qualquer e-mail e uma senha com ao menos 6 caracteres. A localização inicial aponta para o Centro de Curitiba; **Usar minha localização** pode substituí-la.

## Testes e build

```powershell
cd backend
python -m pytest -q

cd ..\frontend
npm.cmd run lint
npm.cmd run build
```

## Estrutura

```text
backend/
  app/             API FastAPI, distância e persistência SQLite
  tests/           teste do fluxo completo da API
frontend/
  src/             React, mapa, login, denúncias e alertas
docs/              decisões, escopo acadêmico e contrato da API
```

## Limites e segurança

- O aplicativo não substitui canais oficiais. Em emergência, ligue 190.
- Não há campos para nome, foto ou descrição de suspeitos.
- A posição marcada deve ser aproximada, sem expor o endereço de uma vítima.
- Alertas são exibidos somente quando o usuário abre o aplicativo.
