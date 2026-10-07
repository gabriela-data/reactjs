#!/usr/bin/env fish

# ============================================================
# Cria um projeto completo no GitHub, do zero:
#   repositorio -> labels -> milestones -> board (Projects v2)
#   -> 33 issues principais -> 12 sub-issues vinculadas
#
# Uso:   fish criar-projeto-github.fish        (pede confirmacao)
#        fish criar-projeto-github.fish -y     (sem confirmacao)
#
# Requisitos: gh (GitHub CLI) logado, com o escopo "project":
#        gh auth refresh -s project
# ============================================================

# ---------- CONFIGURACAO ----------
set -g OWNER "gabriela-data"
set -g REPO "reactjs"
set -g PROJECT_TITLE "Projeto React - Board"

# ---------- CORES (globais, para funcoes enxergarem) ----------
set -g GREEN (set_color green)
set -g BLUE (set_color blue)
set -g YELLOW (set_color yellow)
set -g RED (set_color red)
set -g NC (set_color normal)
set -g FALHAS 0

# Todos os logs vao para stderr; so o numero da issue vai para stdout.
# Assim "set I1 (criar ...)" captura apenas o numero.
function info;  echo "$BLUE$argv$NC" >&2; end
function ok;    echo "$GREEN$argv$NC" >&2; end
function warn;  echo "$YELLOW$argv$NC" >&2; end
function erro;  echo "$RED$argv$NC" >&2; end

# ---------- VERIFICACOES ----------
if not type -q gh
    erro "GitHub CLI (gh) nao instalado."
    exit 1
end

if not gh auth status >/dev/null 2>&1
    erro "Voce nao esta logada no gh. Rode: gh auth login"
    exit 1
end

if not gh project list --owner $OWNER --limit 1 >/dev/null 2>&1
    erro "Falta o escopo 'project'. Rode: gh auth refresh -s project"
    exit 1
end

info "============================================"
info "  Criando projeto $OWNER/$REPO"
info "============================================"

if not contains -- -y $argv
    read -l -P "Isso vai criar ~45 issues no repositorio. Continuar? [s/N] " resp
    if not string match -qi s -- $resp
        echo "Cancelado."
        exit 0
    end
end

# ============================================================
# FUNCOES AUXILIARES
# ============================================================

# Monta o corpo de uma issue principal: corpo "descricao" "criterio 1" ...
function corpo --argument-names desc
    set -e argv[1]
    if test -n "$desc"
        printf '%s\n' "## Descricao" "$desc" ""
    end
    printf '%s\n' "## Criterios de aceite"
    for i in $argv
        printf '%s\n' "- [ ] $i"
    end
end

# Monta o corpo de uma sub-issue: subcorpo objetivo passos estimativa criterios...
function subcorpo --argument-names objetivo passos estimativa
    set -e argv[1..3]
    printf '%s\n' "## Objetivo" "$objetivo" "" "## Passo a passo" "$passos" "" "## Criterios de aceite"
    for i in $argv
        printf '%s\n' "- [ ] $i"
    end
    printf '%s\n' "" "## Estimativa" "$estimativa"
end

# Vincula uma issue filha a uma pai (com retry por causa do atraso de indexacao)
function vincular --argument-names parent num
    sleep 1
    set -l child_id ""
    for t in 1 2 3 4 5
        set child_id (gh api repos/$OWNER/$REPO/issues/$num --jq .id 2>/dev/null)
        test -n "$child_id"; and break
        sleep 2
    end

    if test -z "$child_id"
        warn "     nao consegui obter o ID de #$num"
        return 1
    end

    for t in 1 2 3 4 5
        if gh api repos/$OWNER/$REPO/issues/$parent/sub_issues \
                -X POST -F sub_issue_id=$child_id >/dev/null 2>&1
            ok "     vinculada a #$parent"
            return 0
        end
        warn "     retry $t para vincular..."
        sleep 3
    end

    warn "     vincule manualmente: #$num -> #$parent"
    return 1
end

