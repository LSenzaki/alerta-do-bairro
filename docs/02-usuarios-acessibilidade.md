# Usuários, inclusão e acessibilidade

## Origem do mapeamento

Este documento transforma em requisitos a captura **“Mapeamento de inclusão / Identificando as barreiras reais”**, fornecida em 05/11/2026, e confronta as propostas com o estado atual do MVP.

As personas são instrumentos de projeto, não descrições exatas de todas as pessoas de um grupo. Idade, deficiência, origem, território ou familiaridade digital não determinam sozinhos a capacidade de uso. As hipóteses devem ser validadas com participantes reais e consentimento adequado.

## Princípios de inclusão

- não excluir uma pessoa por idade, deficiência, origem, território ou condição econômica;
- oferecer conteúdo textual equivalente às informações do mapa;
- não depender apenas de cor, som, animação ou posição espacial;
- usar linguagem direta, controles previsíveis e alvos de toque adequados;
- permitir o uso sem geolocalização automática;
- considerar conexão lenta, aparelho simples e uso compartilhado;
- registrar como limitação tudo o que ainda não foi testado com tecnologia assistiva.

## Personas e barreiras

| Perfil da captura | Contexto e acesso | Barreira principal | Consequência se não for tratada | Resposta de projeto |
|---|---|---|---|---|
| **João, 10 anos, estudante do ensino fundamental** | Não possui celular nem acesso individual a tecnologia móvel. | Ausência de dispositivo e necessidade de proteção específica por ser criança. | Não acessa o aplicativo sozinho; um cadastro comum pode coletar dados sem salvaguardas adequadas. | Não direcionar o MVP a uso autônomo infantil. Pesquisar acesso mediado por responsável, escola ou ação comunitária antes de criar qualquer fluxo para menores. |
| **Dona Maria, 55 anos, pessoa com baixa visão e deficiência motora** | Usa celular com tecnologia assistiva. | Mapa, gestos de precisão, foco de teclado, tamanho dos controles e compatibilidade com leitor de tela. | Pode não conseguir navegar, selecionar um ponto ou concluir o registro. | Preservar lista textual; garantir nomes acessíveis, ordem e controle de foco; oferecer entrada textual para localização; testar com leitor de tela, teclado e ampliação. |
| **Carlos, 35 anos, mecânico em cidade pequena** | Usa celular diariamente e tem internet, mas vive em local com possível baixa adesão. | Pouca cobertura comunitária e menor densidade de registros. | O aplicativo pode não gerar alertas úteis ou criar falsa impressão de ausência de ocorrências. | Mostrar cobertura e incerteza; nunca classificar área como segura; permitir estratégias comunitárias de adesão sem ampliar artificialmente o raio. |
| **Morador idoso, 65 anos ou mais** | Usa principalmente mensagens e chamadas; pode ter pouca familiaridade com aplicativos. | Interface densa, textos pequenos, termos técnicos e etapas pouco claras. | Abandona o produto ou registra a ocorrência de modo incorreto. | Linguagem simples, fontes e alvos maiores, orientação passo a passo, confirmação antes de publicar e testes com idosos. |
| **Laura, 23 anos, moradora de cidade de médio porte** | Tem acesso digital, mas pouco interesse em tecnologia e redes sociais. | Falta de percepção de valor e baixa adesão. | Não retorna ao aplicativo e não contribui com registros. | Explicar benefício e limites já no primeiro uso; reduzir etapas; pesquisar canais de divulgação e motivos reais de retorno. |
| **Cunhã Poranga, 30 anos, pessoa indígena em local afastado** | Conectividade limitada e contexto cultural próprio. | Dependência de internet, mapa on-line, idioma português e ausência de adaptação cultural. | Não recebe alertas nem consegue registrar ocorrências; a comunidade permanece sub-representada. | Não excluir por identidade ou território. Realizar pesquisa participativa, avaliar tradução, modo de baixo consumo/offline e canais comunitários apropriados antes de afirmar atendimento. |

> A sugestão da captura de transformar o produto em jornal e a indicação de que a persona indígena não seria público-alvo não foram adotadas como decisões. Ambas exigem pesquisa. Uma limitação técnica atual deve gerar transparência e backlog, não exclusão automática.

## Estado atual da acessibilidade

### Implementado no MVP

- campos de formulário possuem rótulos textuais;
- botões apenas com ícone têm `aria-label` nos fluxos principais;
- erros de formulário usam `role="alert"`;
- confirmação de configuração usa `role="status"`;
- diálogos principais usam `role="dialog"` ou `role="alertdialog"`, título associado e `aria-modal`;
- o modal de registro fecha com a tecla `Escape`;
- cartões de alerta são botões e podem receber foco pelo teclado;
- a lista textual apresenta tipo, referência, bairro e distância sem depender do mapa;
- o layout se adapta a telas menores;
- a folha de estilos respeita `prefers-reduced-motion`;
- alerta novo combina popup visual, texto e som; o som não é o único meio de comunicação;
- o usuário pode continuar com uma localização de demonstração quando a geolocalização falha.

