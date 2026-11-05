# Problema, propósito e relação com os ODS

## Visão geral

O **Alerta do Bairro** é um MVP de colaboração comunitária para registrar ocorrências, visualizar avisos recentes em um mapa e receber alertas dentro de um raio configurável. O produto busca reduzir a fragmentação da informação local, hoje espalhada entre conversas, grupos de mensagens e relatos informais.

O aplicativo é um canal informativo e preventivo. Ele **não substitui boletim de ocorrência, atendimento de emergência ou investigação policial**. Em uma emergência, a orientação continua sendo procurar os canais oficiais, como o telefone 190.

## Problema observado

Moradores nem sempre conseguem descobrir, de forma rápida e organizada, quais ocorrências foram relatadas perto de onde vivem. A informação pode chegar tarde, sem localização clara ou apenas a quem participa de determinados grupos. Isso dificulta a percepção situacional e a adoção de cuidados cotidianos.

### Causas consideradas

- informações locais dispersas em canais privados e conversas informais;
- ausência de uma visualização geográfica simples;
- dificuldade para separar relatos próximos de relatos distantes;
- baixa padronização dos registros;
- barreiras digitais, de acessibilidade e de conectividade;
- receio de exposição de vítimas ou acusação indevida de pessoas.

### Consequências

- moradores podem receber avisos tarde demais ou sem contexto de distância;
- pessoas fora de grupos privados têm menos acesso à informação comunitária;
- relatos vagos podem gerar medo, boatos ou estigmatização de lugares e grupos;
- regiões com poucos usuários podem parecer, incorretamente, mais seguras;
- pessoas com deficiência, baixa familiaridade digital ou internet limitada podem ficar excluídas.

## Resposta proposta pelo MVP

O MVP oferece:

- autenticação simples;
- registro estruturado de ocorrência por tipo, referência, bairro, data, hora e ponto aproximado;
- mapa e lista textual com ocorrências dos últimos sete dias;
- cálculo de distância entre a localização-base do usuário e a ocorrência;
- alertas no aplicativo dentro de um raio configurável de 0,5 a 10 km;
- ausência de campos para nome, foto ou características físicas de vítimas e suspeitos;
- aviso permanente de que poucos registros não significam que uma área é segura.

Notificações com o aplicativo fechado, moderação, recuperação de senha e integração com órgãos públicos não fazem parte desta versão.

## Público afetado

O público principal é composto por moradores que desejam compartilhar e consultar avisos sobre sua região. O problema também afeta pessoas que dependem de tecnologia assistiva, idosos, usuários com baixa familiaridade digital, comunidades com conectividade limitada e pessoas sem acesso individual a um celular.

O acesso digital não deve ser confundido com inclusão: possuir um celular não garante que a interface, a linguagem, a conexão ou o modelo de participação sejam acessíveis.

## Alinhamento com os Objetivos de Desenvolvimento Sustentável

O alinhamento abaixo representa uma **contribuição potencial**, e não a comprovação de impacto social. O impacto deverá ser medido com testes, entrevistas e indicadores.

| ODS e meta relacionada | Relação com o projeto | Limite da contribuição |
|---|---|---|
| **ODS 11 — Cidades e Comunidades Sustentáveis**, especialmente as metas 11.3 e 11.7 | Organiza informação comunitária georreferenciada e incentiva participação local, com atenção a espaços mais seguros, inclusivos e acessíveis. | O aplicativo não executa políticas de segurança nem comprova que um local é seguro. |
| **ODS 16 — Paz, Justiça e Instituições Eficazes**, especialmente as metas 16.1, 16.7 e 16.10 | Pode apoiar acesso à informação, participação comunitária e prevenção, desde que os relatos sejam responsáveis e não discriminatórios. | Não é canal oficial, não produz prova, não investiga fatos e não substitui instituições públicas. |
| **ODS 10 — Redução das Desigualdades**, especialmente as metas 10.2 e 10.3 | O mapeamento de barreiras orienta acessibilidade, linguagem simples e alternativas para diferentes condições de uso. | A versão atual ainda depende de internet, dispositivo compatível e português escrito. |

As descrições e metas foram consultadas nas páginas oficiais da ONU Brasil: [ODS 11](https://brasil.un.org/pt-br/sdgs/11), [ODS 16](https://brasil.un.org/pt-br/sdgs/16) e [ODS 10](https://brasil.un.org/pt-br/sdgs/10).

## Teoria de mudança resumida

| Etapa | Hipótese |
|---|---|
| **Entrada** | Moradores registram ocorrências recentes de forma estruturada e sem identificar pessoas. |
| **Atividade** | O sistema valida, armazena, calcula a distância e apresenta os registros em mapa e lista. |
| **Saída** | Usuários visualizam avisos recentes e próximos da localização configurada. |
| **Resultado esperado** | A comunidade encontra informação local com mais rapidez e contexto espacial. |
| **Impacto desejado** | Maior capacidade de prevenção e participação comunitária sem ampliar vigilância, discriminação ou exposição de pessoas. |

## Indicadores para validar o problema e a solução

### Uso e utilidade

- percentual de participantes que encontra um alerta próximo sem ajuda;
- tempo necessário para registrar uma ocorrência;
- percentual de alertas considerados claros e relevantes;
- retorno ao aplicativo ao longo de um período de teste;
- proporção de registros corrigidos, contestados ou removidos.

### Inclusão

- conclusão das tarefas somente por teclado;
- conclusão com leitor de tela;
- desempenho em celular de baixo custo e conexão limitada;
- compreensão dos textos por usuários com baixa familiaridade digital;
- participação por bairro sem transformar volume de registros em ranking de segurança.

### Segurança e ética

- quantidade de tentativas de inserir dados pessoais nos relatos;
- denúncias de conteúdo discriminatório ou falso;
- tempo de resposta da moderação, quando implementada;
- incidentes de exposição de localização residencial ou de vítimas.

## Hipóteses que ainda precisam de pesquisa

- moradores realmente desejam um canal separado dos grupos de mensagens;
- alertas no aplicativo são suficientes sem notificação em segundo plano;
- o raio entre 0,5 e 10 km representa a noção de proximidade dos diferentes territórios;
- o período de sete dias é útil sem incentivar interpretações erradas sobre segurança;
- a lista textual atende quem não consegue ou não deseja usar o mapa;
- usuários entendem que os registros são comunitários e não confirmados por autoridade pública.

## Critério de sucesso responsável

O projeto não deve ser avaliado pela quantidade bruta de ocorrências registradas. Sucesso significa entregar informação compreensível, próxima e útil, com baixa exposição de dados, acesso inclusivo e mecanismos para reduzir abuso. Se o produto aumentar medo, vigilância, acusação ou exclusão, o volume de uso não representa sucesso.