# Cria a issue, adiciona ao board e (opcional) vincula a um pai.
# Uso: criar TITULO LABELS MILESTONE PAI(ou "") CORPO
function criar --argument-names titulo labels milestone parent body
    info "  -> $titulo"

    set -l saida (gh issue create \
        --repo $OWNER/$REPO \
        --title "$titulo" \
        --body "$body" \
        --label "$labels" \
        --milestone "$milestone" 2>&1)

    set -l url (string match -r 'https://github\.com/\S+/issues/\d+' -- $saida)[1]

    if test -z "$url"
        erro "     ERRO: $saida"
        set -g FALHAS (math $FALHAS + 1)
        return 1
    end

    set -l num (string replace -r '.*/' '' -- $url)
    ok "     criada: #$num"

    if not gh project item-add $PROJECT_NUMBER --owner $OWNER --url $url >/dev/null 2>&1
        warn "     nao consegui adicionar ao board"
        set -g FALHAS (math $FALHAS + 1)
    end

    if test -n "$parent"
        vincular $parent $num; or set -g FALHAS (math $FALHAS + 1)
    end

    sleep 1 # evita rate limit secundario do GitHub
    echo $num
end

# ============================================================
# 1. REPOSITORIO
# ============================================================
info "\n[1/5] Repositorio"
if gh repo view $OWNER/$REPO >/dev/null 2>&1
    ok "  $OWNER/$REPO ja existe"
else
    gh repo create $OWNER/$REPO --private >/dev/null; and ok "  repositorio criado (privado)"
    or begin; erro "  falha ao criar repositorio"; exit 1; end
end

# ============================================================
# 2. LABELS  (nome:cor:descricao)
# ============================================================
info "\n[2/5] Labels"
for l in \
    "setup:0e8a16:Configuracao inicial" \
    "componente:1d76db:Componente de UI" \
    "pagina:5319e7:Pagina / tela" \
    "integracao:fbca04:Integracao com backend" \
    "design:d876e3:Fidelidade ao design" \
    "melhoria:a2eeef:Melhoria / refinamento" \
    "deploy:0052cc:Publicacao" \
    "docs:0075ca:Documentacao" \
    "prioridade-alta:b60205:Prioridade alta" \
    "prioridade-media:ff9f1c:Prioridade media" \
    "prioridade-baixa:c2e0c6:Prioridade baixa"
    set -l p (string split ":" -- $l)
    gh label create $p[1] --repo $OWNER/$REPO --color $p[2] --description $p[3] --force >/dev/null 2>&1
    and ok "  $p[1]"
    or warn "  falhou: $p[1]"
end

# ============================================================
# 3. MILESTONES (uma por fase)
# ============================================================
info "\n[3/5] Milestones"
set -g M1 "Fase 1 — Setup"
set -g M2 "Fase 2 — Componentes base"
set -g M3 "Fase 3 — Autenticação"
set -g M4 "Fase 4 — CRUD principal"
set -g M5 "Fase 5 — Refinamento"
set -g M6 "Fase 6 — Deploy"
for m in $M1 $M2 $M3 $M4 $M5 $M6
    # 422 = ja existe, sem problema
    gh api repos/$OWNER/$REPO/milestones -f title="$m" >/dev/null 2>&1
    ok "  $m"
end

# ============================================================
# 4. BOARD (GitHub Projects v2)
# ============================================================
info "\n[4/5] Board"
set -g PROJECT_NUMBER (gh project list --owner $OWNER --limit 100 --format json \
    --jq ".projects[] | select(.title==\"$PROJECT_TITLE\") | .number" 2>/dev/null)[1]

if test -z "$PROJECT_NUMBER"
    set -g PROJECT_NUMBER (gh project create --owner $OWNER --title "$PROJECT_TITLE" \
        --format json --jq .number 2>/dev/null)
    if test -z "$PROJECT_NUMBER"
        erro "  falha ao criar o board"
        exit 1
    end
    ok "  board criado: #$PROJECT_NUMBER"
else
    ok "  board existente reutilizado: #$PROJECT_NUMBER"
end
gh project link $PROJECT_NUMBER --owner $OWNER --repo $REPO >/dev/null 2>&1

