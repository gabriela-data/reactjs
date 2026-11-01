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

## Tabela de dados

Use `src/components/DataTable` para exibir colecoes com colunas configuraveis,
ordenacao local, selecao multipla opcional, estado vazio e skeleton de loading.

```jsx
import { useState } from 'react';
import DataTable from './components/DataTable';

const columns = [
  { key: 'nome', header: 'Paciente' },
  { key: 'idade', header: 'Idade' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'acoes',
    header: 'Acoes',
    sortable: false,
    render: (_, row) => <a href={`/pacientes/${row.id}`}>Ver detalhes</a>,
  },
];

function ListaPacientes({ pacientes, loading }) {
  const [selectedKeys, setSelectedKeys] = useState([]);

  return (
    <DataTable
      caption="Pacientes cadastrados"
      columns={columns}
      data={pacientes}
      loading={loading}
      selectable
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      emptyState={<p>Nenhum paciente cadastrado.</p>}
    />
  );
}
```

- Cada coluna tem `key` unico e `header`. Por padrao, a celula exibe
  `row[column.key]`; `render(value, row)` permite personalizar o conteudo.
- As colunas sao ordenaveis por padrao. Use `sortable: false` em colunas de
  acoes. Cliques alternam ordem crescente e decrescente, com indicacao visual
  e `aria-sort`. Numeros sao comparados numericamente, textos usam `pt-BR` e
  valores nulos ficam por ultimo. `sortValue(row)` permite ordenar valores
  derivados, como datas convertidas para timestamp. O array original nao e
  modificado.
- `rowKey` e `id` por padrao e pode ser outro campo ou uma funcao. Cada registro
  deve ter uma chave unica, estavel, do tipo string ou numero.
- Com `selectable`, os checkboxes selecionam registros individualmente ou todos
  os registros de `data`. O checkbox do cabecalho indica selecao parcial.
  `onSelectionChange(keys, rows)` recebe as chaves e os registros selecionados.
  A selecao acompanha as chaves ao ordenar. Passe `selectedKeys` para controlar
  a selecao externamente ou omita para usar o estado interno do componente.
  Chaves ausentes de `data` nao contam para a selecao visivel; novas selecoes
  retornam apenas registros presentes em `data`.
- `loading` exibe skeletons e desabilita os controles; `loadingRows` define a
  quantidade de linhas (padrao: 5). `emptyState` aceita texto ou JSX.
- `caption` nomeia a tabela para leitores de tela. Em telas pequenas, o
  conteiner oferece scroll horizontal e pode receber foco pelo teclado.
- Busca, filtros, requisicoes HTTP e paginacao ficam a cargo da pagina que
  utiliza o componente.

Evidencias visuais: [Tabela em desktop](docs/evidencias/issue-76-tabela.png) e
[scroll horizontal em mobile](docs/evidencias/issue-76-tabela-mobile.png).

## Sidebar

O componente `src/components/Sidebar` oferece marca no topo, navegacao com
icones, destaque da rota ativa e logout. Deve ser usado dentro de
`BrowserRouter` e `AuthProvider`, ja presentes na raiz da aplicacao.

```jsx
import { LayoutDashboard, UserRound } from 'lucide-react';
import Sidebar from './components/Sidebar';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/perfil', label: 'Meu perfil', icon: UserRound },
];

function ExemploLayout({ children }) {
  return (
    <div className="min-h-dvh md:flex md:items-start">
      <Sidebar items={menuItems} />
      <main className="min-w-0 flex-1 p-6">{children}</main>
    </div>
  );
}
```

- `items` aceita objetos com `to`, `label`, `icon` e `end` opcional. Os destinos
  devem ser unicos. Sem essa prop, o menu exibe Dashboard e Meu perfil.
- `NavLink` aplica destaque e `aria-current="page"` a rota ativa, inclusive nas
  subrotas. Use `end: true` para exigir correspondencia exata.
- `brandName`, `brandTo` e `logo` permitem personalizar a marca. O padrao e
  CuidarVet com icone de pata e link para `/dashboard`.
- Abaixo de 768px, o menu inicia recolhido e pode ser expandido pelo botao
  Abrir menu, com `aria-expanded` e `aria-controls`. Links e logout recolhem o
  menu. O conteudo expandido ocupa espaco na pagina, sem sobrepor o conteudo.
- A partir de 768px, a navegacao permanece visivel, com largura de 256px e
  altura da viewport. Menus longos possuem rolagem interna.
- Sair chama `logout()` do contexto existente, remove a sessao persistida e
  redireciona para `/login` com substituicao da entrada atual do historico.
- A composicao com Topbar e Outlet pertence a #85; a protecao de rotas, a #84.
  Os destinos de menu devem corresponder as paginas disponibilizadas pelo
  layout consumidor.

Evidencias visuais: [Sidebar em desktop](docs/evidencias/issue-77-sidebar-desktop.png)
e [menu expandido em mobile](docs/evidencias/issue-77-sidebar-mobile.png).

