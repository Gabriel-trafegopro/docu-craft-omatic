// Mock data for LeadTracker Dashboard

export const mockCompanies = [
  { id: "c1", name: "TechCorp Brasil" },
  { id: "c2", name: "StartupXYZ" },
];

export const mockKPIs = {
  leads: { value: 2847, change: 12.5 },
  visits: { value: 18432, change: 8.3 },
  events: { value: 45210, change: -2.1 },
  customers: { value: 342, change: 15.7 },
  active7d: { value: 1203 },
  active24h: { value: 287 },
};

export const mockFunnelConversion = [
  { stage: "Pageviews", value: 18432, color: "hsl(217, 91%, 60%)" },
  { stage: "Clicks", value: 8210, color: "hsl(199, 89%, 48%)" },
  { stage: "Checkout", value: 1845, color: "hsl(38, 92%, 50%)" },
  { stage: "Compras", value: 342, color: "hsl(142, 71%, 45%)" },
];

export const mockFunnelSales = [
  { stage: "Sem Consciência", value: 15000, color: "hsl(215, 20%, 65%)" },
  { stage: "Conscientes", value: 8500, color: "hsl(217, 91%, 60%)" },
  { stage: "Intenção", value: 3200, color: "hsl(38, 92%, 50%)" },
  { stage: "Compradores", value: 342, color: "hsl(142, 71%, 45%)" },
];

export const mockVisitsEvents30d = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    visitas: Math.floor(400 + Math.random() * 300),
    eventos: Math.floor(1000 + Math.random() * 800),
  };
});

export const mockUtmSources = [
  { source: "google", leads: 845, visits: 5230, conversion: 16.2 },
  { source: "facebook", leads: 632, visits: 4100, conversion: 15.4 },
  { source: "instagram", leads: 421, visits: 3200, conversion: 13.2 },
  { source: "linkedin", leads: 298, visits: 1800, conversion: 16.6 },
  { source: "tiktok", leads: 187, visits: 1500, conversion: 12.5 },
  { source: "email", leads: 156, visits: 800, conversion: 19.5 },
  { source: "organic", leads: 134, visits: 700, conversion: 19.1 },
  { source: "referral", leads: 98, visits: 520, conversion: 18.8 },
  { source: "twitter", leads: 52, visits: 380, conversion: 13.7 },
  { source: "youtube", leads: 24, visits: 202, conversion: 11.9 },
];

export type LeadStatus = "lead" | "cliente" | "identificado";

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  visits: number;
  events: number;
  location: string;
  source: string;
  lastVisit: string;
  createdAt: string;
  country: string;
  state: string;
  city: string;
}

const names = ["Ana Silva", "Carlos Souza", "Maria Santos", "João Oliveira", "Fernanda Lima", "Pedro Costa", "Beatriz Almeida", "Lucas Pereira", "Juliana Rocha", "Rafael Mendes", "Camila Ferreira", "Bruno Nascimento", "Isabela Ribeiro", "Thiago Araújo", "Larissa Martins", "Gustavo Barbosa", "Amanda Correia", "Diego Cardoso", "Patrícia Moreira", "Vinícius Gomes"];
const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador", "Fortaleza", "Brasília", "Recife", "Manaus"];
const states = ["SP", "RJ", "MG", "PR", "RS", "BA", "CE", "DF", "PE", "AM"];
const sources = ["google", "facebook", "instagram", "linkedin", "tiktok", "email", "organic"];
const statuses: LeadStatus[] = ["lead", "cliente", "identificado"];

export const mockLeads: Lead[] = Array.from({ length: 50 }, (_, i) => {
  const cityIdx = i % cities.length;
  const daysAgo = Math.floor(Math.random() * 30);
  const lastVisitDate = new Date();
  lastVisitDate.setDate(lastVisitDate.getDate() - daysAgo);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - (daysAgo + Math.floor(Math.random() * 60)));
  return {
    id: `lead-${(i + 1).toString().padStart(4, "0")}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(" ", ".")}${i}@email.com`,
    status: statuses[i % 3],
    visits: Math.floor(1 + Math.random() * 50),
    events: Math.floor(1 + Math.random() * 100),
    location: `${cities[cityIdx]}, ${states[cityIdx]}`,
    source: sources[i % sources.length],
    lastVisit: lastVisitDate.toISOString(),
    createdAt: createdDate.toISOString(),
    country: "Brasil",
    state: states[cityIdx],
    city: cities[cityIdx],
  };
});