# ============================================================
# 5. ISSUES
# ============================================================
info "\n[5/5] Issues"

# ---------- FASE 1 — SETUP ----------
warn "\nFase 1 - Setup"

set I1 (criar "[SETUP] Inicializar projeto com Vite + React" "setup,prioridade-alta" $M1 "" \
    (corpo "Criar a estrutura inicial do projeto React usando Vite." \
        "Projeto criado com npm create vite@latest" \
        "Template React (JavaScript ou TypeScript)" \
        "Dependencias instaladas com npm install" \
        "Servidor de desenvolvimento rodando (npm run dev)" \
        "Repositorio conectado ao GitHub" | string collect))

set I2 (criar "[SETUP] Instalar e configurar dependencias base" "setup,prioridade-alta" $M1 "" \
    (corpo "Instalar as bibliotecas essenciais do projeto." \
        "react-router-dom instalado" \
        "axios instalado" \
        "Biblioteca de estilizacao escolhida (Tailwind / Styled Components)" \
        "react-hook-form + zod (validacao de formularios)" \
        "Biblioteca de notificacoes (react-toastify / sonner)" | string collect))

criar "[SETUP] Configurar ESLint, Prettier e padroes de codigo" "setup,prioridade-media" $M1 "" \
    (corpo "Padronizar o codigo do time com ESLint e Prettier." \
        "ESLint configurado" "Prettier configurado" \
        "Scripts npm run lint e npm run format funcionando" \
        "Regras documentadas no README" \
        "Extensao recomendada para o VS Code" | string collect) >/dev/null

criar "[SETUP] Criar .env.example e configurar variaveis de ambiente" "setup,prioridade-media" $M1 "" \
    (corpo "Configurar variaveis de ambiente para integracao com o backend." \
        "Arquivo .env.example criado" ".env adicionado ao .gitignore" \
        "Variavel VITE_API_URL definida" "README atualizado com instrucoes" | string collect) >/dev/null

criar "[SETUP] Configurar estrutura de pastas do projeto" "setup,prioridade-media" $M1 "" \
    (corpo "Organizar a estrutura de pastas seguindo boas praticas." \
        "Pastas criadas: components, pages, services, hooks, contexts, routes, utils, styles" \
        "Arquivos base criados (api.js, App.jsx, main.jsx)" \
        "Alias @/ configurado (opcional)" | string collect) >/dev/null

criar "[SETUP] Configurar Axios (services/api.js)" "setup,integracao,prioridade-alta" $M1 "" \
    (corpo "Criar instancia do Axios com baseURL e interceptors." \
        "Instancia criada com baseURL do .env" \
        "Interceptor de request (adiciona token JWT)" \
        "Interceptor de response (trata erros 401/403)" \
        "Exportado para uso nos servicos" | string collect) >/dev/null

# ---------- FASE 2 — COMPONENTES ----------
warn "\nFase 2 - Componentes base"

criar "[COMPONENTE] Button" "componente,prioridade-alta" $M2 "" \
    (corpo "Criar componente Button reutilizavel." \
        "Variantes: primary, secondary, ghost, danger" "Tamanhos: sm, md, lg" \
        "Estado de loading com spinner" "Suporte a icones" "Prop disabled" | string collect) >/dev/null

criar "[COMPONENTE] Input" "componente,prioridade-alta" $M2 "" \
    (corpo "" "Label associada ao input" "Suporte a icone" \
        "Mensagem de erro abaixo do campo" "Estado disabled" \
        "Estado focus com destaque visual" "Suporte a type=password com toggle" | string collect) >/dev/null

criar "[COMPONENTE] Card" "componente,prioridade-media" $M2 "" \
    (corpo "" "Header, body e footer opcionais" "Sombra e borda arredondada" "Suporte a onClick" | string collect) >/dev/null

criar "[COMPONENTE] Modal" "componente,prioridade-alta" $M2 "" \
    (corpo "" "Overlay escuro ao fundo" "Botao de fechar" "Fechar ao clicar fora" \
        "Fechar com tecla ESC" "Trava scroll do body" | string collect) >/dev/null

