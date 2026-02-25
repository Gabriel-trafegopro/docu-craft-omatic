

# Login Simplificado — Admin Only

## Resumo
Simplificar a tela de login removendo a aba de "Cadastrar". Voce e o unico usuario do sistema (admin/dono). O login serve apenas para autenticar voce no Supabase, ativando o RLS para que os dados das empresas vinculadas ao seu usuario sejam liberados. Ao entrar, a sidebar mostra todas as empresas ligadas ao seu `user_id` na tabela `user_companies`, e voce alterna entre elas para analisar os dados.

---

## O que muda

### 1. Tela de Login (AuthPage.tsx)
- Remover as tabs "Entrar / Cadastrar" — so fica o formulario de login (email + senha)
- Manter o "Esqueci minha senha"
- Visual limpo: card centralizado com logo, titulo "LeadTracker" e subtitulo "Acesse seu painel de analytics"

### 2. Nada muda no restante
- O `useCompany` ja busca as empresas do usuario logado via `user_companies`
- O `ProtectedRoute` ja redireciona para `/auth` se nao houver sessao
- O `AppSidebar` ja mostra o seletor de empresas e o botao de logout
- O RLS ja filtra os dados por `get_user_company_ids()` baseado em `auth.uid()`

---

## Fluxo Final

```text
Voce abre o sistema
    |
    v
ProtectedRoute verifica sessao
    |
    +-- Sem sessao --> /auth (tela de login simples)
    |
    +-- Com sessao --> Dashboard
         |
         +-- Sidebar mostra TODAS as empresas do seu user_id
         +-- Voce alterna entre elas no seletor
         +-- Os dados de cada empresa aparecem nos graficos/tabelas
```

---

## Detalhes Tecnicos

### Arquivo a modificar:
- `src/pages/AuthPage.tsx` — Remover tabs e aba de signup, manter apenas formulario de login com "Esqueci minha senha"

### Nenhum arquivo novo necessario
Toda a infraestrutura de auth, protecao de rotas e multi-tenancy ja esta implementada e funcionando.