### Parcial ou ainda não validado

| Área | Situação observada | Risco |
|---|---|---|
| **Leitor de tela** | Há semântica básica, mas não existe evidência de teste com NVDA, VoiceOver ou TalkBack. | Elementos do Leaflet, marcadores e mudanças de contexto podem não ser anunciados corretamente. |
| **Foco em diálogos** | Os diálogos têm semântica, mas não movem, restringem e restauram o foco de forma explícita. | O foco pode permanecer atrás do modal. |
| **Seleção da localização** | O ponto da ocorrência é escolhido clicando no mapa. | Fluxo não equivalente para teclado, leitor de tela ou pessoa com dificuldade motora. |
| **Tamanho do texto** | Existem textos de aproximadamente `0.65rem` a `0.78rem`. | Leitura difícil para baixa visão e idosos. |
| **Contraste** | A paleta foi projetada visualmente, mas não há relatório de medição WCAG. | Textos pequenos e tons suaves podem falhar no contraste mínimo. |
| **Zoom e refluxo** | Há responsividade, porém não há teste registrado em zoom de 200% e 400%. | Conteúdo pode ficar oculto ou exigir rolagem em duas direções. |
| **Mapa** | A lista serve como alternativa parcial, mas não permite todas as ações do mapa. | Consultar é possível; definir um ponto sem mapa ainda não é. |
| **Som** | O navegador pode bloquear áudio antes de interação do usuário. | O aviso sonoro não é garantido e não deve ser tratado como mecanismo crítico. |
| **Conectividade** | O frontend, a API e os blocos do OpenStreetMap dependem de rede. | O produto não funciona de forma confiável offline ou em conexão instável. |
| **Idioma e cognição** | A interface está apenas em português e alguns conceitos dependem de letramento digital. | Exclusão linguística ou dificuldade de compreensão. |

## Requisitos de acessibilidade priorizados

### P0 — necessário antes de piloto público

- oferecer campos de latitude/longitude ou busca textual como alternativa à seleção no mapa;
- implementar gerenciamento de foco nos diálogos e gaveta de configurações;
- aumentar textos pequenos e validar alvos de toque;
- executar auditoria de contraste e corrigir combinações reprovadas;
- garantir nome, função, estado e operação por teclado para todos os controles;
- testar os fluxos de entrar, consultar, configurar raio e registrar ocorrência com leitor de tela;
- tornar explícito que os relatos são comunitários e não verificados por autoridade.

### P1 — necessário para ampliar inclusão

- testar zoom de 200% e 400%, orientação de tela e reflow;
- adicionar modo de baixo consumo de dados e estados claros quando os blocos do mapa não carregarem;
- simplificar textos e realizar teste de compreensão;
- permitir desativar som e animações nas preferências;
- fornecer ajuda contextual e confirmação resumida antes da publicação;
- avaliar autenticação que não dependa exclusivamente de e-mail individual.

### P2 — depende de pesquisa com comunidades

- modo offline com sincronização posterior;
- suporte a outros idiomas;
- canais mediados por escola, associação ou liderança comunitária;
- integração com SMS, WhatsApp ou boletim comunitário;
- fluxos específicos para menores somente após análise jurídica, ética e de consentimento.

## Roteiro mínimo de teste

Cada teste deve registrar dispositivo, navegador, tecnologia assistiva, tarefa, resultado, barreira e severidade.

1. Entrar ou criar conta sem usar o mouse.
2. Entender por que a localização é solicitada e continuar quando ela for negada.
3. Localizar um alerta próximo usando apenas a lista textual.
4. Abrir um alerta, ir ao item correspondente e dispensar o aviso.
5. Alterar o raio e compreender o valor escolhido.
6. Registrar uma ocorrência sem expor vítima, suspeito ou endereço residencial.
7. Corrigir erros e concluir a tarefa com leitor de tela.
8. Repetir as tarefas em zoom de 200%, tela pequena e conexão limitada.

## Critérios de aceite

- todas as tarefas essenciais são concluídas por teclado;
- o foco fica visível e segue ordem coerente;
- abrir e fechar um diálogo não perde o ponto de navegação;
- nenhuma informação depende somente de cor, som ou mapa;
- o conteúdo permanece utilizável com zoom de 200%;
- erros indicam o problema e como corrigi-lo;
- usuários de tecnologias assistivas conseguem concluir os quatro fluxos principais;
- limitações de conexão e cobertura são comunicadas sem culpar ou excluir o usuário.