criar "[COMPONENTE] Toast / Notificacao" "componente,prioridade-media" $M2 "" \
    (corpo "" "Tipos: sucesso, erro, aviso, info" "Auto-dismiss configuravel" "Fila de notificacoes" | string collect) >/dev/null

criar "[COMPONENTE] Tabela de dados" "componente,prioridade-alta" $M2 "" \
    (corpo "" "Colunas configuraveis" "Ordenacao por coluna" "Selecao multipla" \
        "Estado vazio personalizado" "Skeleton de loading" | string collect) >/dev/null

criar "[COMPONENTE] Sidebar" "componente,design,prioridade-alta" $M2 "" \
    (corpo "" "Logo no topo" "Menu com icones + labels" "Item ativo destacado" \
        "Botao de logout" "Colapsavel em mobile" | string collect) >/dev/null

criar "[COMPONENTE] Topbar" "componente,design,prioridade-media" $M2 "" \
    (corpo "" "Breadcrumb" "Icone de notificacoes com badge" "Avatar com dropdown" | string collect) >/dev/null

criar "[COMPONENTE] Paginacao" "componente,prioridade-media" $M2 "" \
    (corpo "" "Botoes anterior/proximo" "Numeros de pagina" "Seletor de itens por pagina" | string collect) >/dev/null

# ---------- FASE 3 — AUTENTICACAO ----------
warn "\nFase 3 - Autenticacao"

criar "[PAGINA] Login" "pagina,integracao,prioridade-alta" $M3 "" \
    (corpo "" "Layout fiel ao Figma" "Validacao com react-hook-form + zod" \
        "Integracao com POST /auth/login" "Armazenar token JWT" \
        "Redirecionar para dashboard" "Tratar erros" "Estado de loading no botao" | string collect) >/dev/null

criar "[PAGINA] Cadastro" "pagina,integracao,prioridade-alta" $M3 "" \
    (corpo "" "Campos: nome, email, senha, confirmacao" "Validacao em tempo real" \
        "Indicador de forca de senha" "Checkbox de aceite dos termos" \
        "Integracao com POST /auth/register" | string collect) >/dev/null

criar "[PAGINA] Recuperar Senha" "pagina,integracao,prioridade-media" $M3 "" \
    (corpo "" "Campo de email" "Integracao com POST /auth/forgot-password" \
        "Estado de sucesso" "Link para voltar ao login" | string collect) >/dev/null

criar "[CONTEXTO] AuthContext" "setup,integracao,prioridade-alta" $M3 "" \
    (corpo "" "Context criado com user, token, login, logout" "Persistencia em localStorage" \
        "Re-hidratacao ao carregar" "Hook useAuth() exportado" | string collect) >/dev/null

criar "[ROTAS] PrivateRoute + configuracao de rotas" "setup,integracao,prioridade-alta" $M3 "" \
    (corpo "" "Componente PrivateRoute" "Rotas publicas: /login, /cadastro, /recuperar-senha" \
        "Rotas privadas: /dashboard, /perfil" "Rota curinga para 404" | string collect) >/dev/null

# ---------- FASE 4 — CRUD ----------
warn "\nFase 4 - CRUD principal"

criar "[LAYOUT] Shell autenticado" "pagina,design,prioridade-alta" $M4 "" \
    (corpo "" "Layout com sidebar, topbar e conteudo" "Roteamento aninhado (Outlet)" "Responsivo" | string collect) >/dev/null

criar "[PAGINA] Dashboard" "pagina,design,prioridade-alta" $M4 "" \
    (corpo "" "Saudacao ao usuario" "Cards de KPIs" "Graficos" "Lista de ultimos registros" | string collect) >/dev/null

criar "[PAGINA] Listagem de [entidade]" "pagina,integracao,prioridade-alta" $M4 "" \
    (corpo "" "Tabela com colunas definidas" "Busca por texto" "Filtros" "Paginacao" \
        "Acoes por linha" "Estado vazio e loading" | string collect) >/dev/null

