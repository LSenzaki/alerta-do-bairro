# Priorização do MVP

| Essencial agora | Importante depois | Fora do escopo |
|---|---|---|
| Login simples e sessão | Notificação push | Foto ou descrição de suspeitos |
| Mapa e lista dos últimos 7 dias | Moderação de usuários | Integração oficial com a polícia |
| Registro: tipo, referência, horário e ponto | Estatísticas por horário e dia | Chat entre moradores |
| Alertas no app por raio de 0,5 a 10 km | Recuperação de senha por e-mail | Acusação ou identificação de pessoas |

## Critérios de pronto

- Todo campo tem rótulo e a navegação por teclado funciona.
- A interface usa linguagem simples e funciona em celular.
- Não são coletados nome, foto ou descrição de suspeitos.
- O aviso “Poucos registros não significa área segura” permanece visível.
- O mapa e a lista carregam somente os últimos 7 dias.

## Corte consciente

O alerta desta versão aparece quando a pessoa abre o aplicativo. Push em segundo plano exige service worker, permissão do navegador e infraestrutura de entrega, por isso fica para a etapa seguinte.
