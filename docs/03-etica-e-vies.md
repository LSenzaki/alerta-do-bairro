# Ética, privacidade e vieses

## Objetivo

O Alerta do Bairro lida com localização e relatos de segurança. Mesmo sem usar inteligência artificial, o sistema pode produzir efeitos discriminatórios, ampliar medo, expor pessoas ou induzir conclusões falsas. Este documento define riscos, salvaguardas atuais e requisitos antes de um uso público.

## Princípios

- **não causar dano:** evitar exposição, perseguição, acusação e retaliação;
- **minimização:** coletar somente o necessário para o serviço;
- **finalidade:** usar dados apenas para autenticação, registro e alertas próximos;
- **transparência:** distinguir relato comunitário de informação confirmada;
- **contestabilidade:** permitir correção, denúncia e remoção de conteúdo;
- **inclusão:** não transformar baixa participação em ausência de risco;
- **segurança:** limitar acesso, retenção e divulgação de localizações;
- **responsabilidade humana:** decisões de moderação e encaminhamento não devem ser automatizadas sem revisão e recurso.

## Dados tratados no MVP

| Dado | Finalidade atual | Risco | Situação atual |
|---|---|---|---|
| Nome e e-mail | Identificar a conta | Identificação e contato indevido | Persistidos no SQLite. |
| Senha | Autenticação | Comprometimento de conta | Armazenada como hash PBKDF2 com salt; não é armazenada em texto puro. |
| Token de sessão | Manter acesso autenticado | Sequestro de sessão | Persistido no banco e no `localStorage`; não há expiração implementada. |
| Bairro e localização-base precisa | Personalizar distância dos alertas | Inferência de residência ou rotina | Persistidos por usuário; ainda não há política de retenção ou redução de precisão. |
| Tipo, referência, bairro, coordenadas e horário da ocorrência | Exibir relato e calcular distância | Exposição de vítima/local, estigma territorial ou relato falso | Persistidos sem fluxo de moderação ou contestação. |

O MVP **não deve ser descrito como plenamente adequado à LGPD** sem definição de controlador, base legal, avisos, direitos do titular, retenção, segurança operacional e processo de resposta a incidentes.

## Salvaguardas já presentes

- não há upload de imagem;
- não há campo para nome ou descrição de suspeitos;
- o formulário orienta a não informar nomes, características ou fotos de pessoas;
- a referência deve descrever um ponto aproximado, não o endereço de uma vítima;
- a interface informa que poucos registros não significam área segura;
- ocorrências exibidas são limitadas aos últimos sete dias;
- alertas consideram somente o raio configurado;
- acesso às rotas de dados exige sessão Bearer;
- senha é derivada com PBKDF2 e comparação resistente a timing;
- CORS é configurável e, por padrão, limitado ao frontend local.

Essas medidas reduzem riscos, mas não substituem moderação, política de privacidade, testes de segurança ou governança.

## Principais vieses

| Viés | Como aparece | Dano possível | Mitigação necessária |
|---|---|---|---|
| **Viés de participação** | Bairros com mais usuários geram mais registros. | Confundir volume de relatos com nível real de violência. | Exibir cobertura e tamanho da base; proibir ranking de “bairro mais seguro”; manter aviso de incerteza. |
| **Viés de acesso digital** | Pessoas sem celular, dados móveis, idioma ou habilidade digital participam menos. | Silenciamento de comunidades já sub-representadas. | Pesquisa inclusiva, baixo consumo de dados, alternativas mediadas e métricas de cobertura. |
| **Viés espacial** | O ponto registrado pode ser impreciso; o raio é distância em linha reta. | Alertas irrelevantes ou falsa sensação de precisão. | Exibir localização aproximada, explicar o cálculo e não inferir trajeto ou fronteira social. |
| **Viés de recência** | Apenas sete dias são exibidos. | Interpretar ausência recente como segurança permanente. | Explicar a janela temporal e evitar linguagem conclusiva. |
| **Viés de categoria** | Tipos predefinidos moldam o que pode ser relatado. | Forçar situações distintas em rótulos inadequados. | Revisar categorias com usuários e acompanhar uso de “Outro”. |
| **Viés de confirmação** | Usuários podem registrar ou notar fatos que reforçam crenças anteriores. | Estigmatização de ruas, bairros ou grupos. | Moderação, educação, contestação e proibição de descrições identitárias. |
| **Viés de disponibilidade** | Alertas recentes e sonoros parecem representar todo o risco. | Ansiedade e superestimação de perigo. | Controlar frequência, permitir silenciar e contextualizar que são relatos não verificados. |
| **Viés de denúncia maliciosa** | Um usuário pode publicar informação falsa ou retaliatória. | Assédio, pânico ou dano reputacional. | Denúncia de conteúdo, trilha de auditoria, limites de publicação e revisão humana. |