## Topbar

O componente `src/components/Topbar` combina breadcrumb, notificacoes com
badge e avatar com dropdown da conta. Assim como Sidebar, deve ficar dentro
de `BrowserRouter` e `AuthProvider`.

```jsx
import Topbar from './components/Topbar';

function ExemploTopbar({ abrirNotificacoes, naoLidas }) {
  return (
    <Topbar
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Meu perfil' },
      ]}
      notificationCount={naoLidas}
      onNotificationsClick={abrirNotificacoes}
    />
  );
}
```

- `breadcrumbs` recebe itens com `label` e `to` opcional. O ultimo item indica
  a pagina atual com `aria-current="page"`; os anteriores com `to` sao links.
  O padrao e apenas Dashboard. A pagina consumidora fornece o caminho correto.
- `notificationCount` indica a quantidade nao lida (padrao: 0). O badge e
  ocultado quando nao ha notificacoes e limitado visualmente a `99+`; o nome
  acessivel do botao informa o total completo.
- `onNotificationsClick` conecta o botao ao fluxo da pagina. Sem esse callback,
  o botao fica desabilitado. A Topbar nao busca dados nem inventa notificacoes.
- O nome vem de `user.nome` ou `user.name`, com fallback Usuario. O avatar usa
  `avatarUrl` da prop ou de `user.avatarUrl`; na ausencia ou falha da imagem,
  exibe as iniciais. O dropdown mostra nome, email quando disponivel, Meu
  perfil e Sair.
- O dropdown abre pelo botao da conta, fecha ao clicar fora, mover o foco para
  fora, selecionar uma acao ou pressionar Esc. Esc devolve o foco ao botao da
  conta. Links e botoes usam navegacao nativa por Tab, Enter e Espaco.
- Sair usa `logout()` do contexto e redireciona para `/login` com replace.
- Em telas pequenas, o nome junto ao avatar e ocultado e os breadcrumbs podem
  quebrar linha. A integracao ao layout autenticado pertence a #85.

Evidencias visuais: [Topbar em desktop](docs/evidencias/issue-78-topbar-desktop.png)
e [dropdown em mobile](docs/evidencias/issue-78-topbar-mobile.png).

## Paginacao

O componente controlado `src/components/Pagination` oferece anterior/proxima,
numeros de pagina e seletor de itens por pagina. A numeracao comeca em 1.

```jsx
import { useState } from 'react';
import Pagination from './components/Pagination';

function ListaPaginada({ registros }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(registros.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const inicio = (currentPage - 1) * pageSize;
  const visibleRows = registros.slice(inicio, inicio + pageSize);

  return (
    <>
      <ul>
        {visibleRows.map((registro) => (
          <li key={registro.id}>{registro.nome}</li>
        ))}
      </ul>
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={registros.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
}
```

- `page`, `pageSize` e `totalItems` tem padroes 1, 10 e 0. A pagina consumidora
  guarda o estado e atualiza os dados exibidos nos callbacks.
- `onPageChange(page)` recebe o numero solicitado. Anterior/proxima ficam
  desabilitados nos limites; clicar na pagina atual nao dispara nova mudanca.
- Ao trocar a quantidade, o componente chama `onPageSizeChange(size)` e
  `onPageChange(1)`, nessa ordem. O tamanho e sempre um numero.
- `pageSizeOptions` permite personalizar as opcoes (padrao: 10, 25, 50, 100).
  O tamanho atual e incluido mesmo se nao estiver na lista; valores duplicados
  ou que nao sejam inteiros positivos sao descartados.
- `disabled` bloqueia os controles durante uma requisicao. Sem o callback
  correspondente, o controle fica desabilitado.
- A pagina exibida fica limitada ao intervalo valido quando o total diminui.
  Essa normalizacao nao dispara callbacks durante a renderizacao; a pagina
  consumidora deve usar o mesmo limite para recortar os dados ou ajustar seu
  estado apos filtros, exclusoes e respostas do servidor.
- Sem registros, o resumo exibe 0–0 de 0 e a pagina 1, com anterior/proxima
  desabilitados. Listas longas usam reticencias, mantendo primeira, ultima e
  paginas proximas da atual. O resumo e anunciado e a pagina atual tem
  `aria-current="page"`. Os controles se acomodam em linhas em telas pequenas.
- Para usar com DataTable, passe a fatia atual em `data`. A ordenacao local da
  tabela atua sobre essa fatia; ordenacao global deve ocorrer antes do recorte
  ou no servidor. A paginacao nao executa requisicoes HTTP; na integracao remota,
  envie `page`/`pageSize` e informe em `totalItems` o total retornado pela API.

Evidencias visuais: [Paginacao em desktop](docs/evidencias/issue-79-paginacao-desktop.png)
e [paginacao em mobile](docs/evidencias/issue-79-paginacao-mobile.png).

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
