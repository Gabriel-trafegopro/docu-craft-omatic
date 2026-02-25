

# Gerenciamento de Empresas (Admin)

## Resumo
Criar uma tela de gestao de empresas onde voce (admin) pode cadastrar, editar e visualizar todas as empresas do sistema. Ao cadastrar uma empresa, o sistema automaticamente gera um `webhook_secret`, vincula a empresa ao seu usuario na tabela `user_companies`, e exibe as informacoes necessarias para configurar o tracker no site do cliente.

---

## O que sera construido

### 1. Pagina de Empresas (`/companies`)
- Listagem de todas as empresas vinculadas ao seu usuario
- Card para cada empresa mostrando: nome, slug, dominio, plano, status (ativo/inativo), limites (max_leads, max_visits)
- Botao "Nova Empresa" que abre um dialog/modal de cadastro
- Botao "Editar" em cada empresa
- Exibicao do `webhook_secret` e `company_id` (dados necessarios para configurar o script de tracking no site do cliente)

### 2. Formulario de Cadastro/Edicao
Campos:
- **Nome** (obrigatorio) — ex: "Loja do Joao"
- **Slug** (obrigatorio, gerado automaticamente do nome) — ex: "loja-do-joao"
- **Dominio principal** (opcional) — ex: "lojadojoao.com.br"
- **Plano** (select: free, pro, enterprise) — default: free
- **Max Leads** — default: 500
- **Max Visitas** — default: 5000
- **Logo URL** (opcional)

### 3. Edge Function `manage-company`
Como a tabela `companies` nao permite INSERT/UPDATE via RLS para usuarios normais, sera criada uma edge function que:
- Valida que o usuario esta autenticado (via JWT)
- Cria a empresa na tabela `companies`
- Gera um `webhook_secret` unico (UUID)
- Vincula automaticamente o usuario a empresa na tabela `user_companies` com role `admin`
- Retorna os dados da empresa criada
- Tambem suporta UPDATE para edicao

### 4. Painel de Integracao (por empresa)
Apos cadastrar, cada empresa mostra um bloco "Configuracao do Tracker" com:
- **Company ID**: numero da empresa (usado no script)
- **Webhook Secret**: chave para autenticar requisicoes do tracker
- Botao de copiar para area de transferencia
- Instrucoes basicas de como instalar o script no site do cliente

### 5. Navegacao
- Novo item na sidebar: "Empresas" com icone `Building2`
- Rota `/companies` protegida igual as demais

---

## Fluxo do Admin

```text
Admin acessa /companies
    |
    v
Ve lista de empresas cadastradas
    |
    +-- Clica "Nova Empresa"
    |       |
    |       v
    |   Preenche formulario (nome, slug, dominio, plano)
    |       |
    |       v
    |   Edge function cria empresa + vincula ao admin
    |       |
    |       v
    |   Empresa aparece na lista e no seletor da sidebar
    |
    +-- Clica em uma empresa existente
            |
            v
        Ve detalhes + Company ID + Webhook Secret
        (informacoes para configurar o tracker no site do cliente)
```

---

## Detalhes Tecnicos

### Migracao SQL
Adicionar policy de INSERT e UPDATE na tabela `companies` nao e seguro via client-side. Em vez disso, a edge function usara o `SUPABASE_SERVICE_ROLE_KEY` para operacoes administrativas.

### Edge Function: `supabase/functions/manage-company/index.ts`
- Metodo POST: criar empresa
- Metodo PATCH: editar empresa
- Valida JWT do usuario autenticado
- Usa service role para INSERT/UPDATE em `companies` e `user_companies`
- Gera `webhook_secret` com `crypto.randomUUID()`

### Arquivos a criar:
- `src/pages/CompaniesPage.tsx` — Listagem + cadastro + edicao de empresas
- `supabase/functions/manage-company/index.ts` — Edge function para CRUD

### Arquivos a modificar:
- `src/App.tsx` — Adicionar rota `/companies`
- `src/components/AppSidebar.tsx` — Adicionar link "Empresas" na navegacao

### Validacao (client-side com zod):
- Nome: string, min 2 chars, max 100
- Slug: string, lowercase, sem espacos, min 2 chars
- Dominio: string opcional, formato URL valido
- Max Leads: numero positivo, default 500
- Max Visits: numero positivo, default 5000

