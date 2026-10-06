#!/usr/bin/env fish

# ============================================================
# Cria sub-issues com delay para evitar race condition
# Uso: fish criar-sub-issues-v2.fish
# ============================================================

set -l GREEN (set_color green)
set -l BLUE (set_color blue)
set -l YELLOW (set_color yellow)
set -l RED (set_color red)
set -l NC (set_color normal)

set OWNER "gabriela-data"
set REPO "reactjs"
set PROJECT_NUMBER 3
set PARENT_1_NUM 2
set PARENT_2_NUM 3

if not command -v gh >/dev/null
    echo -e "$RED GitHub CLI nao instalado.$NC"
    exit 1
end

echo -e "$BLUE============================================$NC"
echo -e "$BLUE  Criando sub-issues (v2 - com delay)       $NC"
echo -e "$BLUE============================================$NC\n"

function nova_sub --argument-names parent_num titulo labels body
    echo -e "$BLUE  -> $titulo$NC"

    set -l tmp_file (mktemp)
    echo "$body" > $tmp_file

    set -l url (gh issue create \
        --repo $OWNER/$REPO \
        --title "$titulo" \
        --body-file $tmp_file \
        --label "$labels" 2>&1)

    rm -f $tmp_file

    if not string match -q "*github.com*" -- $url
        echo -e "$RED     ERRO: $url$NC"
        return
    end

    set -l num (basename $url)
    echo -e "$GREEN     criada: #$num$NC"

    # === DELAY CRITICO ===
    # Espera 3 segundos para o GitHub indexar a issue antes de tentar vincula-la
    echo -e "$YELLOW     aguardando indexacao...$NC"
    sleep 3

    # Adiciona ao board
    gh project item-add $PROJECT_NUMBER --owner $OWNER \
        --url "https://github.com/$OWNER/$REPO/issues/$num" >/dev/null 2>&1

    # Obtem o database ID com retry
    set -l child_id ""
    for tentativa in 1 2 3
        set child_id (gh api repos/$OWNER/$REPO/issues/$num --jq '.id' 2>/dev/null)
        if test -n "$child_id"
            break
        end
        echo -e "$YELLOW     retry $tentativa para obter ID...$NC"
        sleep 2
    end

    if test -z "$child_id"
        echo -e "$YELLOW     nao foi possivel obter ID$NC"
        echo $num
        return
    end

    # Vincula como sub-issue com retry
    set -l vinculada false
    for tentativa in 1 2 3
        set -l result (gh api \
            repos/$OWNER/$REPO/issues/$parent_num/sub_issues \
            --method POST \
            -F sub_issue_id=$child_id 2>&1)

        if not string match -q "*Gone*" -- $result
            and not string match -q "*error*" -- $result
            and not string match -q "*404*" -- $result
            echo -e "$GREEN     vinculada a #$parent_num$NC"
            set vinculada true
            break
        end

        echo -e "$YELLOW     retry $tentativa para vincular...$NC"
        sleep 3
    end

    if test "$vinculada" = false
        echo -e "$YELLOW     nao foi possivel vincular automaticamente$NC"
        echo -e "$YELLOW     Vincule manualmente: #$num -> #$parent_num$NC"
    end

    echo $num
end

# ============================================================
# SUB-ISSUES DA ISSUE #2
# ============================================================
echo -e "$YELLOW Sub-issues de #$PARENT_1_NUM$NC\n"