criar "[PAGINA] Formulario de criacao" "pagina,integracao,prioridade-alta" $M4 "" \
    (corpo "" "Validacao com react-hook-form + zod" "Integracao com POST /[entidade]" \
        "Feedback de sucesso" "Redirecionar apos salvar" | string collect) >/dev/null

criar "[PAGINA] Formulario de edicao" "pagina,integracao,prioridade-alta" $M4 "" \
    (corpo "" "Reutiliza o formulario de criacao" "Pre-preenche os campos" \
        "Integracao com PUT /[entidade]/:id" "Botao de excluir com confirmacao" | string collect) >/dev/null

criar "[PAGINA] Detalhes de [entidade]" "pagina,prioridade-media" $M4 "" \
    (corpo "" "Cabecalho com nome/ID e status" "Secoes de dados" "Timeline de alteracoes" \
        "Botoes: Editar, Voltar, Excluir" | string collect) >/dev/null

criar "[PAGINA] Perfil do usuario" "pagina,integracao,prioridade-media" $M4 "" \
    (corpo "" "Avatar com troca de imagem" "Editar nome, email, telefone" \
        "Alterar senha" "Preferencias" | string collect) >/dev/null

# ---------- FASE 5 — REFINAMENTO ----------
warn "\nFase 5 - Refinamento"

criar "[MELHORIA] Responsividade mobile + tablet" "melhoria,design,prioridade-alta" $M5 "" \
    (corpo "" "Testar em mobile (ate 640px)" "Testar em tablet (641-1024px)" \
        "Sidebar colapsavel" "Tabelas com scroll horizontal" | string collect) >/dev/null

criar "[MELHORIA] Estados de loading, erro e vazio" "melhoria,prioridade-media" $M5 "" \
    (corpo "" "Skeletons em listagens" "Spinners em botoes" "Empty states" \
        "Paginas de erro amigaveis" | string collect) >/dev/null

criar "[MELHORIA] Acessibilidade (a11y)" "melhoria,prioridade-baixa" $M5 "" \
    (corpo "" "Contraste de cores" "Navegacao por teclado" "Labels ARIA" "Testar com Lighthouse" | string collect) >/dev/null

# ---------- FASE 6 — DEPLOY ----------
warn "\nFase 6 - Deploy"

criar "[DEPLOY] Publicar frontend" "deploy,prioridade-alta" $M6 "" \
    (corpo "" "Repositorio conectado a Vercel/Netlify" "Variaveis de ambiente configuradas" \
        "Build funcionando" "URL de producao acessivel" | string collect) >/dev/null

criar "[DEPLOY] Testar integracao com backend em producao" "deploy,integracao,prioridade-alta" $M6 "" \
    (corpo "" "Backend em producao respondendo" "CORS configurado" "Login funcional" "CRUD funcional" | string collect) >/dev/null

criar "[DOCS] Atualizar README com links de producao" "docs,prioridade-media" $M6 "" \
    (corpo "" "Link do frontend em producao" "Link do backend em producao" \
        "Link do Figma atualizado" "Screenshots das telas finais" | string collect) >/dev/null

# ============================================================
# SUB-ISSUES DA ISSUE "Inicializar projeto" ($I1)
# ============================================================
warn "\nSub-issues de #$I1"

