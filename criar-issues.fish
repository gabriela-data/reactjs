#!/usr/bin/env fish

# ============================================================
# Cria as 33 issues principais do projeto
# Uso: fish criar-issues.fish
# ============================================================

set -l GREEN (set_color green)
set -l BLUE (set_color blue)
set -l YELLOW (set_color yellow)
set -l RED (set_color red)
set -l NC (set_color normal)

# ---------- CONFIGURAÇÃO ----------
set OWNER "gabriela-data"
set REPO "reactjs"

# ---------- VERIFICAÇÕES ----------
if not command -v gh >/dev/null
    echo -e "$RED GitHub CLI nao instalado.$NC"
    exit 1
end

echo -e "$BLUE============================================$NC"
echo -e "$BLUE  Criando issues principais               $NC"
echo -e "$BLUE============================================$NC\n"

# ---------- FUNÇÃO: CRIAR ISSUE ----------
function nova_issue --argument-names titulo labels milestone body
    echo -e "$BLUE  -> $titulo$NC"
    
    # Salva o body num arquivo temporário para evitar problemas com caracteres
    set -l tmp_file (mktemp)
    echo "$body" > $tmp_file
    
    set -l url (gh issue create \
        --repo $OWNER/$REPO \
        --title "$titulo" \
        --body-file $tmp_file \
        --label "$labels" \
        --milestone "$milestone" 2>&1)
    
    rm -f $tmp_file
    
    if string match -q "*github.com*" -- $url
        set -l num (basename $url)
        echo -e "$GREEN     criada: #$num$NC"
        echo $num
    else
        echo -e "$RED     ERRO: $url$NC"
        echo ""
    end
end

# ============================================================
# FASE 1 — SETUP
# ============================================================
echo -e "$YELLOW Fase 1 - Setup$NC\n"