set S1 (nova_sub $PARENT_1_NUM \
    "[SUB] Verificar e instalar Node.js e npm" \
    "setup,prioridade-alta" \
    "## Objetivo
Instalar o Node.js e o npm na sua maquina para poder rodar projetos React.

## Passo a passo
1. Acesse https://nodejs.org/
2. Baixe a versao LTS (recomendada para iniciantes)
3. Execute o instalador e siga as instrucoes (Next, Next, Install)
4. Abra o terminal e verifique se instalou:
   node --version
   npm --version
5. Voce deve ver algo como v20.11.0 e 10.2.4

## Criterios de aceite
- [ ] Node.js instalado (versao 18 ou superior)
- [ ] npm instalado e funcionando
- [ ] Comandos retornam a versao
- [ ] Print da tela do terminal anexado

## Estimativa
1 hora")

set S2 (nova_sub $PARENT_1_NUM \
    "[SUB] Criar projeto React com Vite" \
    "setup,prioridade-alta" \
    "## Objetivo
Criar a estrutura inicial do projeto React usando o Vite.

## Passo a passo
1. Abra o terminal na pasta onde quer criar o projeto
2. Rode:
   npm create vite@latest nome-do-projeto -- --template react
3. Substitua nome-do-projeto pelo nome real
4. Entre na pasta:
   cd nome-do-projeto
5. Instale as dependencias:
   npm install

## Criterios de aceite
- [ ] Projeto criado na pasta correta
- [ ] Arquivo package.json existe
- [ ] Pasta src/ existe com App.jsx e main.jsx
- [ ] npm install rodou sem erros

## Estimativa
1 hora")

set S3 (nova_sub $PARENT_1_NUM \
    "[SUB] Testar servidor de desenvolvimento local" \
    "setup,prioridade-alta" \
    "## Objetivo
Confirmar que o servidor de desenvolvimento esta funcionando.

## Passo a passo
1. Dentro da pasta do projeto, rode:
   npm run dev
2. Voce vera no terminal algo como:
   Local: http://localhost:5173/
3. Abra esse endereco no navegador
4. Voce deve ver a pagina padrao do Vite + React

## Criterios de aceite
- [ ] Comando npm run dev funciona
- [ ] Pagina abre em http://localhost:5173
- [ ] Print da tela do navegador anexado
- [ ] Ctrl+C encerra o servidor

## Estimativa
30 minutos")

set S4 (nova_sub $PARENT_1_NUM \
    "[SUB] Criar repositorio no GitHub e conectar" \
    "setup,prioridade-alta" \
    "## Objetivo
Criar o repositorio no GitHub e conectar o projeto local.

## Passo a passo
1. Acesse https://github.com/new
2. Nome do repositorio: reactjs
3. NAO marque Add README nem .gitignore
4. Clique em Create repository
5. No terminal, dentro da pasta do projeto:
   git init
   git add .
   git commit -m 'chore: setup inicial do projeto'
   git branch -M main
   git remote add origin https://github.com/gabriela-data/reactjs.git
   git push -u origin main

## Criterios de aceite
- [ ] Repositorio criado no GitHub
- [ ] Codigo enviado (visivel no GitHub)
- [ ] Branch principal se chama main
- [ ] Link do repositorio compartilhado

## Estimativa
1 hora")

set S5 (nova_sub $PARENT_1_NUM \
    "[SUB] Fazer primeiro commit e push de toda a equipe" \
    "setup,prioridade-media" \
    "## Objetivo
Garantir que o fluxo de commits esta funcionando para toda a equipe.

## Passo a passo
1. Cada membro deve clonar:
   git clone https://github.com/gabriela-data/reactjs.git
2. Fazer uma alteracao pequena (ex: adicionar seu nome no README)
3. Rodar:
   git add .
   git commit -m 'docs: adiciona nome do membro X'
   git push origin main
4. Verificar se o commit aparece no GitHub

## Criterios de aceite
- [ ] Todos os 6 membros conseguiram clonar
- [ ] Todos fizeram pelo menos 1 commit
- [ ] Commits visiveis no historico
- [ ] Padrao de mensagem documentado

## Estimativa
1 hora")

set S6 (nova_sub $PARENT_1_NUM \
    "[SUB] Escrever secao de instalacao no README" \
    "docs,prioridade-media" \
    "## Objetivo
Escrever a secao de instalacao do README.

## Passo a passo
1. Abra o arquivo README.md na raiz do projeto
2. Adicione uma secao Como rodar o projeto com:
   - Pre-requisitos (Node.js, npm, Git)
   - Passo a passo de clonagem
   - Instalacao de dependencias
   - Como rodar em dev
   - Como fazer build
3. Peca para um colega testar o passo a passo

## Criterios de aceite
- [ ] Secao escrita em portugues claro
- [ ] Comandos copiaveis
- [ ] Passo a passo testado por outra pessoa
- [ ] Print do README anexado

## Estimativa
2 horas")

# ============================================================
# SUB-ISSUES DA ISSUE #3
# ============================================================
echo ""
echo -e "$YELLOW Sub-issues de #$PARENT_2_NUM$NC\n"

set S7 (nova_sub $PARENT_2_NUM \
    "[SUB] Instalar e configurar React Router DOM" \
    "setup,integracao,prioridade-alta" \
    "## Objetivo
Instalar e configurar o React Router DOM para navegacao entre paginas.

## Passo a passo
1. Instale:
   npm install react-router-dom
2. Configure no src/main.jsx:
   import { BrowserRouter } from 'react-router-dom'
   
   ReactDOM.createRoot(document.getElementById('root')).render(
     <BrowserRouter>
       <App />
     </BrowserRouter>
   )
3. Teste criando 2 rotas simples em App.jsx

## Criterios de aceite
- [ ] react-router-dom instalado
- [ ] BrowserRouter configurado no main.jsx
- [ ] Pelo menos 2 rotas de teste funcionando
- [ ] Print da navegacao funcionando

## Estimativa
2 horas")

set S8 (nova_sub $PARENT_2_NUM \
    "[SUB] Instalar e configurar Axios" \
    "setup,integracao,prioridade-alta" \
    "## Objetivo
Instalar e configurar o Axios para chamadas HTTP.

## Passo a passo
1. Instale:
   npm install axios
2. Crie src/services/api.js:
   import axios from 'axios'
   
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
     timeout: 10000,
   })
   
   export default api
3. Crie .env na raiz:
   VITE_API_URL=http://localhost:3000/api
4. Adicione .env ao .gitignore
5. Crie tambem .env.example

## Criterios de aceite
- [ ] axios instalado
- [ ] src/services/api.js criado
- [ ] .env criado e no .gitignore
- [ ] .env.example versionado
- [ ] Documentado no README

## Estimativa
2 horas")

set S9 (nova_sub $PARENT_2_NUM \
    "[SUB] Instalar e configurar Tailwind CSS" \
    "setup,design,prioridade-alta" \
    "## Objetivo
Instalar e configurar o Tailwind CSS.

## Passo a passo
1. Instale:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
2. Configure tailwind.config.js:
   content: ['./index.html', './src/**/*.{js,jsx}']
3. Adicione no src/index.css:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
4. Teste com <div className='bg-blue-500 text-white p-4'>Teste</div>

## Criterios de aceite
- [ ] Tailwind instalado
- [ ] Classes funcionando
- [ ] Print de elemento estilizado
- [ ] Paleta de cores no tailwind.config.js

## Estimativa
3 horas")

set S10 (nova_sub $PARENT_2_NUM \
    "[SUB] Instalar e configurar React Hook Form + Zod" \
    "setup,prioridade-alta" \
    "## Objetivo
Instalar React Hook Form + Zod para validacao de formularios.

## Passo a passo
1. Instale:
   npm install react-hook-form zod @hookform/resolvers
2. Crie um formulario de teste com:
   import { useForm } from 'react-hook-form'
   import { zodResolver } from '@hookform/resolvers/zod'
   import { z } from 'zod'
   
   const schema = z.object({
     nome: z.string().min(3, 'Minimo 3 caracteres'),
     email: z.string().email('Email invalido'),
   })
3. Teste a validacao no navegador

## Criterios de aceite
- [ ] Bibliotecas instaladas
- [ ] Formulario de teste funcionando
- [ ] Mensagens de erro aparecem
- [ ] Exemplo documentado no README

## Estimativa
3 horas")

set S11 (nova_sub $PARENT_2_NUM \
    "[SUB] Instalar e configurar biblioteca de notificacoes" \
    "setup,prioridade-media" \
    "## Objetivo
Instalar biblioteca de notificacoes (toasts).

## Passo a passo
1. Instale (recomendado: react-toastify):
   npm install react-toastify
2. Configure no main.jsx:
   import { ToastContainer } from 'react-toastify'
   import 'react-toastify/dist/ReactToastify.css'
   
   <ToastContainer position='top-right' autoClose={3000} />
3. Crie um botao de teste:
   import { toast } from 'react-toastify'
   <button onClick={() => toast.success('Funcionou!')}>Testar</button>

## Criterios de aceite
- [ ] Biblioteca instalada
- [ ] ToastContainer configurado
- [ ] Toasts de sucesso, erro e aviso
- [ ] Print de um toast aparecendo

## Estimativa
2 horas")

set S12 (nova_sub $PARENT_2_NUM \
    "[SUB] Configurar ESLint e Prettier" \
    "setup,prioridade-media" \
    "## Objetivo
Configurar ESLint e Prettier para padronizar o codigo.

## Passo a passo
1. Instale:
   npm install -D eslint prettier eslint-config-prettier
2. Crie .prettierrc:
   {
     \"semi\": true,
     \"singleQuote\": true,
     \"tabWidth\": 2,
     \"trailingComma\": \"es5\"
   }
3. Adicione scripts no package.json:
   \"lint\": \"eslint . --ext js,jsx\",
   \"format\": \"prettier --write .\"
4. Rode npm run lint e corrija os erros

## Criterios de aceite
- [ ] ESLint configurado
- [ ] Prettier configurado
- [ ] Scripts funcionando
- [ ] Regras documentadas no README

## Estimativa
3 horas")

# ============================================================
# RESUMO
# ============================================================
echo ""
echo -e "$GREEN============================================$NC"
echo -e "$GREEN  Sub-issues criadas e vinculadas!$NC"
echo -e "$GREEN============================================$NC"
echo ""
echo -e "$BLUE Board:  https://github.com/users/$OWNER/projects/$PROJECT_NUMBER$NC"
echo -e "$BLUE Issues: https://github.com/$OWNER/$REPO/issues$NC"
echo ""
echo -e "$YELLOW Distribuicao sugerida (6 membros):$NC"
echo "   Ana    -> $S1 e $S7"
echo "   Bruno  -> $S2 e $S8"
echo "   Carla  -> $S3 e $S9"
echo "   Diego  -> $S4 e $S10"
echo "   Elena  -> $S5 e $S11"
echo "   Felipe -> $S6 e $S12"
echo ""