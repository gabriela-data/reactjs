# Validação da integração — 23/11/2026

## Conteúdo integrado

- `main` no commit `27315cc`, com a integração ao backend feita por Davi.
- Correção de retorno da página 404, com destino e texto por sessão (#117).
- Idioma `pt-BR`, link de pular navegação e evidências responsivas (#118).
- Resolução do único conflito de conteúdo, em `src/pages/NotFound/index.jsx`.
- Padronização dos arquivos que não passavam no Prettier.
- Instruções do README alinhadas aos scripts, endpoints e bypass atuais.
- CI para PRs e pushes em `develop`/`main`, com instalação do lockfile, ESLint,
  Oxlint, Prettier e build. Revisão humana continua necessária.

Os commits originais foram preservados. O PR #110, de cadastro no fork do
colega, permanece separado: esta integração não modifica a branch dele nem
avalia sua aprovação como autorização para merge.

## Verificações locais

Node 22 e dependências do lockfile instalado no ambiente:

- `npm run lint`: aprovado.
- `npm run lint:fast`: aprovado.
- `npm run format:check`: aprovado.
- `npm run build`: aprovado.

## Regressão no navegador

Edge headless, build de produção servido por `npm run preview`. Todas as
chamadas de API foram interceptadas com dados de teste; nenhuma conta, senha ou
registro foi criado, alterado ou excluído no backend real.

| Cenário | Resultado |
| --- | --- |
| Visitante tenta acessar dashboard | Redirecionado ao login |
| Login com resposta `access_token` e papel `ADMIN` | Sessão normalizada e dashboard acessível |
| Reidratação da sessão | Navegação autenticada mantida após carregar a página |
| Primeiro Tab e Enter | Link visível e foco no conteúdo principal |
| 404 para visitante, admin e usuário | Texto e destino correspondentes à sessão |
| Criar usuário pela área administrativa | `POST /users` com `name`, `email`, `password` |
| Editar usuário | `PATCH /users/:id` com `name` e `email` |
| Excluir usuário | Confirmação, `DELETE /users/:id` e atualização da listagem |
| Usuário `USER` tenta acessar dashboard | Página de acesso negado |
| Atualizar o próprio perfil | `PATCH` e atualização dos dados persistidos da sessão |
| Logout | Token removido e retorno ao login |
| Cadastro público | `POST /users` e retorno ao login |
| Recuperação de senha | Solicitar código e enviar `token`/`password` para redefinição |
| Layout em 320, 768 e 1024px | Sem overflow horizontal da página; menu mobile funcional |

Não ocorreram exceções JavaScript nem chamadas para endpoints não previstos
nos cenários simulados.

## Limites e revisão

A simulação valida o comportamento do frontend e seus payloads; não comprova
CORS, entrega de e-mail ou funcionamento do backend em produção. O fluxo real
precisa ser confirmado com credenciais de teste autorizadas pela equipe.

As issues #92, #93 e #94 não devem ser encerradas automaticamente por esta
sincronização: acessibilidade e estados de interface têm critérios além dos
cenários aqui descritos. O CI e a aprovação de outro membro devem ser
conferidos no PR antes do merge.
