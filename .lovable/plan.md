

# Autenticacao com Supabase Auth + Protecao de Rotas

## Resumo
Implementar login/signup com email e senha usando Supabase Auth, proteger todas as rotas do dashboard, e adicionar logout na sidebar. Isso permitira que o RLS funcione corretamente, ja que as policies dependem de `auth.uid()` via `get_user_company_ids()`.

---

## Etapa 1 — Hook de Autenticacao

Criar `src/hooks/useAuth.tsx` com:
- Context provider que escuta `onAuthStateChange` (configurado ANTES de `getSession`)
- Estado: `user`, `session`, `loading`
- Funcoes: `signIn(email, password)`, `signUp(email, password)`, `signOut()`
- Exportar hook `useAuth()`

---

## Etapa 2 — Pagina de Login

Criar `src/pages/AuthPage.tsx` com:
- Toggle entre Login e Cadastro (tabs ou botao)
- Formulario: email + senha
- Botao de submit com loading state
- Link "Esqueci minha senha" (chama `resetPasswordForEmail` com redirect para `/reset-password`)
- Visual consistente com o tema escuro do dashboard (fundo `#0d1117`, card centralizado com glow)
- Mensagens de erro/sucesso usando toast

---

## Etapa 3 — Pagina de Reset de Senha

Criar `src/pages/ResetPasswordPage.tsx` com:
- Detectar `type=recovery` no URL hash
- Formulario para nova senha
- Chamar `supabase.auth.updateUser({ password })`
- Redirecionar para `/` apos sucesso

---

## Etapa 4 — Componente de Protecao de Rota

Criar `src/components/ProtectedRoute.tsx`:
- Se `loading` -> mostrar skeleton/spinner
- Se `!user` -> redirecionar para `/auth`
- Se `user` -> renderizar `children`

---

## Etapa 5 — Atualizar App.tsx

- Envolver tudo com `AuthProvider`
- Rota `/auth` -> `AuthPage` (publica)
- Rota `/reset-password` -> `ResetPasswordPage` (publica)
- Todas as outras rotas envolvidas em `ProtectedRoute`

---

## Etapa 6 — Logout na Sidebar

- Adicionar botao de logout no rodape da `AppSidebar`
- Mostrar email do usuario logado
- Chamar `signOut()` e redirecionar para `/auth`

---

## Detalhes Tecnicos

### Arquivos a criar:
- `src/hooks/useAuth.tsx` — AuthContext + AuthProvider + useAuth hook
- `src/pages/AuthPage.tsx` — Login/Signup
- `src/pages/ResetPasswordPage.tsx` — Reset de senha
- `src/components/ProtectedRoute.tsx` — Guarda de rotas

### Arquivos a modificar:
- `src/App.tsx` — Adicionar AuthProvider, rotas publicas e ProtectedRoute
- `src/components/AppSidebar.tsx` — Adicionar botao logout e email do usuario

### Fluxo:
```text
Usuario abre app
    |
    v
ProtectedRoute verifica sessao
    |
    +-- Sem sessao --> /auth (login/signup)
    |
    +-- Com sessao --> Dashboard (RLS funciona com auth.uid())
```

### Seguranca:
- O `onAuthStateChange` garante que a sessao e atualizada automaticamente
- O `CompanyProvider` ja usa `supabase.auth.getUser()` para buscar empresas — com auth ativo, o RLS liberara os dados corretos
- As views (`v_funnel`, `v_lead_stats`, etc.) herdam as policies das tabelas base que usam `get_user_company_ids()` baseado em `auth.uid()`

