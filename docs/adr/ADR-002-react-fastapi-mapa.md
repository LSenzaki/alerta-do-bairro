# ADR-002: React, FastAPI e mapa no MVP

| Data | Squad | Status |
|---|---|---|
| 29/10/2026 | Alerta do Bairro | Aceito |

## Contexto

O protótipo inicial usava Flask e uma página estática. O novo escopo exige login, mapa interativo, criação de ocorrências sem recarregar a página e alertas calculados pela distância do morador.

## Decisão

Separar o produto em frontend React + TypeScript e API FastAPI, mantendo SQLite no MVP. Usar OpenStreetMap por meio do Leaflet e calcular distâncias no backend com a fórmula de Haversine.

Os alertas desta versão aparecem dentro do aplicativo. Notificações push ficam para uma evolução posterior porque exigem permissão do navegador, service worker e infraestrutura de entrega.

## Impacto nos 3 eixos

- **Computação:** interface e API podem evoluir separadamente; o contrato OpenAPI é gerado automaticamente.
- **Sociedade:** o mapa melhora a compreensão espacial, mas preservamos lista textual, rótulos e alto contraste.
- **Meio Ambiente:** são carregados somente os registros dos últimos 7 dias; não há upload de imagens.

## Como saberemos que erramos

Se o mapa consumir dados demais em conexões móveis, a lista deverá virar a visualização padrão. Se entrevistas mostrarem necessidade de aviso com o app fechado, revisaremos o corte de push.