set S1 (criar "[SUB] Verificar e instalar Node.js e npm" "setup,prioridade-alta" $M1 $I1 \
    (subcorpo "Instalar o Node.js e o npm na sua maquina para poder rodar projetos React." \
"1. Acesse https://nodejs.org/
2. Baixe a versao LTS (recomendada para iniciantes)
3. Execute o instalador e siga as instrucoes
4. Abra o terminal e verifique:
   node --version
   npm --version
5. Voce deve ver algo como v20.11.0 e 10.2.4" \
        "1 hora" \
        "Node.js instalado (versao 18 ou superior)" "npm instalado e funcionando" \
        "Comandos retornam a versao" "Print da tela do terminal anexado" | string collect))

set S2 (criar "[SUB] Criar projeto React com Vite" "setup,prioridade-alta" $M1 $I1 \
    (subcorpo "Criar a estrutura inicial do projeto React usando o Vite." \
"1. Abra o terminal na pasta onde quer criar o projeto
2. Rode:
   npm create vite@latest nome-do-projeto -- --template react
3. Entre na pasta:
   cd nome-do-projeto
4. Instale as dependencias:
   npm install" \
        "1 hora" \
        "Projeto criado na pasta correta" "Arquivo package.json existe" \
        "Pasta src/ existe com App.jsx e main.jsx" "npm install rodou sem erros" | string collect))

set S3 (criar "[SUB] Testar servidor de desenvolvimento local" "setup,prioridade-alta" $M1 $I1 \
    (subcorpo "Confirmar que o servidor de desenvolvimento esta funcionando." \
"1. Dentro da pasta do projeto, rode:
   npm run dev
2. Voce vera no terminal algo como:
   Local: http://localhost:5173/
3. Abra esse endereco no navegador
4. Voce deve ver a pagina padrao do Vite + React" \
        "30 minutos" \
        "Comando npm run dev funciona" "Pagina abre em http://localhost:5173" \
        "Print da tela do navegador anexado" "Ctrl+C encerra o servidor" | string collect))

set S4 (criar "[SUB] Criar repositorio no GitHub e conectar" "setup,prioridade-alta" $M1 $I1 \
    (subcorpo "Conectar o projeto local ao repositorio no GitHub." \
"1. No terminal, dentro da pasta do projeto:
   git init
   git add .
   git commit -m 'chore: setup inicial do projeto'
   git branch -M main
   git remote add origin https://github.com/$OWNER/$REPO.git
   git push -u origin main" \
        "1 hora" \
        "Codigo enviado (visivel no GitHub)" "Branch principal se chama main" \
        "Link do repositorio compartilhado" | string collect))

set S5 (criar "[SUB] Fazer primeiro commit e push de toda a equipe" "setup,prioridade-media" $M1 $I1 \
    (subcorpo "Garantir que o fluxo de commits esta funcionando para toda a equipe." \
"1. Cada membro deve clonar:
   git clone https://github.com/$OWNER/$REPO.git
2. Fazer uma alteracao pequena (ex: adicionar seu nome no README)
3. Rodar:
   git add .
   git commit -m 'docs: adiciona nome do membro X'
   git push origin main
4. Verificar se o commit aparece no GitHub" \
        "1 hora" \
        "Todos os 6 membros conseguiram clonar" "Todos fizeram pelo menos 1 commit" \
        "Commits visiveis no historico" "Padrao de mensagem documentado" | string collect))

set S6 (criar "[SUB] Escrever secao de instalacao no README" "docs,prioridade-media" $M1 $I1 \
    (subcorpo "Escrever a secao de instalacao do README." \
"1. Abra o README.md na raiz do projeto
2. Adicione a secao 'Como rodar o projeto' com:
   - Pre-requisitos (Node.js, npm, Git)
   - Clonagem e instalacao de dependencias
   - Como rodar em dev e fazer build
3. Peca para um colega testar o passo a passo" \
        "2 horas" \
        "Secao escrita em portugues claro" "Comandos copiaveis" \
        "Passo a passo testado por outra pessoa" "Print do README anexado" | string collect))

# ============================================================
# SUB-ISSUES DA ISSUE "Dependencias base" ($I2)
# ============================================================
warn "\nSub-issues de #$I2"

set S7 (criar "[SUB] Instalar e configurar React Router DOM" "setup,integracao,prioridade-alta" $M1 $I2 \
    (subcorpo "Instalar e configurar o React Router DOM para navegacao entre paginas." \
"1. Instale:
   npm install react-router-dom
2. Configure no src/main.jsx envolvendo o <App /> com <BrowserRouter>
3. Teste criando 2 rotas simples em App.jsx" \
        "2 horas" \
        "react-router-dom instalado" "BrowserRouter configurado no main.jsx" \
        "Pelo menos 2 rotas de teste funcionando" "Print da navegacao funcionando" | string collect))

set S8 (criar "[SUB] Instalar e configurar Axios" "setup,integracao,prioridade-alta" $M1 $I2 \
    (subcorpo "Instalar e configurar o Axios para chamadas HTTP." \
"1. Instale:
   npm install axios
2. Crie src/services/api.js com axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: 10000 })
3. Crie .env na raiz:
   VITE_API_URL=http://localhost:3000/api
4. Adicione .env ao .gitignore
5. Crie tambem .env.example" \
        "2 horas" \
        "axios instalado" "src/services/api.js criado" ".env criado e no .gitignore" \
        ".env.example versionado" "Documentado no README" | string collect))

set S9 (criar "[SUB] Instalar e configurar Tailwind CSS" "setup,design,prioridade-alta" $M1 $I2 \
    (subcorpo "Instalar e configurar o Tailwind CSS." \
"1. Siga o guia oficial para Vite: https://tailwindcss.com/docs/installation
2. Confirme que o CSS principal importa o Tailwind
3. Teste com <div className='bg-blue-500 text-white p-4'>Teste</div>" \
        "3 horas" \
        "Tailwind instalado" "Classes funcionando" "Print de elemento estilizado" \
        "Paleta de cores definida no tema" | string collect))

set S10 (criar "[SUB] Instalar e configurar React Hook Form + Zod" "setup,prioridade-alta" $M1 $I2 \
    (subcorpo "Instalar React Hook Form + Zod para validacao de formularios." \
"1. Instale:
   npm install react-hook-form zod @hookform/resolvers
2. Crie um formulario de teste usando useForm + zodResolver
3. Defina um schema com z.object (nome min 3 caracteres, email valido)
4. Teste a validacao no navegador" \
        "3 horas" \
        "Bibliotecas instaladas" "Formulario de teste funcionando" \
        "Mensagens de erro aparecem" "Exemplo documentado no README" | string collect))

set S11 (criar "[SUB] Instalar e configurar biblioteca de notificacoes" "setup,prioridade-media" $M1 $I2 \
    (subcorpo "Instalar biblioteca de notificacoes (toasts)." \
"1. Instale (recomendado: react-toastify):
   npm install react-toastify
2. Adicione <ToastContainer /> no main.jsx e importe o CSS da biblioteca
3. Crie um botao de teste que chama toast.success('Funcionou!')" \
        "2 horas" \
        "Biblioteca instalada" "ToastContainer configurado" \
        "Toasts de sucesso, erro e aviso" "Print de um toast aparecendo" | string collect))

set S12 (criar "[SUB] Configurar ESLint e Prettier" "setup,prioridade-media" $M1 $I2 \
    (subcorpo "Configurar ESLint e Prettier para padronizar o codigo." \
"1. Instale:
   npm install -D eslint prettier eslint-config-prettier
2. Crie .prettierrc com semi, singleQuote, tabWidth 2 e trailingComma es5
3. Adicione os scripts lint e format no package.json
4. Rode npm run lint e corrija os erros" \
        "3 horas" \
        "ESLint configurado" "Prettier configurado" "Scripts funcionando" \
        "Regras documentadas no README" | string collect))

# ============================================================
# RESUMO
# ============================================================
set -l board_url (gh project view $PROJECT_NUMBER --owner $OWNER --format json --jq .url 2>/dev/null)

echo
ok "============================================"
ok "  Projeto criado!"
ok "============================================"
echo
info "Board:  $board_url"
info "Issues: https://github.com/$OWNER/$REPO/issues"
if test $FALHAS -gt 0
    warn "Atencao: $FALHAS operacao(oes) falharam (veja os avisos acima)."
end
echo
warn "Distribuicao sugerida (6 membros):"
echo "   Ana    -> #$S1 e #$S7"
echo "   Bruno  -> #$S2 e #$S8"
echo "   Carla  -> #$S3 e #$S9"
echo "   Diego  -> #$S4 e #$S10"
echo "   Elena  -> #$S5 e #$S11"
echo "   Felipe -> #$S6 e #$S12"
echo