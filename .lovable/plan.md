

# LeadTracker Dashboard — Plano de Implementação

## Visão Geral
Dashboard completo de analytics para rastreamento de leads, com tema dark mode, conectado ao Supabase, multi-tenant, com 7 telas principais e dados em tempo real.

---

## Fase 1 — Design System e Layout Base
- Configurar tema dark mode (fundo #0F172A, cards #1E293B, primária #3B82F6)
- Fonte Inter
- Sidebar fixa 220px com logo "LeadTracker", seletor de empresa e menu de navegação (Dashboard, Leads, Funil, Análise UTM, Geográfico, Eventos, Temporal)
- Item ativo com destaque azul
- Footer da sidebar com indicador "Dados atualizados em tempo real" (ponto verde pulsante)
- Layout responsivo com área de conteúdo principal

## Fase 2 — Autenticação e Multitenancy
- Tela de Login com email + senha via Supabase Auth
- Após login, carregar empresas do usuário
- Seletor de empresa no topo da sidebar
- Estado global do company_id (todas as queries filtram por company_id)
- Hook useCompany() para acesso global

## Fase 3 — Dashboard (Home)
- 4 KPI cards: Leads, Visitas, Eventos, Clientes (com variação percentual)
- 2 cards menores: Ativos 7 dias, Ativos 24h
- Funil de Conversão visual (Pageviews → Clicks → Checkout → Compras)
- Funil de Vendas (Sem Consciência → Conscientes → Intenção → Compradores)
- Gráfico de linha: Visitas e Eventos últimos 30 dias
- Gráfico de barras: Top 5 UTM Sources
- Tabela: últimos 20 leads
- Filtros globais: período, UTM Source, País/Estado

## Fase 4 — Tela de Leads
- Lista paginada (20 por página) com busca por nome/email/ID
- Colunas: Lead, Status, Visitas, Eventos, Localização, Origem, Última Visita
- Filtros por status (Lead/Cliente/Identificado)

## Fase 5 — Detalhe do Lead
- Header com avatar, nome, localização, badge de status
- Sidebar de estatísticas (visitas, eventos, origens, primeira/última visita)
- 3 tabs: Timeline, Visitas, Eventos
- Timeline cronológica invertida agrupada por data

## Fase 6 — Tela Funil de Conversão
- 4 KPI cards (Taxa de Conversão, Visitantes, Clientes, Tempo Médio)
- Funil visual com 5 etapas proporcionais
- Clicável para ver leads de cada fase

## Fase 7 — Análise UTM
- Gráfico de barras horizontais: Top 10 UTM Sources
- Gráfico pizza: distribuição por UTM Source
- Tabela detalhada ordenável com conversão por origem
- Filtros: período, UTM Source/Medium/Campaign, País/Estado

## Fase 8 — Análise Geográfica
- Gráficos de barras: Top 10 países, estados, cidades
- Tabela ordenável por estado com drill-down para cidades
- Filtros: período, UTM Source, tipo de métrica

## Fase 9 — Tela de Eventos
- 4 KPI cards (Total, Tipos Únicos, Páginas, Leads)
- Gráfico pizza por tipo de evento
- Gráfico de linha: eventos ao longo do tempo
- Top 10 eventos e Top 10 páginas
- Tabela de eventos recentes com badges coloridos

## Fase 10 — Tela Temporal
- Gráficos de linha: visitas, eventos, conversões por dia/semana/mês
- Gráfico comparativo com 3 linhas sobrepostas
- Heatmap de atividade (dia da semana × hora)
- Pizzas: distribuição por hora e dia da semana
- Filtros: período, agrupamento, UTM Source, País

## Fase 11 — Tempo Real e Performance
- Supabase Realtime para leads, visitas e eventos
- Cache otimizado com React Query (staleTime configurado)
- Skeleton loading em cards e tabelas
- Lazy loading nas rotas
- Debounce na busca de leads

---

## Notas Técnicas
- Stack: React + TypeScript + Tailwind + shadcn/ui + Recharts + TanStack Query + React Router + Supabase
- Banco de dados: 4 tabelas no Supabase (companies, leads, visits, events)
- Inicialmente com dados mockados, depois conexão real ao Supabase
- Todas as queries com filtro obrigatório por company_id

