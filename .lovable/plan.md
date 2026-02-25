

# Integrar Supabase Real — Substituir Mocks por Dados Reais

## Resumo
Substituir todos os dados mockados (`mockData.ts`) por queries reais ao Supabase, usando as views `v_funnel`, `v_utm_analysis`, `v_geo_analysis`, `v_lead_stats` e as tabelas `leads`, `visits`, `events`, `companies` e `user_companies`. Cada aba do sistema funcionara com dados reais filtrados pelo `company_id`.

---

## Etapa 1 — Hook `useCompany` com Supabase

Atualizar `src/hooks/useCompany.tsx` para:
- Buscar empresas reais da tabela `user_companies` + `companies` (via join ou queries separadas)
- Armazenar `companyId` como `number` (o banco usa `integer`)
- Usar `supabase.auth.getUser()` para identificar o usuario logado
- Fallback: se nao houver auth, permitir uso sem filtro (para desenvolvimento)

---

## Etapa 2 — Hooks de dados com React Query

Criar `src/hooks/useSupabaseData.ts` com hooks reutilizaveis:

1. **`useLeads(companyId)`** — query em `v_lead_stats` filtrada por `company_id`
2. **`useFunnel(companyId)`** — query em `v_funnel` filtrada por `company_id`
3. **`useUtmAnalysis(companyId)`** — query em `v_utm_analysis` filtrada por `company_id`
4. **`useGeoAnalysis(companyId)`** — query em `v_geo_analysis` filtrada por `company_id`
5. **`useEvents(companyId)`** — query em `events` filtrada por `company_id`, com ordenacao por `event_datetime desc`
6. **`useVisits(companyId)`** — query em `visits` filtrada por `company_id`
7. **`useLeadDetail(leadId)`** — query em `v_lead_stats` por `id`, alem de `visits` e `events` daquele lead
8. **`useDashboardKPIs(companyId)`** — agregacoes: total leads, total visits, total events, total customers (usando counts das tabelas)
9. **`useVisitsTimeline(companyId)`** — visits agrupadas por dia (ultimos 30 dias)

Todos os hooks usarao `@tanstack/react-query` com `staleTime` de 30s.

---

## Etapa 3 — Dashboard (Index.tsx)

Substituir mocks por dados reais:
- **KPI Cards**: usar `useDashboardKPIs` — contar leads, visits, events e customers da empresa
- **Funis**: usar `useFunnel` — mapear `total_visitors`, `total_leads`, `total_engaged`, `total_interested`, `total_customers`
- **Grafico Visitas/Eventos 30d**: usar `useVisitsTimeline` — agrupar visits por `visit_date`
- **Top UTM Sources**: usar `useUtmAnalysis` — top 5 por `total_visits`
- **Tabela ultimos leads**: usar `useLeads` — ultimos 10 ordenados por `last_visit_at`
- Skeleton loading enquanto carrega

---

## Etapa 4 — Tela de Leads (LeadsPage.tsx)

- Usar `useLeads(companyId)` com `v_lead_stats`
- Colunas mapeadas: `name`, `email`, `external_user_id`, status (derivado de `is_customer`/`is_identified`), `total_visits`, `total_events`/`events_count`, `last_city`, `last_country`, `first_utm_source`, `last_visit_at`
- Busca client-side por `name`, `email`, `external_user_id`
- Filtro de status: "Todos", "Cliente" (`is_customer=true`), "Identificado" (`is_identified=true`), "Anonimo" (ambos false)
- Paginacao mantida client-side
- Click navega para `/leads/:id` (usando `id` numerico)

---

## Etapa 5 — Detalhe do Lead (LeadDetailPage.tsx)

