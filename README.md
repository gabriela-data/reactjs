# [Nome do Projeto] — Frontend

> Trabalho da disciplina de **Sistemas Web** — Interface frontend desenvolvida em React JS, integrada ao backend em Node.js desenvolvido pela outra metade do grupo.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

---

## Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Integração com o Backend](#-integração-com-o-backend)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Consumo da API](#-consumo-da-api)
- [Equipe](#-equipe)
- [Licença](#-licença)

---

## Sobre o Projeto

Este repositório contém a **aplicação frontend** desenvolvida em **React JS** como parte do trabalho da disciplina de **Sistemas Web**. O projeto é desenvolvido em conjunto com outro grupo responsável pelo **backend em Node.js**, seguindo a arquitetura **cliente-servidor** com comunicação via **API REST**.

O objetivo é aplicar na prática os conceitos de:
- Componentização e gerenciamento de estado em React
- Consumo de APIs REST
- Roteamento SPA (Single Page Application)
- Boas práticas de organização de código frontend
- Integração entre equipes (frontend x backend)

---

## Funcionalidades

- [x] Autenticação de usuários (login/cadastro) com JWT
- [x] CRUD completo de [entidade principal]
- [x] Listagem com paginação e filtros
- [x] Rotas protegidas por autenticação
- [x] Feedback visual (loading, toasts, erros)
- [x] Layout responsivo
- [ ] Dashboard com gráficos *(em desenvolvimento)*
- [ ] Modo escuro *(planejado)*

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| [React](https://react.dev/) | 18.x | Biblioteca para construção de interfaces |
| [Vite](https://vitejs.dev/) | 5.x | Build tool e dev server |
| [React Router DOM](https://reactrouter.com/) | 6.x | Roteamento SPA |
| [Axios](https://axios-http.com/) | 1.x | Cliente HTTP para consumir a API |
| [Styled Components](https://styled-components.com/) / [Tailwind](https://tailwindcss.com/) | — | Estilização |
| [Context API](https://react.dev/reference/react/useContext) | — | Gerenciamento de estado global |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | — | Padronização de código |

---

## Integração com o Backend

Este frontend consome a API REST desenvolvida pelo **grupo de backend em Node.js**.

- **Repositório do Backend:** [🔗 link-do-repositorio-backend](https://github.com/usuario/repo-backend)
- **URL base da API (dev):** `http://localhost:3000/api`
- **Documentação da API:** [🔗 Swagger/Postman](https://link-da-doc)

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

## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- O **backend em Node.js** rodando localmente (ver repositório do grupo de backend)

---

## Instalação

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

## Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Nome do Projeto
```

> 📌 Existe um arquivo `.env.example` no repositório como referência. **Nunca** versione o arquivo `.env` real.

---

## Executando o Projeto

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

## Estrutura de Pastas

```
nome-do-projeto-frontend/
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

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build otimizada para produção |
| `npm run preview` | Pré-visualiza a build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata o código com Prettier |

---

## Consumo da API

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

## Equipe

### Grupo de Frontend
| Nome | GitHub | Função |
|------|--------|--------|
| Gabriela Almeida | [@gabriela-data](https://github.com/gabriela-data) | Desenvolvedor(a) Frontend |
| [Nome 2] | [@usuario2](https://github.com/usuario2) | Desenvolvedor(a) Frontend |
| [Nome 3] | [@usuario3](https://github.com/usuario3) | Desenvolvedor(a) Frontend |

### Grupo de Backend (parceiro)
| Nome | GitHub |
|------|--------|
| [Nome 1] | [@usuario1](https://github.com/usuario1) |
| [Nome 2] | [@usuario2](https://github.com/usuario2) |

---

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Referências

- [Documentação React](https://react.dev/)
- [Repositório do Backend](https://github.com/usuario/repo-backend)

---

<p align="center">
  Desenvolvido com 💙 para a disciplina de <strong>Sistemas Web</strong>
</p>
