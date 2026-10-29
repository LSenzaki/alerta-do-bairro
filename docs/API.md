# Contrato da API do MVP

A especificação OpenAPI é gerada pelo FastAPI em `/openapi.json`; a documentação interativa fica em `/docs`. Todas as rotas abaixo, exceto login e saúde, exigem `Authorization: Bearer <token>`.

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/health` | Verificar se a API está disponível |
| `POST` | `/api/auth/login` | Entrar ou criar uma conta no primeiro acesso |
| `GET` | `/api/auth/me` | Recuperar o morador autenticado |
| `GET` | `/api/incidents` | Listar ocorrências dos últimos 7 dias |
| `POST` | `/api/incidents` | Registrar uma ocorrência |
| `GET` | `/api/alerts` | Listar ocorrências dentro do raio configurado |
| `GET` | `/api/alerts/settings` | Ler a configuração de distância |
| `PUT` | `/api/alerts/settings` | Atualizar localização-base e raio entre 0,5 e 10 km |

## Decisões de contrato

- O login cria a conta quando o e-mail ainda não existe (`account_created: true`) e valida a senha nos acessos seguintes.
- Ocorrências aceitam apenas campos estruturados; não há descrição livre de pessoas nem upload de imagem.
- `distance_km` usa a fórmula de Haversine a partir da localização-base do usuário.
- `GET /api/incidents` aceita `latitude`, `longitude` e `radius_km` opcionais.
- Validação retorna `422`; sessão ausente ou inválida retorna `401`.
- Dados de exemplo são inseridos apenas quando o banco está vazio.
