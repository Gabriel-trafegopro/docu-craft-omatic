import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const STALE = 30_000;

// ── Leads (v_lead_stats) ─────────────────────────────
export function useLeads(companyId: number | null) {
  return useQuery({
    queryKey: ["leads", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_lead_stats")
        .select("*")
        .eq("company_id", companyId!)
        .order("last_visit_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as Tables<"v_lead_stats">[];
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}

// ── Lead Detail ──────────────────────────────────────
export function useLeadDetail(leadId: number | null) {
  const leadQuery = useQuery({
    queryKey: ["lead-detail", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_lead_stats")
        .select("*")
        .eq("id", leadId!)
        .single();
      if (error) throw error;
      return data as Tables<"v_lead_stats">;
    },
    enabled: !!leadId,
    staleTime: STALE,
  });

  const visitsQuery = useQuery({
    queryKey: ["lead-visits", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .eq("lead_id", leadId!)
        .order("visit_datetime", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as Tables<"visits">[];
    },
    enabled: !!leadId,
    staleTime: STALE,
  });

  const eventsQuery = useQuery({
    queryKey: ["lead-events", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("lead_id", leadId!)
        .order("event_datetime", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as Tables<"events">[];
    },
    enabled: !!leadId,
    staleTime: STALE,
  });

  return { lead: leadQuery, visits: visitsQuery, events: eventsQuery };
}

// ── Funnel (v_funnel) ────────────────────────────────
export function useFunnel(companyId: number | null) {
  return useQuery({
    queryKey: ["funnel", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_funnel")
        .select("*")
        .eq("company_id", companyId!)
        .single();
      if (error) throw error;
      return data as Tables<"v_funnel">;
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}

// ── UTM Analysis (v_utm_analysis) ────────────────────
export function useUtmAnalysis(companyId: number | null) {
  return useQuery({
    queryKey: ["utm-analysis", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_utm_analysis")
        .select("*")
        .eq("company_id", companyId!)
        .order("total_visits", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as Tables<"v_utm_analysis">[];
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}

// ── Geo Analysis (v_geo_analysis) ────────────────────
export function useGeoAnalysis(companyId: number | null) {
  return useQuery({
    queryKey: ["geo-analysis", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_geo_analysis")
        .select("*")
        .eq("company_id", companyId!)
        .order("unique_leads", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Tables<"v_geo_analysis">[];
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}

// ── Events ───────────────────────────────────────────
export function useEvents(companyId: number | null) {
  return useQuery({
    queryKey: ["events", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("company_id", companyId!)
        .order("event_datetime", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as Tables<"events">[];
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}

// ── Visits ───────────────────────────────────────────
export function useVisits(companyId: number | null) {
  return useQuery({
    queryKey: ["visits", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .eq("company_id", companyId!)
        .order("visit_datetime", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as Tables<"visits">[];
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}

// ── Dashboard KPIs (aggregated from leads table) ─────
export function useDashboardKPIs(companyId: number | null) {
  return useQuery({
    queryKey: ["dashboard-kpis", companyId],
    queryFn: async () => {
      const [leadsRes, visitsRes, eventsRes, customersRes] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("company_id", companyId!),
        supabase.from("visits").select("id", { count: "exact", head: true }).eq("company_id", companyId!),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("company_id", companyId!),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("company_id", companyId!).eq("is_customer", true),
      ]);
      return {
        leads: leadsRes.count || 0,
        visits: visitsRes.count || 0,
        events: eventsRes.count || 0,
        customers: customersRes.count || 0,
      };
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}

// ── Visits Timeline (last 30 days grouped by date) ───
export function useVisitsTimeline(companyId: number | null) {
  return useQuery({
    queryKey: ["visits-timeline", companyId],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const [visitsRes, eventsRes] = await Promise.all([
        supabase
          .from("visits")
          .select("visit_date")
          .eq("company_id", companyId!)
          .gte("visit_datetime", thirtyDaysAgo.toISOString())
          .order("visit_datetime", { ascending: true })
          .limit(1000),
        supabase
          .from("events")
          .select("event_datetime")
          .eq("company_id", companyId!)
          .gte("event_datetime", thirtyDaysAgo.toISOString())
          .order("event_datetime", { ascending: true })
          .limit(1000),
      ]);

      const visitsByDate: Record<string, number> = {};
      const eventsByDate: Record<string, number> = {};

      (visitsRes.data || []).forEach((v) => {
        const d = v.visit_date || "";
        visitsByDate[d] = (visitsByDate[d] || 0) + 1;
      });
      (eventsRes.data || []).forEach((e) => {
        const d = e.event_datetime?.slice(0, 10) || "";
        eventsByDate[d] = (eventsByDate[d] || 0) + 1;
      });

      const allDates = new Set([...Object.keys(visitsByDate), ...Object.keys(eventsByDate)]);
      return Array.from(allDates)
        .sort()
        .map((date) => ({
          date: date.slice(5), // MM-DD
          visitas: visitsByDate[date] || 0,
          eventos: eventsByDate[date] || 0,
        }));
    },
    enabled: !!companyId,
    staleTime: STALE,
  });
}
