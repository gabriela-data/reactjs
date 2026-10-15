# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Configuracao local

O projeto requer Node.js 22 e npm 10 ou superior.

1. Instale as dependencias com `npm ci`.
2. Copie `.env.example` para `.env`.
3. Ajuste `VITE_API_URL` para o endereco da API.
4. Inicie o projeto com `npm run dev`.

Exemplo de configuracao:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=VetClinic
```

O arquivo `.env` contem configuracoes locais e nao deve ser versionado. O
`.env.example` documenta as variaveis necessarias sem armazenar segredos.

## Cliente HTTP

O cliente Axios compartilhado fica em `src/services/api.js`. Ele usa a URL de
`VITE_API_URL`, aplica timeout de 10 segundos e envia automaticamente o token
salvo em `@vet:token` no cabecalho `Authorization`.

```js
import api from './services/api';

const { data } = await api.get('/exemplo');
```

Respostas `401` ou `403` removem os dados de autenticacao persistidos e
redirecionam o usuario para `/login`.

## Formularios e validacao

Os formularios usam React Hook Form com schemas Zod conectados pelo
`zodResolver`. O schema deve ficar separado do componente para que as regras
possam ser reutilizadas e testadas isoladamente.

```js
import { z } from 'zod';

const exemploSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Informe um e-mail valido'),
});
```

No componente, passe o schema ao `useForm` e mostre a mensagem correspondente
ao campo:

```jsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({ resolver: zodResolver(exemploSchema) });

<form onSubmit={handleSubmit(console.log)}>
  <input {...register('nome')} />
  {errors.nome && <span>{errors.nome.message}</span>}
</form>;
```

O login em `src/pages/Login` e o schema em `src/schemas/loginSchema.js`
servem como implementacao funcional de referencia.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
