# 🐾 CuidarVet — Frontend 
(React + Vite)

## Sobre o Projeto

Este repositório contém a aplicação **frontend** desenvolvida em **React JS** como parte do trabalho da disciplina de **Sistemas Web**. O projeto é desenvolvido em conjunto com outro grupo responsável pelo **backend em Node.js**, seguindo a arquitetura cliente-servidor com comunicação via API REST.

O objetivo é aplicar na prática os conceitos de:

- Componentização e gerenciamento de estado em React
- Consumo de APIs REST
- Roteamento SPA (Single Page Application)
- Boas práticas de organização de código frontend
- Integração entre equipes (frontend × backend)
- Prototipagem de UI/UX antes da implementação
- Padronização de ambiente de desenvolvimento entre membros da equipe

---

## Funcionalidades

- [x] Autenticação de usuários (login/cadastro) com JWT
- [x] CRUD de usuários
- [x] Listagem com paginação e filtros
- [x] Rotas protegidas por autenticação
- [x] Feedback visual (loading, toasts, erros)
- [x] Layout responsivo
- [x] Dashboard inicial e navegação da clínica
- [ ] Dashboard com gráficos (depende de endpoint de métricas)
- [ ] Modo escuro (planejado)

---

## Protótipos no Figma

Todos os protótipos de interface (UI/UX) do sistema foram desenvolvidos no **Figma** antes da implementação em React. Isso permite validar o fluxo de navegação, o layout e a experiência do usuário junto ao grupo de backend e aos stakeholders antes de partir para o código.

