import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "@/hooks/useCompany";
import Index from "./pages/Index";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import FunnelPage from "./pages/FunnelPage";
import UTMPage from "./pages/UTMPage";
import GeoPage from "./pages/GeoPage";
import EventsPage from "./pages/EventsPage";
import TemporalPage from "./pages/TemporalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompanyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/leads/:id" element={<LeadDetailPage />} />
            <Route path="/funnel" element={<FunnelPage />} />
            <Route path="/utm" element={<UTMPage />} />
            <Route path="/geo" element={<GeoPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/temporal" element={<TemporalPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