set I1 (nova_issue \
    "[SETUP] Inicializar projeto com Vite + React" \
    "setup,prioridade-alta" \
    "Fase 1 — Setup" \
    "## Descricao
Criar a estrutura inicial do projeto React usando Vite.

## Criterios de aceite
- [ ] Projeto criado com npm create vite@latest
- [ ] Template React (JavaScript ou TypeScript)
- [ ] Dependencias instaladas com npm install
- [ ] Servidor de desenvolvimento rodando (npm run dev)
- [ ] Repositorio conectado ao GitHub")

set I2 (nova_issue \
    "[SETUP] Instalar e configurar dependencias base" \
    "setup,prioridade-alta" \
    "Fase 1 — Setup" \
    "## Descricao
Instalar as bibliotecas essenciais do projeto.

## Criterios de aceite
- [ ] react-router-dom instalado
- [ ] axios instalado
- [ ] Biblioteca de estilizacao escolhida (Tailwind / Styled Components)
- [ ] react-hook-form + zod (validacao de formularios)
- [ ] Biblioteca de notificacoes (react-toastify / sonner)")

set I3 (nova_issue \
    "[SETUP] Configurar ESLint, Prettier e padroes de codigo" \
    "setup,prioridade-média" \
    "Fase 1 — Setup" \
    "## Descricao
Padronizar o codigo do time com ESLint e Prettier.

## Criterios de aceite
- [ ] ESLint configurado
- [ ] Prettier configurado
- [ ] Scripts npm run lint e npm run format funcionando
- [ ] Regras documentadas no README
- [ ] Extensao recomendada para o VS Code")

set I4 (nova_issue \
    "[SETUP] Criar .env.example e configurar variaveis de ambiente" \
    "setup,prioridade-média" \
    "Fase 1 — Setup" \
    "## Descricao
Configurar variaveis de ambiente para integracao com o backend.

## Criterios de aceite
- [ ] Arquivo .env.example criado
- [ ] .env adicionado ao .gitignore
- [ ] Variavel VITE_API_URL definida
- [ ] README atualizado com instrucoes")

set I5 (nova_issue \
    "[SETUP] Configurar estrutura de pastas do projeto" \
    "setup,prioridade-média" \
    "Fase 1 — Setup" \
    "## Descricao
Organizar a estrutura de pastas seguindo boas praticas.

## Criterios de aceite
- [ ] Pastas criadas: components, pages, services, hooks, contexts, routes, utils, styles
- [ ] Arquivos base criados (api.js, App.jsx, main.jsx)
- [ ] Alias @/ configurado (opcional)")

set I6 (nova_issue \
    "[SETUP] Configurar Axios (services/api.js)" \
    "setup,integração,prioridade-alta" \
    "Fase 1 — Setup" \
    "## Descricao
Criar instancia do Axios com baseURL e interceptors.

## Criterios de aceite
- [ ] Instancia criada com baseURL do .env
- [ ] Interceptor de request (adiciona token JWT)
- [ ] Interceptor de response (trata erros 401/403)
- [ ] Exportado para uso nos servicos")

# ============================================================
# FASE 2 — COMPONENTES
# ============================================================
echo ""
echo -e "$YELLOW Fase 2 - Componentes base$NC\n"

set I7 (nova_issue \
    "[COMPONENTE] Button" \
    "componente,prioridade-alta" \
    "Fase 2 — Componentes base" \
    "## Descricao
Criar componente Button reutilizavel.

## Criterios de aceite
- [ ] Variantes: primary, secondary, ghost, danger
- [ ] Tamanhos: sm, md, lg
- [ ] Estado de loading com spinner
- [ ] Suporte a icones
- [ ] Prop disabled")

set I8 (nova_issue \
    "[COMPONENTE] Input" \
    "componente,prioridade-alta" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Label associada ao input
- [ ] Suporte a icone
- [ ] Mensagem de erro abaixo do campo
- [ ] Estado disabled
- [ ] Estado focus com destaque visual
- [ ] Suporte a type=password com toggle")

set I9 (nova_issue \
    "[COMPONENTE] Card" \
    "componente,prioridade-média" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Header, body e footer opcionais
- [ ] Sombra e borda arredondada
- [ ] Suporte a onClick")

set I10 (nova_issue \
    "[COMPONENTE] Modal" \
    "componente,prioridade-alta" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Overlay escuro ao fundo
- [ ] Botao de fechar
- [ ] Fechar ao clicar fora
- [ ] Fechar com tecla ESC
- [ ] Trava scroll do body")

set I11 (nova_issue \
    "[COMPONENTE] Toast / Notificacao" \
    "componente,prioridade-média" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Tipos: sucesso, erro, aviso, info
- [ ] Auto-dismiss configuravel
- [ ] Fila de notificacoes")

set I12 (nova_issue \
    "[COMPONENTE] Tabela de dados" \
    "componente,prioridade-alta" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Colunas configuraveis
- [ ] Ordenacao por coluna
- [ ] Selecao multipla
- [ ] Estado vazio personalizado
- [ ] Skeleton de loading")

set I13 (nova_issue \
    "[COMPONENTE] Sidebar" \
    "componente,design,prioridade-alta" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Logo no topo
- [ ] Menu com icones + labels
- [ ] Item ativo destacado
- [ ] Botao de logout
- [ ] Colapsavel em mobile")

set I14 (nova_issue \
    "[COMPONENTE] Topbar" \
    "componente,design,prioridade-média" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Breadcrumb
- [ ] Icone de notificacoes com badge
- [ ] Avatar com dropdown")

set I15 (nova_issue \
    "[COMPONENTE] Paginacao" \
    "componente,prioridade-média" \
    "Fase 2 — Componentes base" \
    "## Criterios de aceite
- [ ] Botoes anterior/proximo
- [ ] Numeros de pagina
- [ ] Seletor de itens por pagina")

# ============================================================
# FASE 3 — AUTENTICAÇÃO
# ============================================================
echo ""
echo -e "$YELLOW Fase 3 - Autenticacao$NC\n"

set I16 (nova_issue \
    "[PAGINA] Login" \
    "página,integração,prioridade-alta" \
    "Fase 3 — Autenticação" \
    "## Criterios de aceite
- [ ] Layout fiel ao Figma
- [ ] Validacao com react-hook-form + zod
- [ ] Integracao com POST /auth/login
- [ ] Armazenar token JWT
- [ ] Redirecionar para dashboard
- [ ] Tratar erros
- [ ] Estado de loading no botao")

set I17 (nova_issue \
    "[PAGINA] Cadastro" \
    "página,integração,prioridade-alta" \
    "Fase 3 — Autenticação" \
    "## Criterios de aceite
- [ ] Campos: nome, email, senha, confirmacao
- [ ] Validacao em tempo real
- [ ] Indicador de forca de senha
- [ ] Checkbox de aceite dos termos
- [ ] Integracao com POST /auth/register")

set I18 (nova_issue \
    "[PAGINA] Recuperar Senha" \
    "página,integração,prioridade-média" \
    "Fase 3 — Autenticação" \
    "## Criterios de aceite
- [ ] Campo de email
- [ ] Integracao com POST /auth/forgot-password
- [ ] Estado de sucesso
- [ ] Link para voltar ao login")

set I19 (nova_issue \
    "[CONTEXTO] AuthContext" \
    "setup,integração,prioridade-alta" \
    "Fase 3 — Autenticação" \
    "## Criterios de aceite
- [ ] Context criado com user, token, login, logout
- [ ] Persistencia em localStorage
- [ ] Re-hidratacao ao carregar
- [ ] Hook useAuth() exportado")

set I20 (nova_issue \
    "[ROTAS] PrivateRoute + configuracao de rotas" \
    "setup,integração,prioridade-alta" \
    "Fase 3 — Autenticação" \
    "## Criterios de aceite
- [ ] Componente PrivateRoute
- [ ] Rotas publicas: /login, /cadastro, /recuperar-senha
- [ ] Rotas privadas: /dashboard, /perfil
- [ ] Rota curinga para 404")

# ============================================================
# FASE 4 — CRUD
# ============================================================
echo ""
echo -e "$YELLOW Fase 4 - CRUD principal$NC\n"

set I21 (nova_issue \
    "[LAYOUT] Shell autenticado" \
    "página,design,prioridade-alta" \
    "Fase 4 — CRUD principal" \
    "## Criterios de aceite
- [ ] Layout com sidebar, topbar e conteudo
- [ ] Roteamento aninhado (Outlet)
- [ ] Responsivo")

set I22 (nova_issue \
    "[PAGINA] Dashboard" \
    "página,design,prioridade-alta" \
    "Fase 4 — CRUD principal" \
    "## Criterios de aceite
- [ ] Saudacao ao usuario
- [ ] Cards de KPIs
- [ ] Graficos
- [ ] Lista de ultimos registros")

set I23 (nova_issue \
    "[PAGINA] Listagem de [entidade]" \
    "página,integração,prioridade-alta" \
    "Fase 4 — CRUD principal" \
    "## Criterios de aceite
- [ ] Tabela com colunas definidas
- [ ] Busca por texto
- [ ] Filtros
- [ ] Paginacao
- [ ] Acoes por linha
- [ ] Estado vazio e loading")

set I24 (nova_issue \
    "[PAGINA] Formulario de criacao" \
    "página,integração,prioridade-alta" \
    "Fase 4 — CRUD principal" \
    "## Criterios de aceite
- [ ] Validacao com react-hook-form + zod
- [ ] Integracao com POST /[entidade]
- [ ] Feedback de sucesso
- [ ] Redirecionar apos salvar")

set I25 (nova_issue \
    "[PAGINA] Formulario de edicao" \
    "página,integração,prioridade-alta" \
    "Fase 4 — CRUD principal" \
    "## Criterios de aceite
- [ ] Reutiliza o formulario de criacao
- [ ] Pre-preenche os campos
- [ ] Integracao com PUT /[entidade]/:id
- [ ] Botao de excluir com confirmacao")

set I26 (nova_issue \
    "[PAGINA] Detalhes de [entidade]" \
    "página,prioridade-média" \
    "Fase 4 — CRUD principal" \
    "## Criterios de aceite
- [ ] Cabecalho com nome/ID e status
- [ ] Secoes de dados
- [ ] Timeline de alteracoes
- [ ] Botoes: Editar, Voltar, Excluir")

set I27 (nova_issue \
    "[PAGINA] Perfil do usuario" \
    "página,integração,prioridade-média" \
    "Fase 4 — CRUD principal" \
    "## Criterios de aceite
- [ ] Avatar com troca de imagem
- [ ] Editar nome, email, telefone
- [ ] Alterar senha
- [ ] Preferencias")

# ============================================================
# FASE 5 — REFINAMENTO
# ============================================================
echo ""
echo -e "$YELLOW Fase 5 - Refinamento$NC\n"

set I28 (nova_issue \
    "[MELHORIA] Responsividade mobile + tablet" \
    "melhoria,design,prioridade-alta" \
    "Fase 5 — Refinamento" \
    "## Criterios de aceite
- [ ] Testar em mobile (ate 640px)
- [ ] Testar em tablet (641-1024px)
- [ ] Sidebar colapsavel
- [ ] Tabelas com scroll horizontal")

set I29 (nova_issue \
    "[MELHORIA] Estados de loading, erro e vazio" \
    "melhoria,prioridade-média" \
    "Fase 5 — Refinamento" \
    "## Criterios de aceite
- [ ] Skeletons em listagens
- [ ] Spinners em botoes
- [ ] Empty states
- [ ] Paginas de erro amigaveis")

set I30 (nova_issue \
    "[MELHORIA] Acessibilidade (a11y)" \
    "melhoria,prioridade-baixa" \
    "Fase 5 — Refinamento" \
    "## Criterios de aceite
- [ ] Contraste de cores
- [ ] Navegacao por teclado
- [ ] Labels ARIA
- [ ] Testar com Lighthouse")

# ============================================================
# FASE 6 — DEPLOY
# ============================================================
echo ""
echo -e "$YELLOW Fase 6 - Deploy$NC\n"

set I31 (nova_issue \
    "[DEPLOY] Publicar frontend" \
    "deploy,prioridade-alta" \
    "Fase 6 — Deploy" \
    "## Criterios de aceite
- [ ] Repositorio conectado a Vercel/Netlify
- [ ] Variaveis de ambiente configuradas
- [ ] Build funcionando
- [ ] URL de producao acessivel")

set I32 (nova_issue \
    "[DEPLOY] Testar integracao com backend em producao" \
    "deploy,integração,prioridade-alta" \
    "Fase 6 — Deploy" \
    "## Criterios de aceite
- [ ] Backend em producao respondendo
- [ ] CORS configurado
- [ ] Login funcional
- [ ] CRUD funcional")

set I33 (nova_issue \
    "[DOCS] Atualizar README com links de producao" \
    "docs,prioridade-média" \
    "Fase 6 — Deploy" \
    "## Criterios de aceite
- [ ] Link do frontend em producao
- [ ] Link do backend em producao
- [ ] Link do Figma atualizado
- [ ] Screenshots das telas finais")

# ---------- RESUMO ----------
echo ""
echo -e "$GREEN============================================$NC"
echo -e "$GREEN  Issues principais criadas!$NC"
echo -e "$GREEN============================================$NC"
echo ""
echo "Issue #2 (Setup 1): $I1"
echo "Issue #3 (Setup 2): $I2"
echo ""
echo -e "$BLUE Veja em: https://github.com/$OWNER/$REPO/issues$NC"