🔗 **Acesse o protótipo completo navegável:** [Clique aqui para abrir no Figma](https://www.figma.com/make/DOR2OQvmkfJ6au7zM4CWX4/Login-e-Cadastro-Veterin%C3%A1rio?t=8DK6f1eYUBbHVj7W-1)

### Telas prototipadas

| Tela | Descrição | Preview | Link |
|------|-----------|---------|------|
| Login | Tela de autenticação com e-mail/senha, "lembrar-me" e login social | Login | Ver no Figma |
| Cadastro | Formulário de criação de conta com validação | Cadastro | Ver no Figma |
| Recuperar Senha | Fluxo de recuperação de senha por e-mail | Recuperar Senha | Ver no Figma |
| Home / Dashboard | Painel principal após autenticação | Dashboard | Ver no Figma |
| Listagem | Tabela com paginação, filtros e busca | Listagem | Ver no Figma |
| Formulário de Cadastro/Edição | Criação e edição de registros | Formulário | Ver no Figma |
| Perfil do Usuário | Dados pessoais e preferências | Perfil | Ver no Figma |
| Configurações | Ajustes do sistema | Configurações | Ver no Figma |
| 404 / Erro | Página de erro personalizada | 404 | Ver no Figma |

### Design System

O projeto segue um design system definido no Figma, com:

- **Cores primárias:** `#2563EB` (azul), `#10B981` (verde), `#EF4444` (vermelho)
- **Tipografia:** Poppins (títulos) e Inter (corpo)
- **Espaçamentos:** grid de 8px
- **Componentes:** botões, inputs, cards, modais e toasts padronizados
- **Modo claro e escuro:** previsto para versões futuras

🔗 **Acessar o Design System:** [Clique aqui](https://www.figma.com/make/DOR2OQvmkfJ6au7zM4CWX4/Login-e-Cadastro-Veterin%C3%A1rio?t=8DK6f1eYUBbHVj7W-1)

### Organização dos arquivos de protótipo no repositório

```
docs/
└── prototipos/
    ├── login.png
    ├── cadastro.png
    ├── recuperar-senha.png
    ├── dashboard.png
    ├── listagem.png
    ├── formulario.png
    ├── perfil.png
    ├── configuracoes.png
    ├── 404.png
    └── prototipo-completo.png
```

### Fluxo de navegação (User Flow)

O protótipo interativo do Figma contempla o fluxo completo do usuário:

```
Login → Dashboard → Listagem → Formulário → Sucesso
Cadastro → Confirmação de E-mail → Login
Recuperar Senha → E-mail enviado → Redefinir Senha → Login
```

### Status dos protótipos

- [x] Wireframes de baixa fidelidade
- [x] Protótipos de alta fidelidade (desktop)
- [ ] Protótipos de alta fidelidade (mobile)
- [ ] Protótipo navegável (interativo)
- [ ] Handoff para desenvolvimento (medidas, cores, fontes)
- [ ] Testes de usabilidade com usuários
- [ ] Versão final aprovada pelo grupo de backend

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| [React](https://react.dev/) | 19.x | Biblioteca para construção de interfaces |
| [Vite](https://vitejs.dev/) | 8.x | Build tool e dev server |
| [React Router DOM](https://reactrouter.com/) | 7.x | Roteamento SPA |
| [Axios](https://axios-http.com/) | 1.x | Cliente HTTP para consumir a API |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Estilização utilitária |
| [Context API](https://react.dev/reference/react/useContext) | — | Gerenciamento de estado global |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | — | Formulários e validação |
| [React Hot Toast](https://react-hot-toast.com/) | — | Notificações (toasts) |
| [Lucide React](https://lucide.dev/) | — | Ícones |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) | — | Linter (substitui ESLint no template novo do Vite) |
| [Figma](https://www.figma.com/) | — | Prototipagem e Design System |

---

## Padronização de Ambiente (importante para a equipe)

Para evitar problemas de compatibilidade entre **Linux, macOS e Windows**, e para garantir que todos os membros usem as **mesmas versões** de Node, npm e dependências, o repositório inclui arquivos de padronização que **devem ser respeitados**.

### Versão do Node.js — `.nvmrc`

O projeto usa **Node.js 22** (LTS). O arquivo `.nvmrc` na raiz fixa essa versão.

```bash
# Se você usa nvm (Linux/macOS) ou nvm-windows:
nvm install    # instala a versão do .nvmrc
nvm use        # ativa a versão do .nvmrc
```

> 💡 Se você usa **fish shell**, instale o [`nvm.fish`](https://github.com/jorgebucaran/nvm.fish) — ele troca a versão automaticamente ao entrar na pasta.

### Faixa de versões — `engines` no `package.json`

```json
"engines": {
  "node": ">=22.0.0 <23.0.0",
  "npm": ">=10.0.0"
}
```

Para que essa faixa seja **obrigatória** (bloqueando instalações fora dela), existe um `.npmrc` com:

```
engine-strict=true
```

Se alguém tentar rodar `npm install` com Node 18, o npm **recusa** e pede para atualizar.

### Gerenciador de pacotes — `packageManager`

O `package.json` define o gerenciador padrão:

```json
"packageManager": "npm@10.9.9"
```

### Quebras de linha — `.gitattributes`

Como o time mistura **Windows** e **Linux**, o arquivo `.gitattributes` normaliza quebras de linha para `LF` no repositório, evitando conflitos do tipo "funciona na minha máquina".

```
* text=auto eol=lf
```

### Estilo de código — `.editorconfig`

Padroniza indentação (2 espaços), encoding (UTF-8), fim de linha (LF) e remoção de espaços em branco ao final das linhas, independentemente do editor.

### Instalação reprodutível — `npm ci`

O **`package-lock.json` está versionado** no repositório. Para instalar exatamente as versões travadas no lockfile:

```bash
npm ci
```

> ⚠️ Use `npm ci` **em vez de** `npm install` ao clonar o projeto pela primeira vez ou em pipelines de CI. Ele falha se o lockfile estiver fora de sincronia com o `package.json`, garantindo consistência.

### Usuários de Windows

- Recomendado usar **Git Bash** ou **WSL** para os comandos shell deste README.
- Se aparecerem erros de build em módulos nativos, instale o **Visual Studio Build Tools** (opção "Desktop development with C++").

---

## Integração com o Backend

Este frontend consome a API REST desenvolvida pelo **grupo de backend em Node.js**.

- **Repositório do Backend:** [github.com/vitormsantos1/React.Node-backend](https://github.com/vitormsantos1/React.Node-backend)
- **URL base da API (dev):** `http://localhost:3000/api`
- **Documentação da API:** [Swagger/Postman](https://link-da-doc)

### Endpoints principais consumidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Autenticação de usuário |
| `POST` | `/auth/register` | Cadastro de novo usuário |
| `POST` | `/auth/forgot-password` | Solicitar recuperação de senha |
| `POST` | `/auth/refresh` | Renovar o token de acesso |
| `POST` | `/usuarios` | Criar usuário |
| `GET` | `/usuarios` | Listar usuários |
| `GET` | `/usuarios/:id` | Buscar usuário por ID |
| `PUT` | `/usuarios/:id` | Atualizar usuário |
| `DELETE` | `/usuarios/:id` | Remover usuário |

> **Importante:** O backend precisa estar em execução localmente para que o frontend funcione corretamente em ambiente de desenvolvimento.

O frontend envia `email` e `senha` para o login; o cadastro envia `nome`, `email` e `senha`. A listagem envia os parâmetros `page`, `limit` e `search`, e aceita uma lista simples ou uma resposta paginada com `usuarios`, `users`, `items` ou `data` e o total correspondente.

> **Contrato a confirmar com o grupo de backend:** os endpoints `/auth/forgot-password` e `/auth/refresh`, os nomes dos campos, a forma de devolver o usuário/token e os parâmetros de paginação não constavam na documentação disponível quando este frontend foi implementado. Ajuste `src/services/auth.js`, `src/services/api.js` e `src/services/users.js` se o backend usar outro contrato. A tela de configurações salva preferências somente no navegador; não pressupõe endpoint de configurações.

---

## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js 22.x](https://nodejs.org/) (LTS) — use `nvm`, `nvm-windows` ou `fnm`
- [npm](https://www.npmjs.com/) 10.x ou superior
- [Git](https://git-scm.com/)
- O **backend em Node.js** rodando localmente

---

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/gabriela-data/reactjs.git
   cd reactjs
   ```

2. **Ative a versão correta do Node:**

   ```bash
   nvm use    # lê o .nvmrc automaticamente
   ```

3. **Instale as dependências (de forma reprodutível):**

   ```bash
   npm ci
   ```

   > Se preferir instalar normalmente: `npm install`.

---

## Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=CuidarVet
```

Existe um arquivo `.env.example` no repositório como referência. **Nunca versione o arquivo `.env` real.**

---

## Executando o Projeto

### Modo desenvolvimento

```bash
npm run dev
```

No servidor de desenvolvimento do Vite, as rotas privadas ficam acessíveis sem login, mas as áreas administrativas continuam exigindo `role: "admin"`. Para testar a navegação administrativa antes de o backend estar pronto, abra o console do navegador e execute `localStorage.setItem('@vet:user', JSON.stringify({ nome: 'Admin de teste', role: 'admin' }))`, depois recarregue a página. Esse mock é somente para desenvolvimento e não substitui autenticação nem autorização no backend. Builds de produção continuam exigindo autenticação; as telas que consultam dados da API também precisam do backend em execução.

A aplicação estará disponível em: [http://localhost:5173](http://localhost:5173)

### Build de produção

```bash
npm run build
```

### Pré-visualizar build

```bash
npm run preview
```

---

## Estrutura de Pastas

```
reactjs/
├── docs/                     # Documentação e protótipos
│   └── prototipos/           # Exportações das telas do Figma
├── public/
├── src/
│   ├── assets/               # Imagens, ícones, fontes
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Card/
│   ├── contexts/             # Context API (autenticação, tema, etc.)
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Páginas da aplicação
│   │   ├── Login/
│   │   ├── Cadastro/
│   │   ├── RecuperarSenha/
│   │   ├── Dashboard/
│   │   ├── ListagemUsuarios/
│   │   ├── Formulario/
│   │   ├── Perfil/
│   │   ├── Configuracoes/
│   │   └── NotFound/
│   ├── routes/               # Configuração de rotas
│   ├── services/             # Configuração do Axios e chamadas à API
│   │   └── api.js
│   ├── styles/               # Estilos globais (Tailwind)
│   │   └── global.css
│   ├── utils/                # Funções auxiliares
│   ├── App.jsx
│   └── main.jsx
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── .npmrc
├── .nvmrc
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build otimizada para produção |
| `npm run preview` | Pré-visualiza a build de produção |
| `npm run lint` | Executa o Oxlint |
| `npm run format` | Formata o código com Prettier |

---

## Consumo da API

Exemplo de configuração do Axios em `src/services/api.js`:

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@vet:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

Exemplo de uso em um componente:

```jsx
import { useEffect, useState } from 'react'
import api from '../services/api'

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    api.get('/usuarios')
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error(error))
  }, [])

  return (
    <ul>
      {usuarios.map((u) => <li key={u.id}>{u.nome}</li>)}
    </ul>
  )
}
```

---

## Estratégia de Branches

Para manter o repositório organizado e evitar conflitos entre a equipe:

| Branch | Propósito |
|--------|-----------|
| `main` | Versão estável. Recebe apenas merges via Pull Request. |
| `develop` | Branch de integração. Todo trabalho da equipe é reunido aqui antes de ir para `main`. |
| `feature/nome-da-tarefa` | Branches curtas para cada funcionalidade ou correção. Saem de `develop`. |

### Fluxo de trabalho

```bash
# Crie cada feature a partir da develop atualizada
git switch develop
git pull --ff-only origin develop
git switch -c feature/nome-da-issue

# Implemente e valide; depois crie um commit Conventional Commits
npm run dev
npm run build
git add src README.md
git commit -m "feat: implementa nome da funcionalidade"
git push -u origin feature/nome-da-issue
```

Abra um Pull Request da `feature/*` para `develop`; aguarde revisão e aprovação antes do merge. Não faça push direto para `develop`.

### Validação da entrega e promoção para main

Depois que as features planejadas forem integradas, valide a `develop` localmente:

```bash
git switch develop
git pull --ff-only origin develop
npm ci
npm run build
npm run preview
```

Se a validação passar, abra um Pull Request de `develop` para `main` no GitHub e aguarde a revisão. Não faça push nem merge direto para `main`.

Após o merge desse PR, a `develop` normalmente já contém as mudanças. Se precisar sincronizar alterações exclusivas da `main`, faça isso também por Pull Request:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/sync-main-into-develop
git merge origin/main
git push -u origin feature/sync-main-into-develop
# Abra um PR de feature/sync-main-into-develop para develop
```

> A branch `main` está protegida no GitHub: só recebe merge via PR com revisão.

---

## Equipe

### Grupo de Frontend

| Nome | GitHub | Função |
|------|--------|--------|
| Gabriela Almeida | [@gabriela-data](https://github.com/gabriela-data) | Desenvolvedor(a) Frontend |
| Davi Conceição | [@Davi-2405](https://github.com/Davi-2405) | Desenvolvedor(a) Frontend |
| [Nome 3] | @usuario3 | Desenvolvedor(a) Frontend |

### Grupo de Backend (parceiro)

| Nome | GitHub |
|------|--------|
| [Nome 1] | @usuario1 |
| [Nome 2] | @usuario2 |
| [Nome 3] | @usuario3 |

---

## Contribuindo

Antes de começar, leia a seção **[Padronização de Ambiente](#-padronização-de-ambiente-importante-para-a-equipe)** para garantir que sua máquina está configurada corretamente.

1. Faça um `checkout` da branch `develop` e atualize-a: `git pull origin develop`
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Garanta que está usando **Node 22**: `nvm use`
4. Instale dependências de forma reprodutível: `npm ci`
5. Commit suas mudanças seguindo o padrão: `git commit -m 'feat: adiciona nova feature'`
   - Prefixos sugeridos: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`
6. Push para a branch: `git push origin feature/minha-feature`
7. Abra um **Pull Request** para `develop`
8. Aguarde revisão de pelo menos um membro da equipe antes do merge

> **Nunca commite o arquivo `.env`.** Use sempre o `.env.example` como referência.

---

## Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT).

---

## Notas Finais

- O projeto adotou **Vite 8** e **Tailwind CSS 4**, que são versões mais recentes do que o planejado inicialmente. Isso foi necessário porque o ambiente exige Node.js 22+ — e as versões novas trazem melhor performance e configuração simplificada.
- O **Oxlint** substituiu o ESLint no template novo do Vite. Ele é mais rápido e cumpre a mesma função de padronização de código.
- O Tailwind 4 **não usa mais `tailwind.config.js`**. As customizações do design system ficam dentro do `src/styles/global.css`, usando a diretiva `@theme`.