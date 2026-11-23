# Validação de acessibilidade e responsividade

Contribuição às issues #92 e #94. A validação cobre a navegação inicial por
teclado e o layout integrado; não representa uma auditoria completa de
acessibilidade ou validação da integração com o backend.

## Alterações

- Idioma do documento alterado de `en` para `pt-BR`.
- Link “Pular para o conteúdo” como primeiro elemento focável do layout
  autenticado, visível ao receber foco.
- Destino `#conteudo-principal` no `main`, com `tabIndex={-1}` para receber foco
  sem entrar na ordem normal de Tab.

## Método

Edge headless via Playwright, usando `npm run build` e `npm run preview`.
Sessões de administrador e usuário foram simuladas em contextos isolados do
navegador. Consultas GET de usuários receberam respostas locais simuladas,
incluindo nomes e e-mails longos. Não foram enviados formulários, operações de
gravação ou requisições ao backend real.

## Navegação por teclado — #94

Validada em 390px e 1280px, com administrador em `/dashboard` e usuário comum
em `/perfil`:

1. O documento declara `lang="pt-BR"`.
2. O link fica visualmente oculto antes de receber foco.
3. O primeiro Tab revela e foca o link dentro da viewport.
4. Enter move o foco para o `main`, pulando Sidebar e Topbar.
5. O próximo Tab alcança um controle dentro do conteúdo principal.

Evidências: [desktop](issue-94-pular-conteudo-1280.png) e
[mobile](issue-94-pular-conteudo-390.png).

A issue #94 permanece parcial: não foram auditados todos os contrastes,
comportamentos de teclado ou labels ARIA, nem executado o Lighthouse.

## Mobile e tablet — #92

As sete rotas abaixo foram verificadas em **320, 360, 640, 641, 768 e 1024px**:

| Rota | Sem overflow horizontal da página | Menu responsivo |
| --- | --- | --- |
| `/dashboard` | OK | OK |
| `/usuarios` | OK | OK |
| `/usuarios/novo` | OK | OK |
| `/usuarios/2/editar` | OK | OK |
| `/perfil` | OK | OK |
| `/configuracoes` | OK | OK |
| `/403` | OK | OK |

- Abaixo de 768px, o menu iniciou recolhido, abriu e fechou pelo botão, com
  `aria-expanded` atualizado.
- A partir de 768px, a navegação lateral permaneceu visível.
- Na listagem de usuários, a tabela manteve o overflow dentro do próprio
  contêiner; o foco e a tecla Seta para a direita permitiram rolar horizontalmente.
- `/login`, `/cadastro`, `/recuperar-senha` e `/404` também foram verificadas em
  320, 640, 768 e 1024px sem overflow horizontal da página. Essas telas não foram
  alteradas e seus formulários não foram enviados.
- Não foram necessários ajustes adicionais de CSS nos cenários testados.
- Não ocorreram exceções JavaScript durante a validação.

Evidências da listagem: [360px](issue-92-usuarios-360.png),
[768px](issue-92-usuarios-768.png) e [1024px](issue-92-usuarios-1024.png).

## Verificações de código

- `npm run lint` aprovado.
- Prettier aprovado nos arquivos alterados.
- `npm run build` aprovado.