export const mockEventTypes = [
  { type: "page_view", count: 18432, color: "hsl(217, 91%, 60%)" },
  { type: "button_click", count: 8210, color: "hsl(142, 71%, 45%)" },
  { type: "form_submit", count: 3420, color: "hsl(38, 92%, 50%)" },
  { type: "scroll_depth", count: 12300, color: "hsl(280, 65%, 60%)" },
  { type: "video_play", count: 1845, color: "hsl(0, 84%, 60%)" },
  { type: "download", count: 890, color: "hsl(199, 89%, 48%)" },
];

export const mockEventsTimeline = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    eventos: Math.floor(800 + Math.random() * 1200),
  };
});

export const mockGeoData = {
  countries: [
    { name: "Brasil", leads: 2200, visits: 14000 },
    { name: "Portugal", leads: 280, visits: 1800 },
    { name: "EUA", leads: 150, visits: 1200 },
    { name: "Angola", leads: 80, visits: 500 },
    { name: "Moçambique", leads: 45, visits: 300 },
  ],
  states: [
    { name: "São Paulo", leads: 845, visits: 5200 },
    { name: "Rio de Janeiro", leads: 420, visits: 2800 },
    { name: "Minas Gerais", leads: 310, visits: 1900 },
    { name: "Paraná", leads: 210, visits: 1400 },
    { name: "Rio Grande do Sul", leads: 180, visits: 1100 },
    { name: "Bahia", leads: 95, visits: 620 },
    { name: "Ceará", leads: 70, visits: 450 },
    { name: "Distrito Federal", leads: 40, visits: 280 },
    { name: "Pernambuco", leads: 20, visits: 130 },
    { name: "Amazonas", leads: 10, visits: 52 },
  ],
  cities: [
    { name: "São Paulo", state: "SP", leads: 520, visits: 3200 },
    { name: "Rio de Janeiro", state: "RJ", leads: 310, visits: 2000 },
    { name: "Belo Horizonte", state: "MG", leads: 180, visits: 1100 },
    { name: "Curitiba", state: "PR", leads: 140, visits: 900 },
    { name: "Porto Alegre", state: "RS", leads: 120, visits: 750 },
  ],
};

export const mockHeatmapData = Array.from({ length: 7 }, (_, dayIdx) =>
  Array.from({ length: 24 }, (_, hourIdx) => ({
    day: dayIdx,
    hour: hourIdx,
    value: Math.floor(Math.random() * 100),
  }))
).flat();

export const mockTemporalData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    visitas: Math.floor(400 + Math.random() * 300),
    eventos: Math.floor(1000 + Math.random() * 800),
    conversoes: Math.floor(5 + Math.random() * 20),
  };
});

export const mockRecentEvents = Array.from({ length: 20 }, (_, i) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - i * 15);
  const types = ["page_view", "button_click", "form_submit", "scroll_depth", "video_play", "download"];
  const pages = ["/home", "/pricing", "/checkout", "/about", "/blog/post-1", "/contact", "/signup", "/demo"];
  return {
    id: `evt-${i + 1}`,
    type: types[i % types.length],
    page: pages[i % pages.length],
    leadName: names[i % names.length],
    timestamp: date.toISOString(),
  };
});

export const mockFunnelDetailed = [
  { stage: "Visitantes", value: 18432, percentage: 100 },
  { stage: "Leads", value: 2847, percentage: 15.4 },
  { stage: "Qualificados", value: 1203, percentage: 6.5 },
  { stage: "Oportunidades", value: 542, percentage: 2.9 },
  { stage: "Clientes", value: 342, percentage: 1.9 },
];
