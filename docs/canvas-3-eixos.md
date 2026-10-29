# Canvas de Arquitetura nos 3 Eixos

## Computação

- **Produto:** aplicação web responsiva.
- **Stack:** React + TypeScript no frontend; FastAPI + SQLite no backend; Leaflet e OpenStreetMap no mapa.
- **Entrada:** login, tipo, referência, bairro, data/hora e ponto aproximado.
- **Processamento:** validação, persistência e distância geográfica pela fórmula de Haversine.
- **Saída:** mapa, lista dos últimos 7 dias e alertas dentro do raio configurado.
- **Corte do MVP:** sem push, chat, imagens ou integração oficial com a polícia.

## Sociedade

- **Usuário primário:** morador que hoje depende de boca a boca e grupos dispersos para saber o que acontece perto de casa.
- **Acessibilidade:** rótulos visíveis, teclado, contraste, fonte legível e alternativa textual ao mapa.
- **Risco ético:** perfilamento, acusação e exposição de vítimas ou suspeitos.
- **Salvaguarda:** não existem campos para nome, característica física ou foto de pessoas.
- **Viés:** regiões com menos usuários podem parecer mais seguras; por isso o produto mostra que poucos registros não significam área segura.

## Meio ambiente

- Registros usam apenas texto e coordenadas; não há upload de arquivos.
- A consulta fica limitada aos últimos 7 dias.
- O frontend carrega o mapa sob demanda durante o uso, sem aplicativo nativo para instalar.
- SQLite evita infraestrutura adicional no MVP.
