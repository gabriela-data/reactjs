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

## Notificacoes

Use a API centralizada de `src/services/notification.js` para manter o visual e
o tempo de exibicao consistentes. Ela oferece notificacoes de sucesso, erro,
aviso e informacao, com fila gerenciada pelo `Toaster` global.

```js
import { notify } from './services/notification';

notify.success('Registro salvo!');
notify.error('Nao foi possivel salvar.');
notify.warning('Revise os dados informados.');
notify.info('Uma nova versao esta disponivel.', { duration: 6000 });
```

Cada chamada aceita as opcoes do `react-hot-toast`, inclusive `duration` para
sobrescrever o auto-dismiss padrao.

## Modal

O componente `src/components/Modal` recebe `isOpen`, `onClose`, `title` e
`children`. As props `description` e `footer` sao opcionais. O componente pai
controla a abertura e deve atualizar `isOpen` ao receber `onClose`.

```jsx
import { useState } from 'react';
import Modal from './components/Modal';

function ExemploModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir detalhes
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Detalhes do registro"
        description="Confira as informacoes abaixo."
      >
        <p>Conteudo do modal.</p>
      </Modal>
    </>
  );
}
```

O modal usa o elemento nativo `dialog`, com overlay escuro, botao de fechar,
fechamento ao clicar fora ou pressionar Esc e bloqueio do scroll do body
enquanto aberto. O navegador mantem o foco dentro do dialog e devolve o foco
ao elemento anterior ao fechar. Ao fechar ou desmontar, o scroll anterior do
body e restaurado. Conteudos longos possuem rolagem interna.

Evidencia visual: [Modal em funcionamento](docs/evidencias/issue-74-modal.png).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Padroes de codigo

O ESLint verifica JavaScript, JSX, React Hooks e compatibilidade com Fast
Refresh. O Prettier formata o projeto com ponto e virgula, aspas simples,
indentacao de dois espacos e trailing commas no padrao ES5. O
`eslint-config-prettier` desativa regras de lint que poderiam conflitar com a
formatacao.

```bash
npm run lint          # verifica o codigo com ESLint
npm run lint:fix      # corrige automaticamente o que for possivel
npm run lint:fast     # verificacao adicional e rapida com Oxlint
npm run format        # formata os arquivos com Prettier
npm run format:check  # verifica a formatacao sem alterar arquivos
```
