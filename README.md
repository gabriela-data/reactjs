# CuidarVet — Frontend

> Trabalho da disciplina de **Sistemas Web** — Interface frontend desenvolvida em React JS, integrada ao backend em Node.js desenvolvido pela outra metade do grupo.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-Produto%20%26%20UX-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Protótipos no Figma](#prototipos-no-figma)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Integração com o Backend](#integração-com-o-backend)
- [Pré-requisitos](#pre-requisitos)
- [Instalação](#instalacao)
- [Configuração de Variáveis de Ambiente](#configuracao-de-variaveis-de-ambiente)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Scripts Disponíveis](#scripts-disponiveis)
- [Consumo da API](#consumo-da-api)
- [Equipe](#equipe)
- [Licença](#licença)
- [Referências](#referencias)

---

## Sobre o Projeto {#sobre-o-projeto}

Este repositório contém a **aplicação frontend** desenvolvida em **React JS** como parte do trabalho da disciplina de **Sistemas Web**. O projeto é desenvolvido em conjunto com outro grupo responsável pelo **backend em Node.js**, seguindo a arquitetura **cliente-servidor** com comunicação via **API REST**.

O objetivo é aplicar na prática os conceitos de:
- Componentização e gerenciamento de estado em React
- Consumo de APIs REST
- Roteamento SPA (Single Page Application)
- Boas práticas de organização de código frontend
- Integração entre equipes (frontend x backend)
- **Prototipagem de UI/UX antes da implementação**

---

## Funcionalidades {#funcionalidades}

- [x] Autenticação de usuários (login/cadastro) com JWT
- [ ] CRUD completo de [entidade principal]
- [ ] Listagem com paginação e filtros
- [ ] Rotas protegidas por autenticação
- [ ] Feedback visual (loading, toasts, erros)
- [ ] Layout responsivo
- [ ] Dashboard com gráficos *(em desenvolvimento)*
- [ ] Modo escuro *(planejado)*

---

## Protótipos no Figma {#prototipos-no-figma}

Todos os protótipos de interface (UI/UX) do sistema foram desenvolvidos no **Figma** antes da implementação em React. Isso permite validar o fluxo de navegação, o layout e a experiência do usuário junto ao grupo de backend e aos stakeholders antes de partir para o código.

> **Acesse o protótipo completo navegável:** [Clique aqui para abrir no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=0%3A1)

### Telas prototipadas

| Tela | Descrição | Preview | Link |
|------|-----------|---------|------|
| **Login** | Tela de autenticação com e-mail/senha, "lembrar-me" e login social | ![Login](./docs/prototipos/login.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=LOGIN) |
| **Cadastro** | Formulário de criação de conta com validação | ![Cadastro](./docs/prototipos/cadastro.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=CADASTRO) |
| **Recuperar Senha** | Fluxo de recuperação de senha por e-mail | ![Recuperar Senha](./docs/prototipos/recuperar-senha.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=RECUPERAR) |
| **Home / Dashboard** | Painel principal após autenticação | ![Dashboard](./docs/prototipos/dashboard.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=DASHBOARD) |
| **Listagem** | Tabela com paginação, filtros e busca | ![Listagem](./docs/prototipos/listagem.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=LISTAGEM) |
| **Formulário de Cadastro/Edição** | Criação e edição de registros | ![Formulário](./docs/prototipos/formulario.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=FORMULARIO) |
| **Perfil do Usuário** | Dados pessoais e preferências | ![Perfil](./docs/prototipos/perfil.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=PERFIL) |
| **Configurações** | Ajustes do sistema | ![Configurações](./docs/prototipos/configuracoes.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=CONFIG) |
| **404 / Erro** | Página de erro personalizada | ![404](./docs/prototipos/404.png) | [Ver no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto?node-id=404) |

### Prévia do protótipo (embed Figma)

Você pode incorporar o protótipo interativo diretamente no README usando o iframe do Figma:

```html
<iframe
  style="border: 1px solid rgba(0, 0, 0, 0.1);"
  width="100%"
  height="600"
  src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto"
  allowfullscreen
></iframe>
```

Ou, se preferir uma imagem estática:

```markdown
![Protótipo completo do sistema](./docs/prototipos/prototipo-completo.png)
```

### Design System

O projeto segue um **design system** definido no Figma, com:

- **Cores primárias:** `#2563EB` (azul), `#10B981` (verde), `#EF4444` (vermelho)
- **Tipografia:** Poppins (títulos) e Inter (corpo)
- **Espaçamentos:** grid de 8px
- **Componentes:** botões, inputs, cards, modais e toasts padronizados
- **Modo claro e escuro:** previsto para versões futuras

 **Acessar o Design System:** [Clique aqui](https://www.figma.com/file/SEU_FILE_ID/design-system)](https://www.figma.com/make/DOR2OQvmkfJ6au7zM4CWX4/Login-e-Cadastro-Veterin%C3%A1rio?t=8DK6f1eYUBbHVj7W-1)

### Organização dos arquivos de protótipo no repositório

Sugestão de estrutura para salvar as exportações do Figma dentro do projeto:

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

> 💡 **Dica:** No Figma, use a opção **Export → PNG (2x)** para gerar imagens com boa resolução para o README.

### Fluxo de navegação (User Flow)

O protótipo interativo do Figma contempla o fluxo completo do usuário:

```
Login → Dashboard → Listagem → Formulário → Sucesso
  ↓
Cadastro → Confirmação de E-mail → Login
  ↓
Recuperar Senha → E-mail enviado → Redefinir Senha → Login
```

### ✅ Status dos protótipos

- [x] Wireframes de baixa fidelidade
- [x] Protótipos de alta fidelidade (desktop)
- [ ] Protótipos de alta fidelidade (mobile)
- [ ] Protótipo navegável (interativo)
- [ ] Handoff para desenvolvimento (medidas, cores, fontes)
- [ ] Testes de usabilidade com usuários
- [ ] Versão final aprovada pelo grupo de backend

### 🔎 Onde encontrar o File ID e o node-id

**File ID** – na URL do projeto:

```
https://www.figma.com/file/AbC123XyZ456/Nome-do-Projeto
                          ^^^^^^^^^^^
                          Este é o File ID
```

**node-id** – clique com o botão direito em um frame específico no Figma → **Copy link to selection**. O link conterá algo como `?node-id=123%3A456`. Use esse valor no parâmetro `node-id`.

---

## Tecnologias Utilizadas {#tecnologias-utilizadas}

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| [React](https://react.dev/) | 18.x | Biblioteca para construção de interfaces |
| [Vite](https://vitejs.dev/) | 5.x | Build tool e dev server |
| [React Router DOM](https://reactrouter.com/) | 6.x | Roteamento SPA |
| [Axios](https://axios-http.com/) | 1.x | Cliente HTTP para consumir a API |
| [Styled Components](https://styled-components.com/) / [Tailwind](https://tailwindcss.com/) | — | Estilização |
| [Context API](https://react.dev/reference/react/useContext) | — | Gerenciamento de estado global |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | — | Padronização de código |
| [Figma](https://www.figma.com/) | — | Prototipagem e Design System |

---

## Integração com o Backend {#integração-com-o-backend}

Este frontend consome a API REST desenvolvida pelo **grupo de backend em Node.js**.

- **Repositório do Backend:** [ link-do-repositorio-backend](https://github.com/usuario/repo-backend](https://github.com/vitormsantos1/React.Node-backend))
- **URL base da API (dev):** `http://localhost:3000/api`
- **Documentação da API:** [ Swagger/Postman](https://link-da-doc)

### Endpoints principais consumidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Autenticação de usuário |
| `POST` | `/auth/register` | Cadastro de novo usuário |
| `GET` | `/usuarios` | Listar usuários |
| `GET` | `/usuarios/:id` | Buscar usuário por ID |
| `PUT` | `/usuarios/:id` | Atualizar usuário |
| `DELETE` | `/usuarios/:id` | Remover usuário |

> ⚠️ **Importante:** O backend precisa estar em execução localmente para que o frontend funcione corretamente em ambiente de desenvolvimento.

---

## Pré-requisitos {#pre-requisitos}

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- O **backend em Node.js** rodando localmente (ver repositório do grupo de backend)

---

## Instalação {#instalacao}

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/nome-do-projeto-frontend.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd nome-do-projeto-frontend
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

---

## Configuração de Variáveis de Ambiente {#configuracao-de-variaveis-de-ambiente}

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Nome do Projeto
```

> Existe um arquivo `.env.example` no repositório como referência. **Nunca** versione o arquivo `.env` real.

---

## Executando o Projeto {#executando-o-projeto}

### Modo desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:5173**

### Build de produção

```bash
npm run build
```

### Pré-visualizar build

```bash
npm run preview
```

---

## Estrutura de Pastas {#estrutura-de-pastas}

```
nome-do-projeto-frontend/
├── docs/                   # Documentação e protótipos
│   └── prototipos/         # Exportações das telas do Figma
├── public/
├── src/
│   ├── assets/             # Imagens, ícones, fontes
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── contexts/           # Context API (autenticação, tema, etc.)
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas da aplicação
│   │   ├── Login/
│   │   ├── Home/
│   │   └── Dashboard/
│   ├── routes/             # Configuração de rotas
│   ├── services/           # Configuração do Axios e chamadas à API
│   │   └── api.js
│   ├── styles/             # Estilos globais
│   ├── utils/              # Funções auxiliares
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .eslintrc.json
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Scripts Disponíveis {#scripts-disponiveis}

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build otimizada para produção |
| `npm run preview` | Pré-visualiza a build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata o código com Prettier |

---

## Consumo da API {#consumo-da-api}

Exemplo de configuração do Axios em `src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@app:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Exemplo de uso em um componente:

```javascript
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api.get('/usuarios')
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <ul>
      {usuarios.map((u) => <li key={u.id}>{u.nome}</li>)}
    </ul>
  );
}
```

---

## Equipe {#equipe}

### Grupo de Frontend
| Nome | GitHub | Função |
|------|--------|--------|
| [Gabriela Almeida] | [@gabriela-data](https://github.com/usuario1](https://github.com/gabriela-data)) | Desenvolvedor(a) Frontend |
| [Davi Conceição] | [@Davi-2405](https://github.com/usuario2](https://github.com/Davi-2405)) | Desenvolvedor(a) Frontend |
| [Nome 3] | [@usuario3](https://github.com/usuario3) | Desenvolvedor(a) Frontend |

### Grupo de Backend (parceiro)
| Nome | GitHub |
|------|--------|
| [Nome 1] | [@usuario1](https://github.com/usuario1) |
| [Nome 2] | [@usuario2](https://github.com/usuario2) |
| [Nome 3] | [@usuario3](https://github.com/usuario3) |
---

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## Licença {#licença}

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Referências {#referencias}

- [Documentação React](https://react.dev/)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação Axios](https://axios-http.com/)
- [Repositório do Backend](https://github.com/usuario/repo-backend)
- [Protótipo no Figma](https://www.figma.com/file/SEU_FILE_ID/nome-do-projeto)

---

<p align="center">
  Desenvolvido com 💙 para a disciplina de <strong>Sistemas Web</strong>
</p>