- Usar `useLeadDetail(id)` para buscar de `v_lead_stats` por `id`
- Header: `name` (ou `external_user_id`), `email`, `whatsapp`, status badge, localizacao (`last_city`, `last_country`)
- Cards de estatisticas: `total_visits`, `total_events`/`events_count`, `utm_sources_count`, `pages_visited`, `cities_visited`, `first_visit_at`, `last_visit_at`
- **Tab Timeline**: combinar visits + events do lead, ordenados por datetime desc
- **Tab Visitas**: listar `visits` do lead com `page_url`, `page_title`, `visit_datetime`, `utm_source`, `city`, `country`
- **Tab Eventos**: listar `events` do lead com `event_type`, `event_name`, `page_url`, `element_text`, `event_datetime`

---

## Etapa 6 — Funil (FunnelPage.tsx)

- Usar `useFunnel(companyId)` com `v_funnel`
- KPIs: `overall_conversion_rate`, `total_visitors`, `total_customers`
- Funil visual: 5 etapas — Visitantes, Leads, Engajados, Interessados, Clientes
- Percentuais calculados em relacao ao total de visitantes

---

## Etapa 7 — UTM (UTMPage.tsx)

- Usar `useUtmAnalysis(companyId)` com `v_utm_analysis`
- Grafico de barras: top 10 `utm_source` por `total_visits`
- Grafico pizza: distribuicao por `unique_leads`
- Tabela completa: `utm_source`, `utm_medium`, `utm_campaign`, `total_visits`, `unique_leads`, `total_customers`, `conversion_rate`

---

## Etapa 8 — Geografico (GeoPage.tsx)

- Usar `useGeoAnalysis(companyId)` com `v_geo_analysis`
- Agrupar client-side por `country` e por `state` para graficos
- Graficos de barras: top paises e top estados por `unique_leads`
- Tabela: `country`, `state`, `city`, `unique_leads`, `total_visits`, `total_customers`

---

## Etapa 9 — Eventos (EventsPage.tsx)

- Usar `useEvents(companyId)` para tabela `events`
- KPIs: total events (count), tipos unicos (distinct `event_type`), paginas (distinct `page_path`), leads com eventos (distinct `lead_id`)
- Grafico pizza: agrupar por `event_type` com count
- Grafico de linha: agrupar events por dia (`event_datetime`)
- Tabela eventos recentes: `event_type`, `event_name`, `page_url`, `element_text`, `event_datetime`

---

## Etapa 10 — Temporal (TemporalPage.tsx)

- Usar `useVisits(companyId)` e `useEvents(companyId)`
- Grafico de linha 30 dias: agrupar visits e events por dia
- Heatmap: agrupar visits por dia da semana e hora (extrair de `visit_datetime`)

---

## Detalhes Tecnicos

- **Autenticacao**: As views/tabelas tem RLS com `get_user_company_ids()` que depende de `auth.uid()`. Se o usuario ainda nao estiver autenticado, as queries retornarao vazio. O sistema mostrara estados vazios com mensagem amigavel.
- **Fallback**: Manter `mockData.ts` como referencia mas nao importar mais nos componentes.
- **Tipos**: Usar os tipos gerados em `src/integrations/supabase/types.ts` para tipagem das queries.
- **Performance**: Queries com `limit(1000)` e ordenacao adequada. React Query com cache de 30s.

### Arquivos a criar/modificar:
- **Criar**: `src/hooks/useSupabaseData.ts` (todos os hooks de dados)
- **Modificar**: `src/hooks/useCompany.tsx` (buscar empresas reais)
- **Modificar**: `src/pages/Index.tsx` (dashboard com dados reais)
- **Modificar**: `src/pages/LeadsPage.tsx` (leads reais)
- **Modificar**: `src/pages/LeadDetailPage.tsx` (detalhe real)
- **Modificar**: `src/pages/FunnelPage.tsx` (funil real)
- **Modificar**: `src/pages/UTMPage.tsx` (utm real)
- **Modificar**: `src/pages/GeoPage.tsx` (geo real)
- **Modificar**: `src/pages/EventsPage.tsx` (eventos reais)
- **Modificar**: `src/pages/TemporalPage.tsx` (temporal real)

