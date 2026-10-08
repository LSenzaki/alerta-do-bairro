# Canvas de Arquitetura nos 3 Eixos

## Eixo Computação: como isso funciona e o que custa manter?

**Tipo de produto:** [x] Aplicação web  [ ] Dashboard  [ ] App mobile  [ ] Bot  [ ] Automação  [ ] Outro

### Stack escolhida
- **Linguagem e framework:** Python + Flask, SQLite, HTML/CSS sem framework de front-end
- **Por que esta e não outra:** leve, roda na máquina de qualquer integrante sem instalar servidor de banco, curva de aprendizado baixa para entregar uma fatia vertical em 4 aulas.

### Dados
- **Fontes:** ocorrências enviadas pelos próprios moradores. Dados do FBSP (Anuário) e da SESP-PR usados só como contexto do problema, não dentro do app.
- **Formato e volume:** registros de texto curto (tipo, rua/referência, bairro, data/hora), poucos KB por registro.
- **Onde ficam armazenados:** arquivo SQLite no servidor da aplicação.

### As três caixas
| Entrada | → | Processamento | → | Saída |
|---|---|---|---|---|
| Formulário do morador: tipo de ocorrência, rua/referência, horário | | Valida os campos e agrupa por bairro | | Lista das ocorrências recentes do bairro |

---

## Eixo Sociedade: quem isso inclui e quem isso deixa de fora?

### Usuário primário (mapa da Aula 04)
- **Perfil:** Carlos, 35 anos, mecânico, morador de cidade pequena
- **Contexto de uso real:** usa o celular no trabalho e no dia a dia; hoje sabe de furtos pelo boca a boca e por grupos de WhatsApp
- **Dispositivo e conexão:** Android intermediário, internet móvel às vezes instável

### Dois requisitos de acessibilidade
1. Todo campo tem rótulo visível e associado, navegação completa por teclado, compatível com leitor de tela.
2. Linguagem simples, fonte grande e contraste mínimo de 4.5:1 (atende também o morador idoso).

### Risco ético (Aula 03)
- **Risco:** o app virar ferramenta de acusação e perfilamento, com descrição física ou foto de "suspeitos" alimentando preconceito e justiçamento.
- **Como o produto trata na prática:** não existe campo para descrever ou fotografar pessoas. Só tipo de ocorrência, local e horário.

### Viés mapeado (Aula 05)
- **Viés:** subnotificação. Bairros onde menos pessoas têm smartphone ou conhecem o app vão parecer mais seguros do que são.
- **Salvaguarda no produto:** aviso fixo na lista de ocorrências: "Poucos registros não significa área segura."

### Quem fica de fora (declarado)
Moradores de áreas rurais, ribeirinhos, aldeias indígenas e pessoas sem acesso a celular não são público do MVP (ver mapa de inclusão).

---

## Eixo Meio Ambiente: que recurso isso consome ou poupa?

### O que o produto consome
- **Processamento:** mínimo, só inserção e consulta simples no banco.
- **Armazenamento:** apenas texto, sem imagens.
- **Rede:** páginas de poucos KB, sem fontes externas, sem bibliotecas de mapa.

### Uma decisão de eficiência tomada agora
Lista em texto em vez de mapa, sem upload de fotos no MVP, e a lista mostra só os últimos 7 dias em vez de carregar o histórico inteiro.

### O que o produto evita gastar no mundo físico
Deslocamentos e ligações para descobrir o que aconteceu no bairro. Direciona o registro formal para o B.O. online (Delegacia Eletrônica) em vez da ida presencial, quando aplicável.