## Riscos éticos por cenário

### Perfilamento e discriminação

O tipo “Atividade suspeita” é especialmente sensível: sem critérios claros, pode reproduzir racismo, xenofobia, capacitismo e preconceito de classe. A aplicação não deve aceitar aparência, raça, etnia, nacionalidade, gênero, deficiência, vestimenta ou condição social como justificativa para marcar alguém como suspeito.

Antes de um piloto público, esse tipo deve ser removido ou substituído por categorias baseadas em **eventos observáveis**, revisadas com especialistas e comunidade.

### Exposição de localização

Uma referência ou coordenada exata pode revelar residência, rotina ou local de uma vítima. O produto deve:

- reduzir a precisão pública do ponto quando necessário;
- impedir texto com endereço residencial completo ou dados pessoais;
- separar localização-base privada do usuário de ocorrências públicas;
- definir retenção e exclusão;
- evitar exportação ou consulta em massa sem justificativa.

### Acusação e desinformação

Um relato comunitário não prova que o evento aconteceu nem identifica autoria. A interface deve exibir essa condição, oferecer contestação e impedir linguagem que apresente os dados como estatística oficial.

### Medo e fadiga de alertas

Som, popup e repetição podem causar ansiedade ou dessensibilização. Alertas devem ser configuráveis, dispensáveis, acessíveis e proporcionais. O usuário deve poder silenciar o som sem perder o aviso visual e textual.

### Uso indevido institucional ou comercial

Os dados não devem ser usados para policiamento preditivo, avaliação de imóveis, seguros, publicidade comportamental, vigilância de grupos ou classificação de pessoas e bairros. Qualquer integração futura exige nova avaliação de impacto e governança explícita.

## Lacunas antes de uso público

### Prioridade crítica

- moderação e denúncia de conteúdo;
- correção, contestação e remoção de registros;
- política de privacidade, termos e canal para direitos do titular;
- expiração e revogação de sessões;
- recuperação segura de conta;
- restrição de frequência e prevenção de abuso;
- logs de auditoria protegidos;
- redução da precisão da localização exibida;
- revisão ou remoção da categoria “Atividade suspeita”;
- plano de resposta a incidente de segurança.

### Governança necessária

- definir quem é responsável pelo serviço e pelos dados;
- documentar base legal, finalidade, retenção e compartilhamento;
- estabelecer regras públicas de moderação e prazo de resposta;
- criar mecanismo de recurso;
- revisar métricas para evitar incentivos à quantidade de denúncias;
- realizar avaliação de impacto à proteção de dados antes de ampliar o piloto.

## Métricas permitidas e métricas perigosas

### Úteis quando contextualizadas

- tempo para encontrar um aviso próximo;
- taxa de conclusão de tarefa;
- cobertura de usuários por território, apresentada de forma agregada;
- quantidade e motivo de contestações;
- tempo de moderação;
- incidentes de privacidade e segurança.

### Não usar como conclusão direta

- “bairro mais seguro” ou “bairro mais perigoso”;
- pontuação de risco de pessoa, grupo ou endereço;
- previsão de criminalidade baseada apenas nos relatos;
- desempenho de usuário pela quantidade de publicações;
- ranking público de denunciantes;
- inferência de presença policial ou valor imobiliário.

## Checklist para cada evolução

- [ ] A funcionalidade coleta algum dado novo? É indispensável?
- [ ] O usuário entende finalidade, visibilidade e retenção?
- [ ] Há risco de identificar vítima, suspeito ou residência?
- [ ] O recurso pode aumentar discriminação ou vigilância?
- [ ] Pessoas com menos acesso digital ficam sub-representadas?
- [ ] Existe alternativa acessível e não baseada somente em mapa, cor ou som?
- [ ] É possível contestar, corrigir e remover o resultado?
- [ ] A métrica mede utilidade ou apenas atividade?
- [ ] O comportamento foi testado contra abuso e publicação automatizada?
- [ ] Os limites do produto continuam visíveis?

## Condição para piloto

Um piloto deve ter escopo territorial e temporal limitado, participantes informados, moderação ativa, canal de suporte, plano de encerramento e avaliação de danos. A expansão só deve ocorrer se evidências mostrarem utilidade sem aumento relevante de exposição, discriminação, desinformação ou exclusão.
